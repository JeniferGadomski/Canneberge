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
    admin: {type : Boolean, default : false},
    username: { type: String, required: true, unique: true }
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

// make this available to our users in our Node applications
module.exports = mongoose.model('User', userSchema);