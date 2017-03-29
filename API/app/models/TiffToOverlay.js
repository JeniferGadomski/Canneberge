/**
 * Created by bhacaz on 16/03/17.
 */

var gdal = require('gdal');
var exec = require('child_process').exec;

var TiffToOverlay = {};

TiffToOverlay.convert = function(tiffFilePath, cb){
    var _this = this;
    console.log(tiffFilePath);
    var namePng = tiffFilePath.replace('.tif', '.png');
    exec('gdal_translate -a_nodata 0 -of PNG -scale ' + tiffFilePath + ' ' + namePng, function(error, stdout, stderr) {
        // console.log('stdout: ' + stdout);
        // console.log('stderr: ' + stderr);
        if (error !== null) {
            console.log('exec error: ' + error);
        }
        var data =  _this.getLatLngBoundsLiteral(tiffFilePath);
        cb({
            bounds : data.bounds,
            band : data.band
        });
    });
};

TiffToOverlay.getLatLngBoundsLiteral = function (tiffFilePath) {
    var dataset = gdal.open(tiffFilePath);
    var band = {};
    dataset.bands.forEach(function(bandDes) {

        band.min = bandDes.minimum;
        band.max = bandDes.maximum;
        band.mean = ((band.min + band.max) / 2);
    });

    var NorthWestX = dataset.geoTransform[0];
    var NorthWestY =dataset.geoTransform[3];
    var resolutionX = dataset.geoTransform[1];
    var resolutionY = dataset.geoTransform[5];

    var SouthEstX = NorthWestX + (dataset.rasterSize.x * resolutionX);
    var SouthEstY = NorthWestY + (dataset.rasterSize.y * resolutionY);

    var trans = new gdal.CoordinateTransformation(dataset.srs, gdal.SpatialReference.fromEPSG ( 4326 ));
    var bands = trans.transformPoint(NorthWestX, NorthWestY);
    var NorthWestCoord = {lat : bands.y, lng : bands.x};

    bands = trans.transformPoint(SouthEstX, SouthEstY);
    var SouthEstCoord = {lat : bands.y, lng : bands.x};

    var bounds = {
        north: Math.max(NorthWestCoord.lat, SouthEstCoord.lat),
            south: Math.min(NorthWestCoord.lat, SouthEstCoord.lat),
            east: Math.max(NorthWestCoord.lng, SouthEstCoord.lng),
            west: Math.min(NorthWestCoord.lng, SouthEstCoord.lng)
    };

    return {
        bounds : bounds,
        band : band
    };
};

module.exports = TiffToOverlay;




