/**
 * Created by bhacaz on 16/03/17.
 */

var gdal = require('gdal');
var exec = require('child_process').exec;
var path = require('path');

var TiffToOverlay = {};

TiffToOverlay.convert = function(tiffFilePath, cb){
    var _this = this;
    var namePng = tiffFilePath.replace('.tif', '.png');
    var trans_tif = tiffFilePath.replace('.tif', '_4326.tif');

    exec('gdalwarp -t_srs EPSG:4326 ' + tiffFilePath + ' ' + trans_tif, function(error, stdout, stderr) {
        if (error !== null) console.log('exec error: ' + error);
        exec('gdal_translate -a_nodata 0 -of PNG -scale ' + trans_tif + ' ' + namePng, function(error, stdout, stderr) {
            if (error !== null) console.log('exec error: ' + error);
            // var data =  _this.getLatLngBoundsLiteral(trans_tif);
            cb({
                bounds : _this.getLatLngBoundsLiteral(trans_tif),
                band : _this.getDataMinMaxMean(tiffFilePath)
            });
            _this.cleanDirectory(tiffFilePath);
        });
    });
};

TiffToOverlay.getLatLngBoundsLiteral = function (tiffFilePath) {
    var dataset = gdal.open(tiffFilePath);
    var NorthWestX = dataset.geoTransform[0];
    var NorthWestY = dataset.geoTransform[3];
    var resolutionX = dataset.geoTransform[1];
    var resolutionY = dataset.geoTransform[5];

    var SouthEstX = NorthWestX + (dataset.rasterSize.x * resolutionX);
    var SouthEstY = NorthWestY + (dataset.rasterSize.y * resolutionY);

    return {
        north: Math.max(NorthWestY, SouthEstY),
            south: Math.min(NorthWestY, SouthEstY),
            east: Math.max(NorthWestX, SouthEstX),
            west: Math.min(NorthWestX, SouthEstX)
    };
};

TiffToOverlay.getDataMinMaxMean = function (tiffFilePath) {
    var dataset = gdal.open(tiffFilePath);
    var band = {};
    dataset.bands.forEach(function(bandDes) {

        band.min = bandDes.minimum;
        band.max = bandDes.maximum;
        band.mean = ((band.min + band.max) / 2);
    });

    return band;
};

TiffToOverlay.cleanDirectory = function (tiffFilePath) {
    var dir = path.dirname(tiffFilePath);
    exec('rm ' + dir + '/*_4326* ' + dir + '/*.xml', function(error, stdout, stderr) {
        if (error !== null) console.log('exec error: ' + error);
    })
};

module.exports = TiffToOverlay;




