/**
 * Created by bhacaz on 11/04/17.
 */


var gdal = require('gdal');
var exec = require('child_process').exec;

var fileDriver = require('../file_system_api/fsDriver.js');
var express = require('express');
var router = express.Router({mergeParams: true});
var mkdirp = require('mkdirp');
var tiffToOverlay = require('../models/TiffToOverlay');
var Ferme = require('../models/ferme');
var dateFormat = require('dateformat');
var ObjectId = require('mongodb').ObjectID;
var mime = require('mime');
var uidGenerator = require('../models/uniqueIdGenerator');



router.get('/', getAllShapefileObject);
router.post('/:shapefile_name', postNewShapefile);
router.get('/:shapefile_id', getShapefileObject);
router.delete('/:shapefile_id', deleteShapefile);

function getAllShapefileObject(req, res, next) {

}

function postNewShapefile(req, res, next) {

}

function getShapefileObject(req, res, next) {

}

function deleteShapefile(req, res, next) {

}

function getShapefileFile(req, res, next) {

}

module.exports = router;