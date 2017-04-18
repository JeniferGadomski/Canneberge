/**
 * Created by bhacaz on 11/04/17.
 */


var gdal = require('gdal');
var exec = require('child_process').exec;

var fileDriver = require('../file_system_api/fsDriver.js');
var express = require('express');
var router = express.Router({mergeParams: true});
var mkdirp = require('mkdirp');
var Ferme = require('../models/ferme');
var mime = require('mime');
var uidGenerator = require('../models/uniqueIdGenerator');
var unzip = require('unzip');
var fs = require('fs');
var path = require('path');
var ogr2ogr = require('ogr2ogr');
var copydir = require('copy-dir');
var ObjectId = require('mongodb').ObjectID;


router.get('/', getAllShapefileObject);
router.post('/:shapefile_name', postNewShapefile);
router.get('/:shapefile_id', getShapefileObject);
router.delete('/:shapefile_id', deleteShapefile);
router.get('/:shapefile_id/features', getFeaturesGeojson);
router.put('/:shapefile_id', updateGeojson);

function getAllShapefileObject(req, res, next) {
    Ferme.getFermeById(req.params.ferme_id, function (ferme) {
        return res.send(ferme.shapefiles);
    });
}

function postNewShapefile(req, res, next) {
    var uid = uidGenerator();
    var filename = req.params.shapefile_name;
    var fermeId = req.params.ferme_id;
    var pathHide = __dirname + '/../file_system_api/fileSystem/' + fermeId + '_rasters/' + uid + '/' + uid + '.zip';
    var pathFermeFolder = __dirname + '/../file_system_api/fileSystem/' + fermeId + '/' + filename + '/' + filename + '.zip';
    var pathFermeFolderWithoutEx = path.dirname(pathFermeFolder) + '/' + filename;

    // Write file
    // default is to not clobber
    var options = {};
    var opts = req.body.opts;
    options.encoding = req.query.encoding  || 'utf8';
    options.mode = req.query.mode || 438;
    options.flags =  req.query.clobber === 'true' ? 'w' : 'wx';

    // Save copie in ferme folder file
    return fileDriver.writeFileStream({
        dirPath: pathFermeFolder,
        stream: req,
        options: options,
        opts: opts
    }, function () {
        fs.createReadStream(pathFermeFolder)
            .pipe(unzip.Extract({ path: path.dirname(pathFermeFolder) })
                .on('close', function () {
                    renameAllFile(path.dirname(pathFermeFolder), filename, function(){
                        createImage(pathFermeFolderWithoutEx, function () {
                            shapefileToGeojson(pathFermeFolderWithoutEx, function (geojson) {
                                backupShapefile(path.dirname(pathFermeFolder), path.dirname(pathHide), function () {
                                    var pngPath = '/api/fermes/' + fermeId + '/shapefiles/' + uid + '.png' ;
                                    var newShapefile = {
                                        _id : uid,
                                        geojson : geojson,
                                        name : filename,
                                        path : {
                                            png : pngPath,
                                            zip : pngPath.replace('.png', '.zip')
                                        }
                                    };
                                    Ferme.findByIdAndUpdate(fermeId, {$push : {shapefiles : newShapefile}}, function (err, model) {
                                        if(err) return res.status(400).send(err);
                                        res.send(newShapefile);
                                    });
                                })
                            });
                        });
                    });
                }));
    });
}

function getShapefileObject(req, res, next) {
    var shapefileId = (req.params.shapefile_id).toLowerCase();
    if(shapefileId.indexOf('.') !== -1)
        return getShapefileFile(req, res, next);

    Ferme.getFermeById(req.params.ferme_id, function (ferme) {
        for(var i = 0; i < ferme.shapefiles.length; i++){
            if(ferme.shapefiles[i]._id === shapefileId)
                return res.status(200).send(ferme.shapefiles[i]);
        }
        return res.status(404).send({success : false, message : 'No shapefile found'});
    });
}

function deleteShapefile(req, res, next) {
    var shapefileId = req.params.shapefile_id;
    var fermeId = req.params.ferme_id;
    var pathHide = __dirname + '/../file_system_api/fileSystem/' + fermeId + '_rasters/' + shapefileId + '/';

    Ferme.update(
        {_id: ObjectId(fermeId)},
        { $pull: {shapefiles : {_id : shapefileId }} },
        function (err, obj) {
            if(err) return res.status(404).send({success : false, message: 'Error deleting a rasters'});
            // deleteRastersFile(ferme_id, raster_id);
            exec('rm -fr ' + pathHide, function (err, stdout, stderr) {
                return res.status(200).send(obj);
            });
        });
}

function getShapefileFile(req, res, next) {
    var shapefileId = (req.params.shapefile_id).toLowerCase();
    var fermeId = req.params.ferme_id;
    var pathHide = __dirname + '/../file_system_api/fileSystem/' + fermeId + '_rasters/' + shapefileId.split('.')[0] + '/' +shapefileId;

    if(shapefileId.indexOf('.json') !== -1){
        Ferme.getFermeById(fermeId, function (ferme) {
            for (var i = 0; i < ferme.shapefiles.length; i++) {
                var shp = ferme.shapefiles[i];
                if(shp._id === shapefileId)
                    return res.send(shp.geojson);
            }
            return res.status(404).send({message : 'Shapefile not found'});
        })
    }

    var encoding = req.query.encoding || 'utf8';
    var opts = req.body.opts;

    fileDriver.readFile({
        filePath : pathHide,
        encoding: encoding,
        opts: opts
    }, function (err, data) {
        if(err) return res.status(404).send({success : false, message : 'Error no file'});
        res.set('Content-Type', mime.lookup(pathHide));
        res.send(data);
    })
}

function createImage(path, next) {
    exec('python ' + __dirname + '/../models/shp2png/shp2png.py ' + path, function(error, stdout, stderr) {
        if (error !== null) console.log('exec error: ' + error);
        next();
    });
}

var renameAllFile = function (workPath, newName, next) {
    var args = {};
    args.dirPath =  workPath;
    fileDriver.listAll(args, function (_null, files) {
        for(var i = 0; i < files.length; i++){
            fs.rename(files[i], workPath + '/' + newName + path.extname(files[i]), function (){})
        }
        next();
    });
};

function shapefileToGeojson(path, next) {
    var zipFile = path + '.zip';
    var og = ogr2ogr(zipFile).project('EPSG:4326').format();
    og.exec(function (er, data) {
        if (er) console.error(er);
        next(data);
    })
}

function geojsonToShapefile(geojson, path, next) {
    var og = ogr2ogr(geojson).project('EPSG:26918').format('ESRI Shapefile');
    og.exec(function (er, zipData) {
        if(er) console.error(er);
        fs.writeFile(path + '.zip', zipData, function () {next()});
    });
}

function backupShapefile(orignalPath, newPath, next) {
    copydir(orignalPath, newPath, function (err) {
        renameAllFile(newPath, newPath.split('/').slice(-1)[0], function () {
            next();
        });
    });
}

function getFeaturesGeojson(req, res, next) {
    var shapefileId = req.params.shapefile_id;
    var fermeId = req.params.ferme_id;

    Ferme.getFermeById(fermeId, function (ferme) {
        for (var i = 0; i < ferme.shapefiles.length; i++) {
            var shp = ferme.shapefiles[i];
            if(shp._id === shapefileId)
                return res.send(Ferme.geojsonToData(shp.geojson));
        }
        return res.status(404).send({message : 'Shapefile not found'});
    })
}

function updateGeojson(req, res, next) {
    var shapefileId = req.params.shapefile_id;
    var fermeId = req.params.ferme_id;
    var path = __dirname + '/../file_system_api/fileSystem/' + fermeId+ '_rasters/' + shapefileId + '/';


    var shapefileId = req.params.shapefile_id;
    var fermeId = req.params.ferme_id;
    if(req.body.features){
        var features = req.body.features;
        Ferme.getFermeById(fermeId, function (ferme) {
            for (var i = 0; i < ferme.shapefiles.length; i++) {
                var shp = ferme.shapefiles[i];
                if(shp._id === shapefileId){
                    var newGeojson = Ferme.dataToGeojson(features, shp.geojson);
                    Ferme.update({_id : ObjectId(req.params.ferme_id), "shapefiles._id" : shapefileId},
                        {$set : {"shapefiles.$.geojson" : newGeojson}}, function (err, result) {
                        if(err) return res.status(400).send({message : 'Error updating geojson'});
                        geojsonToShapefile(newgeojson, path, function () {
                            return res.send(result);
                        });
                    });
                    return;
                }
            }
            return res.status(400).send({message : 'No shapefile found'});
        });
    }
    else if(req.body.geojson){
        var newgeojson = JSON.parse(req.body.geojson);
        Ferme.update({_id : ObjectId(req.params.ferme_id), "shapefiles._id" : shapefileId},
            {$set : {"shapefiles.$.geojson" : newgeojson}}, function (err, result) {
                if(err) return res.status(400).send({message : 'Error updating geojson'});
                geojsonToShapefile(newgeojson, path, function () {
                    return res.send(result);
                });
            });
    }
    else res.status(400).send({message : 'Body must content \'features\' or \'geojson\'.'});
}

module.exports = router;