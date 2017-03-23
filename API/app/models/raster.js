/**
 * Created by bhacaz on 21/03/17.
 */

var express = require('express');
var raster = express.Router({mergeParams: true});
var fileDriver = require('../file_system_api/fsDriver.js');
var url = require('url');
var tiffToOverlay = require('./TiffToOverlay');
var Ferme = require('./ferme');
// var ObjectId = require('mongodb').ObjectID;

// options.encoding = req.body.encoding  || 'utf8';
// options.mode = req.body.mode || 438;
// var data = req.body.content || '';
// fileDriver.writeFile({
//     dirPath: dirPath,
//     data: data,
//     options: options,
//     opts: opts
// }, sendCode(201, req, res, next, formatOutData(req, dirPath)));

raster.post('/*', function (req, res) {
    console.log(decodeURI(url.parse(req.url).pathname));
    var fileName = decodeURI(url.parse(req.url).pathname);
    var dirTiff = __dirname + '/../file_system_api/fileSystem/' + req.params.ferme_id + fileName;

    var rasterData = tiffToOverlay.convert(dirTiff);
    console.log(rasterData);

    rasterData.path.tif = '/api/fermes/' + req.params.ferme_id + '/file' +  fileName;
    rasterData.path.png = rasterData.path.tif.replace('.tif', '.png');

    Ferme.update({_id : req.params.ferme_id},
        { $push : {rasters : rasterData} }
        , function () {

        });

});


module.exports = raster;