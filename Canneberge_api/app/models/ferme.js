/**
 * Created by bhacaz on 24/10/16.
 */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// create a schema
var fermeSchema = new Schema({
    name: { type: String, required: false},
    icon : {type : Buffer, contentType: String},
    geojson : {type : Object},
    centerCoordinate : {type : Object},
    markers : {type : Array, default : []}
});



// the schema is useless so far
// we need to create a model using it
var Ferme = mongoose.model('Ferme', fermeSchema);

Ferme.getFermeById = function (id, next){
    Ferme.findById(id, function (err, ferme) {
        if (err)
            console.log(err);
        next(ferme)
    });
};

Ferme.getFermeByName = function (name, next){
    Ferme.findOne({name : name}, function (err, ferme) {
        if(err)
            console.log(err);
        next(ferme);
    })
};

Ferme.dataToGeojson = function(data, geojson){
    data = tryToParseJson(data);
    for(var fieldIndex in geojson.features){
        geojson.features[fieldIndex].properties = data[fieldIndex];
    }
    return geojson;
};


Ferme.updateDataFerme = function (req, res, ferme){
    var data = tryToParseJson(req.body.data);
    if(data.length != ferme.geojson.features.length){
        res.statusMessage = 'Le nombre de ligne de \'data\' ne concorde pas';
        res.sendStatus(400);
        return;
    }
    Ferme.update({_id : ferme._id}, {geojson : Ferne.dataToGeojson(req.body.data ,ferme.geojson)}, function (err, result) {
        if(err)
            console.log(err);
        res.sendStatus(200);
    })
};



Ferme.geojsonToData = function (geojson){
    var data = [];
    for(var fieldIndex in geojson.features)
        data.push(geojson.features[fieldIndex].properties);
    return data;
};

function tryToParseJson(data){
    try{data = JSON.parse(data);}
    catch(e) {}
    return data;
};


// make this available to our users in our Node applications
module.exports = Ferme;