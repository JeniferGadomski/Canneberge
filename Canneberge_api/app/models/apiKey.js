var User   = require('../models/user'); // get our mongoose model
var apiKey = {};

apiKey.getApiFromReq = function(req) {
    return req.body.apiKey || req.query.apiKey || req.headers['x-access-token'];
};

apiKey.isAdmin = function (req, res, next) {
    var id = this.getApiFromReq(req);
    User.findById(id, function (err, user) {
        if(!user.authorization.admin) res.status(401).send({success : false, message : 'unauthorized'});
        else next();
    })
};

apiKey.sameUserOrAdmin = function (req, res, next) {
    var id = this.getApiFromReq(req);
    User.findById(id, function (err, user) {
        console.log(req.params.user_id === id);
        if(user.authorization.admin || req.params.user_id === id) return next();
        else res.status(401).send({success : false, message : 'unauthorized'})
    })
};

apiKey.fermeAuthorization = function (req, res, next) {
    var id = this.getApiFromReq(req);
    var fermeId = req.params.ferme_id || req.query.fermeId;
    var fermeName = req.query.fermeName;
    if(fermeId){
        User.findById(id, function (err, user) {
            if(user.authorization.admin) return next(); // Check if is admin
            user.authorization.fermes.forEach(function (f) { // If not admin check if autorized
                if(f._id === fermeId)
                    return next();
                return res.status(401).send({success : false, message : 'unauthorized'}); // Return error if ferme not found
            })
        });
    }
    else if(fermeName){
        User.findById(id, function (err, user) {
            if(user.authorization.admin) return next(); // Check if is admin
            user.authorization.fermes.forEach(function (f) { // If not admin check if autorized
                if(f.name === fermeName)
                    return next();
                return res.status(401).send({success : false, message : 'unauthorized'}); // Return error if ferme not found
            })
        });
    }
    else
        return res.status(401).send({success : false, message : 'unauthorized'}); // Return error if ferme not found
};

module.exports = apiKey;