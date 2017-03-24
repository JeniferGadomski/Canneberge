/**
 * Created by bhacaz on 24/03/17.
 */

var fileDriver = require('../file_system_api/fsDriver.js');
var url = require('url');
var mime = require('mime');
var path = require('path');
var express = require('express');
var router = express.Router({mergeParams: true});
var fs = require('fs');
var mkdirp = require('mkdirp');
var tiffToOverlay = require('../models/TiffToOverlay');
var Ferme = require('../models/ferme');

// console.log(decodeURI(url.parse(req.url).pathname));
// var fileName = decodeURI(url.parse(req.url).pathname);
// var dirTiff = __dirname + '/../file_system_api/fileSystem/' + req.params.ferme_id + fileName;
//
// var rasterData = tiffToOverlay.convert(dirTiff);
// console.log(rasterData);
//
// rasterData.path.tif = '/api/fermes/' + req.params.ferme_id + '/file' +  fileName;
// rasterData.path.png = rasterData.path.tif.replace('.tif', '.png');
//
// Ferme.update({_id : req.params.ferme_id},
//     { $push : {rasters : rasterData} }
//     , function () {}
// );


router.get('/', getAllRasterObject);
router.post('/:raster_name', postNewRaster);
router.get('/:raster_id', getRasterObject);
router.put('/:raster_id', modifiyRaster);
router.get('/:raster_id/:file_type', getRasterFileByType);

function getAllRasterObject(req, res, next) {

}

function postNewRaster(req, res, next) {

    var ferme_id = req.params.ferme_id;
    var raster_name = req.params.raster_name;
    var path_raster = __dirname + '/../file_system_api/fileSystem/' + ferme_id + '_rasters/' + raster_name;

    console.log(req.body);
    var data = req.body.content || '';

    mkdirp(path.dirname(path_raster), function (err) {
        if (err) return cb(err);
        fs.writeFile(path_raster, data, function (err) {
            console.log(path_raster);
            var rasterData = tiffToOverlay.convert(path_raster);
            rasterData._id = new Date().getTime();
            console.log(rasterData);

            rasterData.path.tif = '/api/fermes/' + ferme_id + '/rasters/' + rasterData._id + '/tif' ;
            rasterData.path.png = rasterData.path.tif.replace('tif', 'png');

            Ferme.update({_id : req.params.ferme_id},
                { $push : {rasters : rasterData} }
                , function () {
                    res.status(200).send(rasterData);
                }
            );

        });
    });

}

function getRasterObject(req, res, next) {

}

function modifiyRaster(req, res, next) {

}

function getRasterFileByType(req, res, next) {

}


module.exports = router;