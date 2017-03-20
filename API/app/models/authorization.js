var User   = require('../models/user'); // get our mongoose model
var Ferme =require('../models/ferme');
var authorization = {};

authorization.getApiFromReq = function(req) {
    return req.body.apiKey || req.query.apiKey || req.headers['x-access-token'];
};

authorization.isAdmin = function (req, res, next) {
    var id = this.getApiFromReq(req);
    User.findById(id, function (err, user) {
        if(!user.authorization.admin) res.status(401).send({success : false, message : 'unauthorized'});
        else next();
    })
};

authorization.sameUserOrAdmin = function (req, res, next) {
    var id = this.getApiFromReq(req);
    User.findById(id, function (err, user) {
        // console.log(req.params.user_id === id);
        if(user.authorization.admin || req.params.user_id === id) return next();
        else res.status(401).send({success : false, message : 'unauthorized'})
    })
};

authorization.fermeExiste = function (req, res, next) {
    var fermeId = req.params.ferme_id || req.query.fermeId;
    // console.log(fermeName);
    // console.log(req);
    // Check if ferme existe
    if(fermeId){
        Ferme.findById(fermeId, function (err, ferme) {
            if(err){
                res.status(404).send({success : false, message : 'ferme not found'}); // Return error if ferme not found
            }
            else next();
        });
    }
    else res.status(404).send({success : false, message : 'ferme not found'}); // Return error if ferme not found
};

authorization.fermeAuthorization = function (req, res, next) {
    var id = this.getApiFromReq(req);
    var fermeId = req.params.ferme_id || req.query.fermeId;
    var fermeName = req.query.fermeName;


    User.findById(id, function (err, user) {
        //console.log(JSON.stringify(user));
        if(user.authorization.admin) return next(); // Check if is admin
        else if(fermeId){
            for(var i = 0; i < user.authorization.fermes.length; i++){
                if(user.authorization.fermes[i]._id === fermeId)
                    return next();
            }
            return res.status(401).send({success : false, message : 'unauthorized'}); // Return error if ferme not found
        }
        else if(fermeName){
            for(var i = 0; i < user.authorization.fermes.length; i++){
                if(user.authorization.fermes[i].name === fermeName)
                    return next();
            }
            return res.status(401).send({success : false, message : 'unauthorized'}); // Return error if ferme not found
        }
        else
            return res.status(401).send({success : false, message : 'unauthorized'}); // Return error if ferme not found
    });
};



module.exports = authorization;