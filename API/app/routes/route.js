var express = require('express');
var router = express.Router();
var User   = require('../models/user'); // get our mongoose model
var Ferme = require('../models/ferme');
var Weather = require('../models/weather');
var config = require('../config/config'); // get our config file
var ObjectId = require('mongodb').ObjectID;
var fs = require('fs');
var multer = require('multer');
var request = require('request');
var path = require('path');
var rio = require('rio');
var apiKey = require('../models/apiKey');

router.get('/', function(req, res) {
    res.send('Hello! The API is at http://api.canneberge.io/api');
});

router.post('/authentification', function(req, res) {
    // find the user
    var email = req.body.email;

    User.findOne({
        email: email
    }, function(err, user) {
        if (err) throw err;
        if (!user) {
            res.status(403).json({ success: false, message: 'Authentication failed. User not found.' });
        } else if (user) {
            // check if password matches
            user.comparePassword(req.body.password, function (err, isMatch) {
                if(user.authorization.blocked){
                    res.status(403).send({success: false, message: 'Contacter l\'administrateur.'});
                }
                else if (isMatch && !err) {
                    res.json({
                        success: true,
                        message: 'Enjoy your token!',
                        apiKey: user._id
                    });
                } else {
                    res.status(403).send({success: false, message: 'Authentication failed. Wrong password.'});
                }
            });
        }
    });
});


/*
    Public create new user
 */
router.post('/users', function(req, res) {
        var newUser = new User(req.body);
        // console.log(newUser);
        // save the user
        newUser.save(function (err) {
            if (err) {
                console.log(err.message);
                return res.status(403).send({success: false, message: err.message});
            }
            res.json({success: true, message: 'Successful created new user.', user : newUser});
        });
    });

/*
    From here
    A partir d'ici un token avec un _id de user doit etre fournis
 */


router.use(function(req, res, next) {
    // check header or url parameters or post parameters for token
    var token = apiKey.getApiFromReq(req);
    // decode token
    if (token) {
        User.findById(token, function (err, user) {
            if(err) res.status(403).send({success: false, msg: 'Error token provided.'});
            else if(user.authorization.blocked) res.status(403).send({success: false, msg: 'Blocked, contact administrator'});
            else if(!user) res.status(403).send({success: false, msg: 'Wrong token provided.'});
            else next();
        })
    } else {
        return res.status(403).send({success: false, msg: 'No token provided.'});
    }
});


router.use('/users/:user_id/redirections', function (req, res, next) {
    apiKey.sameUserOrAdmin(req, res, next);
});
router.get('/users/:user_id/redirections', function (req, res) {
    User.findById(req.params.user_id, function (err, user) {
        res.json(user.getRedirections());
    });
});


router.use('/users/:user_id', function (req, res, next) {
    apiKey.sameUserOrAdmin(req, res, next);
});
router.route('/users/:user_id')
    .get(function (req, res) {
        User.findById(req.params.user_id, function (err, user) {
            if(err) res.status(404).json({message : 'no user'});
            else if(!user) res.status(404).json({message : 'no user'});
            else res.json({user: user});
        });
    })
    .put(function (req, res) {
        User.update({_id : ObjectId(req.params.user_id)}, req.body, function (err, result) {
            if(err) res.status(404).send({message : 'error update user', success : false});
            else {
                User.findById(req.params.user_id, function (err, user) {
                    if(err) res.status(404).send({success : false, message : 'Error no user found'});
                    else if(!user) res.status(404).send({success : false, message : 'Error no user found'});
                    else res.send({user : user});
                })
            }
        });

    })
    .delete(function (req, res) {
        User.remove({_id : ObjectId(req.params.user_id)}, function (err, result) {
            if (err) {
                console.log(err);
            }
            // console.log(result);
            res.sendStatus(200);
        });
    });


router.use('/users', function (req, res, next) {
    apiKey.isAdmin(req, res, next);
});
router.route('/users')
    .get(function (req, res) {
        User.find({}, function (err, users) {
            res.json(users);
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
    // console.log(filePath);
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
    // console.log(req.body.geojson);
    var r = request.post({url: url, formData : {json : req.body.geojson}});
    r.on('response',  function (response) {
        fileName = 'shapefile' + Date.now() + '.zip';
        var filePath = './uploads/' + fileName;
        // console.log(fileName);
        var p = response.pipe(fs.createWriteStream(filePath));
        p.on('finish', function () {
            responseFile(filePath, fileName, res);
        });

    });
});

router.use('/fermes/data/:ferme_id', function (req, res, next) {
    apiKey.fermeAuthorization(req, res, next);
});
router.route('/fermes/data/:ferme_id')
    .get(function (req, res) {
        Ferme.getFermeById(req.params.ferme_id, function (ferme) {
            res.json(Ferme.geojsonToData(ferme.geojson));
        });
    })
    .put(function (req, res) {
        var body = JSON.parse(JSON.stringify(req.body));
        if(!body.hasOwnProperty('data')){
            res.statusMessage = 'Aucune donne, \'data\' doit etre fournie';
            res.sendStatus(400);
            return;
        }
        Ferme.getFermeById(req.params.ferme_id, function(ferme){
            Ferme.updateDataFerme(req, res, ferme);
        });
    });

router.use('/fermes/data', function (req, res, next) {
    apiKey.fermeAuthorization(req, res, next);
});
router.route('/fermes/data')
    .get(function(req, res){
       var query = req.query;
       if(query.hasOwnProperty('fermeId')){
            Ferme.getFermeById(query.fermeId, function (ferme) {
                res.json(Ferme.geojsonToData(ferme.geojson));
            })
       }
       else if(query.hasOwnProperty('fermeName')){
            Ferme.getFermeByName(query.fermeName, function (ferme) {
                res.json(Ferme.geojsonToData(ferme.geojson));
            })
       }
       else {
           res.status(400).send({message : 'Aucune ferme demander'});
       }
    })
    .put(function (req, res) {
        var query = req.query;
        var body = JSON.parse(JSON.stringify(req.body));
        if(!body.hasOwnProperty('data')){
            res.statusMessage = 'Aucune donne, \'data\' doit etre fournie';
            res.sendStatus(400);
        }
        else if(query.hasOwnProperty('fermeId')){
            Ferme.getFermeById(query.fermeId, function (ferme) {
                Ferme.updateDataFerme(req, res, ferme);
            });
        }
        else if(query.hasOwnProperty('fermeName')){
            Ferme.getFermeByName(query.fermeName, function (ferme) {
                Ferme.updateDataFerme(req, res, ferme);
            })
        }
        else{
            res.statusMessage = "Parametre valide : fermeId, fermeName";
            res.sendStatus(400);
        }
    });


router.use('/fermes/:ferme_id', function (req, res, next) {
    apiKey.fermeAuthorization(req, res, next);
});
router.route('/fermes/:ferme_id')
    .get(function (req, res) {
        Ferme.findById(req.params.ferme_id, function (err, ferme) {
            if(err)
                console.log(err);

            var send = {ferme : ferme};
            send['weather'] = {};
            if(!ferme){
                res.json({});
                return
            }

            if(req.query.weather === 'false' || typeof ferme.centerCoordinate === 'undefined'){
                res.json({ferme : ferme});
                return
            }
            var coord = ferme.centerCoordinate.lat.toString() + "," + ferme.centerCoordinate.lng.toString();
            var weatherRequest = {};
            var weatherJsonUrl = "http://api.wunderground.com/api/" + config.wu_key +"/forecast/q/" + coord + ".json";
            weatherRequest.forecast = request.get(weatherJsonUrl, function(err, httpResponse, body){
                if(err){
                    return console.error(err);
                }
                send.weather['forecast'] = JSON.parse(body).forecast;
                weatherJsonUrl = "http://api.wunderground.com/api/" + config.wu_key +"/conditions/q/" + coord + ".json";
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
            if(err) res.status(404).send({message : 'ferme not found'});
            else{
                Ferme.getFermeById(req.params.ferme_id, function (ferme) {
                    if(!ferme) res.status(403).send({succes : false, message : 'ferme not found'});
                    else res.json({ferme : ferme});
                })
            }
        });
    })
    .delete(function (req, res) {
        Ferme.remove({_id : ObjectId(req.params.ferme_id)}, function (err, result) {
            if (err) {
                console.log(err);
            }
            res.sendStatus(200);
        });
    });


router.use('/fermes', function (req, res, next) {
    apiKey.isAdmin(req, res, next);
});
router.route('/fermes')
    .get(function (req, res) {
        var query = req.query;
        if(query.hasOwnProperty('fermeId')){
            Ferme.getFermeById(query.fermeId, function (ferme) {
                res.json(ferme);
            });
        }
        else if(query.hasOwnProperty('fermeName')){
            Ferme.getFermeByName(query.fermeName, function (ferme) {
                res.json(ferme);
            })
        }
        else{
            Ferme.find({}, function (err, fermes) {
                res.json(fermes);
            });
        }
    })
    .post(function (req, res) {
        var newferme = new Ferme(req.body);
        newferme.save(function (err) {
            if (err) {
                return res.json({success: false, message: err.message});
            }
            res.json({success: true, message: 'Successful created new ferme.', ferme : newferme});
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
            // console.log(res);
            response.json({output : res});
        }
    }

    if(typeof req.body.command !== 'undefined'){
        // console.log(req.body.command);
        rio.e({
            command : req.body.command,
            callback : sendResponseBack
        });
    }
    else if(typeof req.body.filetext !== 'undefined'){
        var filename = './uploads/filetext.R';
        var filecontent =
                "run <- function(){ \n" +
                "setwd('" + __dirname + "/../file_system_api/fileSystem/" + apiKey.getApiFromReq(req) +"')\n" +
                req.body.filetext +
                "\n }";

        fs.writeFile(filename, filecontent, function(err) {
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
        // console.log(filename);
        rio.e({
            filename : filename,
            callback : sendResponseBack,
            entrypoint : 'main'
        });
    }
});

router.get('/weather', function (req, res) {
    var query = req.query;
    var simple = req.query.simple || false;
    if(query.hasOwnProperty('lat') && query.hasOwnProperty('lng')){
            Weather.getWeatherByLatLng(query.lat, query.lng, simple, function (w) {
                res.json(w);
            });
    }
    else if(query.hasOwnProperty('fermeId')){
        Ferme.getFermeById(query.fermeId, function (ferme) {
            if(!ferme) res.status(404).send({message : 'No ferme found'});
            else{
                Weather.getWeatherByLatLng(ferme.centerCoordinate.lat, ferme.centerCoordinate.lng, simple, function (weather) {
                    res.json(weather);
                })
            }
        })
    }
    else if(query.hasOwnProperty('fermeName')){
        Ferme.getFermeByName(query.fermeName, function (ferme) {
            if(!ferme) res.status(404).send({message : 'No ferme found'});
            else{
                Weather.getWeatherByLatLng(ferme.centerCoordinate.lat, ferme.centerCoordinate.lng, simple, function (weather) {
                    res.json(weather);
                })
            }
        })
    }
    else res.status(400).send({message : 'Liste des paramètres valide : lat, lng -- fermeId -- fermeName'});
});





module.exports = router;

