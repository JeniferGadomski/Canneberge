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
var ObjectId = require('mongodb').ObjectID;
var mime = require('mime');
var uidGenerator = require('../models/uniqueIdGenerator');
var unzip = require('unzip');
var fs = require('fs');
var path = require('path');
var ogr2ogr = require('ogr2ogr');
var fsExtra = require('fs-extra');
var copydir = require('copy-dir');


router.get('/', getAllShapefileObject);
router.post('/:shapefile_name', postNewShapefile);
router.get('/:shapefile_id', getShapefileObject);
router.delete('/:shapefile_id', deleteShapefile);

function getAllShapefileObject(req, res, next) {

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

    // TODO copie all file with a different name (uid) into a new folder name : uid
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
                                    var zipPath = pngPath.replace('.png', '.zip');
                                    var jsonPath = pngPath.replace('.png', '.json');
                                    var newShapefile = {
                                        _id : uid,
                                        geojson : geojson,
                                        name : filename,
                                        path : {
                                            png : pngPath,
                                            zip : zipPath,
                                            json : jsonPath
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
    // console.log(path);
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
        fs.writeFile(path + '.json', JSON.stringify(data, null, 4), function () {next(data)});
    })

}

function backupShapefile(orignalPath, newPath, next) {
    copydir(orignalPath, newPath, function (err) {
        // console.log('ok');
        renameAllFile(newPath, newPath.split('/').slice(-1)[0], function () {
            next();
        });
    });
}

module.exports = router;