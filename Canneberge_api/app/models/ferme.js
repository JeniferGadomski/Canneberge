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

// make this available to our users in our Node applications
module.exports = Ferme;