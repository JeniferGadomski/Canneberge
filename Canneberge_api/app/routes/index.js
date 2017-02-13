var express = require('express');
var router = express.Router();
var User   = require('../models/user'); // get our mongoose model
var Ferme = require('../models/ferme');
var passport = require('passport');
var jwt    = require('jwt-simple'); // used to create, sign, and verify tokens
var database = require('../config/database'); // get our config file
var ObjectId = require('mongodb').ObjectID;
var fs = require('fs');
var multer = require('multer');
var Jimp = require("jimp");
var request = require('request');
var path = require('path');
var rio = require('rio');

router.get('/', function(req, res) {
    res.send('Hello! The API is at http://localhost:8080/api');
});

router.post('/authenticate', function(req, res) {
    // find the user
    User.findOne({
        email: req.body.email
    }, function(err, user) {
        if (err) throw err;
        if (!user) {
            res.json({ success: false, message: 'Authentication failed. User not found.' });
        } else if (user) {
            // check if password matches
            user.comparePassword(req.body.password, function (err, isMatch) {
                if (isMatch && !err) {
                    var token = jwt.encode(user, database.secret);

                    // return the information including token as JSON
                    res.json({
                        success: true,
                        message: 'Enjoy your token!',
                        token: token
                    });
                } else {
                    res.send({success: false, message: 'Authentication failed. Wrong password.'});
                }
            });
        }
    });
});

// router.use(function(req, res, next) {
//     // check header or url parameters or post parameters for token
//     var token = req.body.token || req.query.token || req.headers['x-access-token'];
//     // decode token
//     if (token) {
//         var decoded = jwt.decode(token, database.secret);
//         User.findOne({
//             email: decoded.email
//         }, function(err, user) {
//             if (err) throw err;
//
//             if (!user) {
//                 return res.status(403).send({
//                     success: false,
//                     message: 'Authentication failed. User not found.'});
//             } else {
//                 req.decoded = decoded;
//                 next();
//             }
//         });
//     } else {
//         return res.status(403).send({success: false, msg: 'No token provided.'});
//     }
// });


router.route('/users')
    .get(function (req, res) {
        User.find({}, function (err, users) {
            res.json(users);
        });
    })
    .post(function(req, res) {
            // if(!req.decoded.admin){
            //     res.json({success: false, message: 'Admin only'});
            // }
            // else if (!req.body.email || !req.body.password) {
            //     res.json({success: false, message: 'Please pass email and password.'});
            // }
            // else {
            //     var newUser = new User({
            //         name: req.body.name,
            //         email: req.body.email,
            //         password: req.body.password,
            //         admin: req.body.admin
            //     });
            //     // save the user
            //     newUser.save(function (err) {
            //         if (err) {
            //             return res.json({success: false, message: err.message});
            //         }
            //         res.json({success: true, message: 'Successful created new user.'});
            //     });
            // }
        var newUser = new User({
            firstname: req.body.firstname,
            lastname: req.body.lastname,
            email: req.body.email,
            username : req.body.username,
            admin: req.body.admin
        });
        console.log(newUser);
        // save the user
        newUser.save(function (err) {
            if (err) {
                return res.json({success: false, message: err.message});
            }
            res.json({success: true, message: 'Successful created new user.'});
        });
    });

router.route('/users/:user_id')
    .get(function (req, res) {
        // if(req.decoded._id == req.params.user_id)
        // {
        //     res.json({sucesss: true, user: req.decoded});
        // }
        // else if(req.decoded.admin)
        // {
        //     User.findById(req.params.user_id, function (err, user) {
        //         res.json({sucesss: true, user: user});
        //     });
        // }
        // else
        // {
        //     res.json({success: false, message: 'Admin only'});
        // }
        User.findById(req.params.user_id, function (err, user) {
            res.json({user: user});
        });
    })
    .put(function (req, res) {
       // if(!req.decoded.admin)
       // {
       //     res.json({success: false, message: 'Admin only'});
       // }
       // else
       // {
       //     User.findById(req.params.user_id, function (err, user) {
       //         if (err)
       //             res.send(err);
       //         else
       //         {
       //             user.name = req.body.name;
       //             user.email = req.body.email;
       //             user.password = req.body.password;
       //             user.admin = req.body.admin;
       //             user.save(function (err) {
       //                 if(err)
       //                     res.send({success: false, message: err.message});
       //                 else
       //                     res.json({success:true, message: user.email + " Updates"});
       //             })
       //         }
       //     });
       // }
        User.update({_id : ObjectId(req.params.user_id)}, req.body, function (err, result) {
            if(err)
                console.log(err.message);
            console.log(result);
            res.sendStatus(200);
        });

    })
    .delete(function (req, res) {
        User.remove({_id : ObjectId(req.params.user_id)}, function (err, result) {
            if (err) {
                console.log(err);
            }
            console.log(result);
            res.sendStatus(200);
        });
    });

/////////////////
// Ferme route //
/////////////////

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/')
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname); //Appending extension
    }
});

var upload = multer({ storage: storage });

function getGeoJSONFormData(path) {
    return {
        sourceSrs : "epsg:26918",
        targetSrs : "epsg:4326",
        upload : fs.createReadStream(path)
    };
}

router.route('/fermes')
    .get(function (req, res) {
        Ferme.find({}, function (err, users) {
            res.json(users);
        });
    })
    .post(function (req, res) {
        var newferme = new Ferme({
            name : req.body.name,
            geojson : req.body.geojson
        });
        newferme.save(function (err) {
            if (err) {
                return res.json({success: false, message: err.message});
            }
            res.json({success: true, message: 'Successful created new user.'});
        });
    });


router.post('/shapefile-to-geojson', upload.single('shapefileZip'), function (req, res) {
    request.post({url : "http://ogre.adc4gis.com/convert", formData: getGeoJSONFormData(req.file.path)},
        function (err, httpResponse, body) {
            if (err) {
                return console.error('upload failed:', err);
            }
            res.send(JSON.parse(body));
        });
});

function responseFile(filePath, fileName, response) {
    console.log(filePath);
    // Check if file specified by the filePath exists
    fs.exists(filePath, function(exists){
        if (exists) {
            // Content-type is very interesting part that guarantee that
            // Web browser will handle response in an appropriate manner.
            response.writeHead(200, {
                "Content-Type": "application/zip",
                "Content-Disposition" : "attachment; filename=" + fileName});
            fs.createReadStream(filePath).pipe(response);
        } else {
            response.writeHead(400, {"Content-Type": "text/plain"});
            response.end("ERROR File does NOT Exists");
        }
    });
}


router.post('/geojson-to-shapefile', function (req, res) {
    var fileName;
    var url = 'http://ogre.adc4gis.com/convertJson';
    console.log(req.body.geojson);
    var r = request.post({url: url, formData : {json : req.body.geojson}});
    r.on('response',  function (response) {
        fileName = 'shapefile' + Date.now() + '.zip';
        var filePath = './uploads/' + fileName;
        console.log(fileName);
        var p = response.pipe(fs.createWriteStream(filePath));
        p.on('finish', function () {
            responseFile(filePath, fileName, res);
        });

    });
});

router.route('/fermes/:ferme_id')
    .get(function (req, res) {
        Ferme.findById(req.params.ferme_id, function (err, ferme) {
            if(err)
                console.log(err);

            var send = {ferme : ferme};
            send['weather'] = {};
            var coord = ferme.centerCoordinate.lat.toString() + "," + ferme.centerCoordinate.lng.toString();
            var weatherRequest = {};
            var weatherJsonUrl = "http://api.wunderground.com/api/5eea73b2f937ec5c/forecast/q/" + coord + ".json";
            weatherRequest.forecast = request.get(weatherJsonUrl, function(err, httpResponse, body){
                if(err){
                    return console.error(err);
                }
                send.weather['forecast'] = JSON.parse(body).forecast;
                weatherJsonUrl = "http://api.wunderground.com/api/5eea73b2f937ec5c/conditions/q/" + coord + ".json";
                weatherRequest.conditions = request.get(weatherJsonUrl, function(err, httpResponse, body){
                    if(err){
                        return console.error(err);
                    }
                    send.weather['current_observation'] = JSON.parse(body).current_observation;
                    res.json(send);
                });
            });
        });
    })
    .put(function (req, res) {
        Ferme.update({_id : ObjectId(req.params.ferme_id)}, req.body, function (err, result) {
            if(err)
                console.log(err.message);
            console.log(result);
            res.sendStatus(200);
        });
    })
    .delete(function (req, res) {
        Ferme.remove({_id : ObjectId(req.params.ferme_id)}, function (err, result) {
            if (err) {
                console.log(err);
            }
            console.log(result);
            res.sendStatus(200);
        });
    });



router.post('/executeR', upload.any(), function (req, response) {

    function sendResponseBack(err, res){
        if(err){
            console.log(err);
            response.json({output : err});
        }
        else{
            // res = JSON.parse(res);
            console.log(res);
            response.json({output : res});
        }
    }

    if(typeof req.body.command !== 'undefined'){
        console.log(req.body.command);
        rio.e({
            command : req.body.command,
            callback : sendResponseBack
        });
    }
    else if(typeof req.body.filetext !== 'undefined'){
        var filename = './uploads/filetext.R';
        fs.writeFile(filename, req.body.filetext, function(err) {
            if(err) {
                return console.log(err);
            }
            rio.e({
                filename : filename,
                callback : sendResponseBack
            });
        });
    }
    else{
        // var filename = '../../uploads/' + req.body.filename;
        var filename = './uploads/scirpt.R';
        console.log(filename);
        rio.e({
            filename : filename,
            callback : sendResponseBack,
            entrypoint : 'main'
        });
    }




});

module.exports = router;


