/**
 * Created by bhacaz on 24/03/17.
 */

var fileDriver = require('../file_system_api/fsDriver.js');
var express = require('express');
var router = express.Router({mergeParams: true});
var mkdirp = require('mkdirp');
var tiffToOverlay = require('../models/TiffToOverlay');
var Ferme = require('../models/ferme');
var dateFormat = require('dateformat');
var ObjectId = require('mongodb').ObjectID;
var mime = require('mime');

router.get('/', getAllRasterObject);
router.post('/:raster_name', postNewRaster);
router.get('/:raster_id', getRasterObject);
router.delete('/:raster_id', deleteRaster);
router.get('/:raster_id/:file_type', getRasterFileByType);

function getAllRasterObject(req, res, next) {
    Ferme.getFermeById(req.params.ferme_id, function (ferme) {
        res.status(200).send(ferme.rasters);
    });
}

function postNewRaster(req, res, next) {

    var currentDate = new Date();

    var ferme_id = req.params.ferme_id;
    var raster_name = req.params.raster_name.replace('.tif', '');
    var _id = (currentDate.getTime()) + '' + Math.floor(Math.random() * 100);
    var queryDate = req.query.date || currentDate;
    if(req.query.date){
        queryDate = new Date(parseInt(req.query.date));
    }

    var dirPath = __dirname + '/../file_system_api/fileSystem/' + ferme_id + '_rasters/' + _id + '.tif';
    var rasterData = {};
    rasterData._id = _id;
    rasterData.date = {};
    rasterData.date.string = getStringFormatedDate(queryDate);
    rasterData.date.time = queryDate.getTime();
    rasterData.name = raster_name;
    rasterData.path = {};
    rasterData.path.tif = '/api/fermes/' + ferme_id + '/rasters/' + rasterData._id + '/tif' ;
    rasterData.path.png = rasterData.path.tif.replace('/tif', '/png');

    if (typeof req.headers['content-type'] === 'string') {
        var isJson = ~req.headers['content-type'].indexOf('application/json') === -1 ? true : false;
    }

    var options = {};
    var opts = req.body.opts;
    options.encoding = req.body.encoding  || 'utf8';
    options.mode = req.body.mode || 438;

    if (!isJson) {
        // default is to not clobber
        options.encoding = req.query.encoding  || 'utf8';
        options.mode = req.query.mode || 438;
        options.flags =  req.query.clobber === 'true' ? 'w' : 'wx';
        var dirPathCopie = __dirname + '/../file_system_api/fileSystem/' + ferme_id + '/' + req.params.raster_name;

        // Save copie in ferme folder file
        fileDriver.writeFileStream({
            dirPath: dirPathCopie,
            stream: req,
            options: options,
            opts: opts
        }, function () {});

        // Save in raster file and create PNG and raster object in rasters array of Ferme object
        return fileDriver.writeFileStream({
            dirPath: dirPath,
            stream: req,
            options: options,
            opts: opts
        }, function () { // Convert .tif file
            rasterData = Object.assign({}, rasterData, tiffToOverlay.convert(dirPath));
            // rasterData = tiffToOverlay.convert(dirPath);

            Ferme.update({_id : req.params.ferme_id},
                { $push : {rasters : rasterData} }
                , function () {
                    res.status(200).send(rasterData);
                }
            );
        });
    }
    else res.status(400).send({success : false, message : 'The body must be a raw stream'});
}

function getRasterObject(req, res, next) {
    Ferme.getFermeById(req.params.ferme_id, function (ferme) {
        for(var i = 0; i < ferme.rasters.length; i++){
            if(ferme.rasters[i]._id === req.params.raster_id)
                return res.status(200).send(ferme.rasters[i]);
        }
    });
}

function getRasterFileByType(req, res, next) {
    var ferme_id = req.params.ferme_id;
    var raster_id = req.params.raster_id;
    var file_type = (req.params.file_type).toLowerCase();

    if(file_type !== 'png' && file_type !== 'tif')
        return res.status(400).send({success : false, message : 'File type must be \'png\' or \'tif\''});

    var filePath = __dirname + '/../file_system_api/fileSystem/' + ferme_id + '_rasters/' + raster_id + '.' + file_type;

    var encoding = req.query.encoding || 'utf8';
    var opts = req.body.opts;

    fileDriver.readFile({
        filePath : filePath,
        encoding: encoding,
        opts: opts
    }, function (err, data) {
        if(err) return res.status(404).send({success : false, message : 'Error no file'});
        res.set('Content-Type', mime.lookup(filePath));
        res.send(data);
    })

}

function deleteRaster(req, res, next) {
    var ferme_id = req.params.ferme_id;
    var raster_id = req.params.raster_id;
    Ferme.update(
        {_id: ObjectId(ferme_id)},
        { $pull: {rasters : {_id : raster_id }} },
        function (err, obj) {
            if(err) return res.status(404).send({success : false, message: 'Error deleting a rasters'});
            deleteRastersFile(ferme_id, raster_id);
            return res.status(200).send(obj);
        });
}

function getStringFormatedDate(date) {
    return dateFormat(date, 'd mmmm yyyy');
}

function deleteRastersFile(ferme_id, raster_id) {
    var args = {};
    args.dirPath =  __dirname + '/../file_system_api/fileSystem/' + ferme_id + '_rasters/';
    fileDriver.listAll(args, function (_null, files) {
        for(var i = 0; i < files.length; i++){
            if(files[i].indexOf(raster_id) !== -1){
                args.dirPath = files[i];
                fileDriver.unlink(args, function (err) {
                    if(err) console.log(err);
                })
            }
        }
    });
}

module.exports = router;