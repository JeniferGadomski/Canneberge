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

/**
 * @api {get} /fermes/:id/rasters Get all rasters info
 * @apiName Get all info
 * @apiGroup Rasters
 * @apiDescription Get all rasters object of a ferme.
 *
 * @apiPermission apiKey
 * @apiPermission fermeAccess
 *
 * @apiParam {String} id The id of the ferme
 *
 * @apiSuccess {Object[]} list List of rasters object
 * @apiSuccess {Stinng} list._id Id of the raster
 * @apiSuccess {Object} list.date Object with two format for the date
 * @apiSuccess {String} list.date.string The date formated dd MMMM YYYY
 * @apiSuccess {Number} list.date.time The number of milliseconds since 1 janv 1970
 * @apiSuccess {Object} list.path Object containing the url for the api to get the files
 * @apiSuccess {String} list.path.tif Url for the tif file
 * @apiSuccess {String} list.path.png Url for the png file
 * @apiSuccess {Object} list.bounds With <code> .north .south .west .east</code>
 * @apiSuccess {Object} list.band With <code> .min .max .mean </code>
 * @apiSuccessExample {html} Success example
 * <a href="example.html#example-rasters">Example rasters</a>
 */
router.get('/', getAllRasterObject);
/**
 * @api {post} /fermes/:id/rasters/:name Add raster
 * @apiName Add raster
 * @apiGroup Rasters
 * @apiDescription Create a new raster for the ferme.
 *
 * @apiPermission apiKey
 * @apiPermission fermeAccess
 *
 * @apiParam {String} id The id of the ferme
 * @apiParam {String} name The name of the raster
 * @apiParam {Number} [date=today] The time (milliseconds) since 1 janv. 1970
 * @apiParam {File} file A raw file as stream of a .tif file.
 * @apiParamExample {String} Request example
 * /api/fermes/1234567890/rasters/My_New_Raster?date=14022465698
 *
 * @apiError NoStreamFile The body must be a raw stream
 */
router.post('/:raster_name', postNewRaster);

/**
 * @api {get} /fermes/:id/rasters/:raster_id Get raster info
 * @apiName Get raster info
 * @apiGroup Rasters
 * @apiDescription Get the informations of a raster by its id in a object.
 *
 * @apiPermission apiKey
 * @apiPermission fermeAccess
 *
 * @apiParam {String} id The id of the ferme
 * @apiParam {String} raster_id The id of the raster
 * @apiParamExample {String} Request example
 * /api/fermes/1234567890/rasters/14022465698
 *
 * @apiSuccess {Object} object A object with the info of the raster. See :  <a href="#api-Rasters-Get_all_info">Get all rasters</a>
 * @apiError BadRasterId No raster found
 */

/**
 * @api {get} /fermes/:id/rasters/:raster_id.type Get raster file
 * @apiName Get raster file
 * @apiGroup Rasters
 * @apiDescription Get the file of a raster. Valid option .png or .tif
 *
 * @apiPermission apiKey
 * @apiPermission fermeAccess
 *
 * @apiParam {String} id The id of the ferme
 * @apiParam {String} raster_id The id of the raster
 * @apiParam {String} type The type of the file. Only : <code>.png</code>, <code>.tif</code>
 * @apiParamExample {String} Request example png
 * /api/fermes/1234567890/rasters/14022465698.png
 * @apiParamExample {String} Request example tif
 * /api/fermes/1234567890/rasters/14022465698.tif
 *
 * @apiSuccess {File} file A stream of the file.
 *
 * @apiError BadRasterId No raster found
 * @apiError BadFileExtension Bad extension, must be .png or .tif
 *
 */
router.get('/:raster_id', getRasterObject);

/**
 * @api {delete} /fermes/:id/rasters/:raster_id Delete raster
 * @apiName Delete raster
 * @apiGroup Rasters
 * @apiDescription Delete the raster, info, tif and png from the server.
 *
 * @apiPermission apiKey
 * @apiPermission fermeAccess
 *
 * @apiParam {String} id The id of the ferme
 * @apiParam {String} raster_id The id of the raster
 *
 * @apiError ErrorDelete Error deleting a rasters
 *
 */
router.delete('/:raster_id', deleteRaster);

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
    rasterData.path.tif = '/api/fermes/' + ferme_id + '/rasters/' + rasterData._id + '.tif' ;
    rasterData.path.png = rasterData.path.tif.replace('.tif', '.png');

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
        }, function (err) { // Convert .tif file
            if(err) return console.log(err);
            // rasterData = Object.assign({}, rasterData, tiffToOverlay.convert(dirPath));
            tiffToOverlay.convert(dirPath, function (tiffData) {
                rasterData = Object.assign({}, rasterData, tiffData);
                Ferme.update({_id : req.params.ferme_id},
                    { $push : {
                        rasters : {
                            $each : [rasterData],
                            $sort : {"date.time" : 1}
                        }}
                    }
                    , function () {
                        res.status(200).send(rasterData);
                    }
                );
            });
        });
    }
    else res.status(400).send({success : false, message : 'The body must be a raw stream'});
}

function getRasterObject(req, res, next) {
    var raster_id = (req.params.raster_id).toLowerCase();
    if(raster_id.indexOf('.png') !== -1 || raster_id.indexOf('.tif') !== -1 )
        return getRasterFileByType(req, res, next);

    Ferme.getFermeById(req.params.ferme_id, function (ferme) {
        for(var i = 0; i < ferme.rasters.length; i++){
            if(ferme.rasters[i]._id === req.params.raster_id)
                return res.status(200).send(ferme.rasters[i]);
        }
        return res.status(404).send({success : false, message : 'No raster found'});
    });
}

function getRasterFileByType(req, res, next) {
    var ferme_id = req.params.ferme_id;
    var raster_id = req.params.raster_id;
    var filePath = __dirname + '/../file_system_api/fileSystem/' + ferme_id + '_rasters/' + raster_id;

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