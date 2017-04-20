/**
 * Created by bhacaz on 24/10/16.
 */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt   = require('bcrypt');

// create a schema
var userSchema = new Schema({
    firstname: {type : String},
    lastname: {type : String},
    email: { type: String, required: true, unique: true },
    password: { type: String, default : 'default' },
    username: { type: String, required: true, unique: true },
    scripts : {type : Array},
    authorization : {
        admin : {type : Boolean, default : false},
        fermes : {type : Array},
        blocked : {type : Boolean, default : true}
    }
});

userSchema.pre('save', function (next) {
    var user = this;
    if (this.isModified('password') || this.isNew) {
        bcrypt.genSalt(10, function (err, salt) {
            if (err) {
                return next(err);
            }
            bcrypt.hash(user.password, salt, function (err, hash) {
                if (err) {
                    return next(err);
                }
                user.password = hash;
                next();
            });
        });
    } else {
        return next();
    }
});


userSchema.methods.comparePassword = function (passw, cb) {
    bcrypt.compare(passw, this.password, function (err, isMatch) {
        if (err) {
            return cb(err);
        }
        cb(null, isMatch);
    });
};

userSchema.methods.getSimplifyUserData = function(user){
    return {
        _id : user._id,
        email : user.email,
        username : user.username,
        admin : user.admin
    };
};

userSchema.methods.getRedirections = function () {
    var url = [];
    if(this.authorization.admin)
        url.push({
            name : 'Page administrateur',
            url : 'http://admin.canneberge.io'
        });
    this.authorization.fermes.forEach(function (f) {
        url.push({
            name : f.name,
            url : 'http://carte.canneberge.io/?fermeId=' + f._id
        });
    });
    return url;
};

// make this available to our users in our Node applications
module.exports = mongoose.model('User', userSchema);