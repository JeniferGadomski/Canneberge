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


    // Write file
    // default is to not clobber
    var options = {};
    var opts = req.body.opts;
    options.encoding = req.query.encoding  || 'utf8';
    options.mode = req.query.mode || 438;
    options.flags =  req.query.clobber === 'true' ? 'w' : 'wx';

    // Save copie in ferme folder file
    fileDriver.writeFileStream({
        dirPath: pathFermeFolder,
        stream: req,
        options: options,
        opts: opts
    }, function () {
        fs.createReadStream(pathFermeFolder)
            .pipe(unzip.Extract({ path: path.dirname(pathFermeFolder) })
                .on('close', function () {
                    renameAllFile(path.dirname(pathFermeFolder), filename, function(){})
                }));
    });

    // Save in raster file and create PNG and raster object in rasters array of Ferme object
    return fileDriver.writeFileStream({
        dirPath: pathHide,
        stream: req,
        options: options,
        opts: opts
    }, function (err) {
        if(err) return res.status(400).send(err.message);
        fs.createReadStream(pathHide).pipe(unzip.Extract({ path: path.dirname(pathHide) })
            .on('close', function () {
                renameAllFile(path.dirname(pathHide), uid, function(){
                    res.send('OK');
                })
            }));
    });
}

function getShapefileObject(req, res, next) {

}

function deleteShapefile(req, res, next) {

}

function getShapefileFile(req, res, next) {

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

module.exports = router;