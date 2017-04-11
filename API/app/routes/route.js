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
var authorization = require('../models/authorization');
var fileserver = require('../file_system_api/fileserver');

router.get('/', function(req, res) {
    res.send('Hello! The API is at http://api.canneberge.io/api');
});


/**
 * @api {post} /authentification Authentification
 * @apiName Authentification a user
 * @apiGroup Authentification
 *
 * @apiDescription Authentificate a user with is email and password
 *
 * @apiParam {String} email Email of the user.
 * @apiParam {String} password Password of the user.
 *
 *
 * @apiSuccess {Boolean} success If the authentification has success.
 * @apiSuccess {String} message Authentificaiton message success.
 * @apiSuccess {String} apiKey The api key of the user.
 * @apiSuccessExample {json} Success-Response:
 *   {
 *       "success": true,
 *       "message": "Enjoy your token!",
 *       "apiKey": "1234567890"
 *   }
 *
 * @apiError UserNotFound Authentication failed. User not found.
 * @apiError UserBlocked The user is blocked.
 * @apiErrorExample {json} UserNotFound-Response
 *  {
 *       "success": false,
 *      "message": "Authentication failed. User not found."
 *  }
 *
 *  @apiErrorExample {json} UserBlocked-Response
 *  {
 *       "success": false,
 *      "message": "Contacter l'administrateur."
 *  }
 *
 */
router.post('/authentification', function(req, res) {
    // find the user
    var email = req.body.email;

    console.log(req.body);

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


/**
 * @apiDefine admin User with administrator authorization
 * Only the users with the autority admin can use this function
 */


/**
 * @apiDefine fermeAccess User with the right to access the farm
 * Only the users with the autority to access this farm can access it.
 */

/**
 * @apiDefine sameUser User must be admin or by the same user
 * Only admin or user himself can acces to the user.
 */

/**
 * @apiDefine apiKey The user must provide a api key
 * header : {x-access-token : apiKey},
 * body : {apiKey : apiKey},
 * query : ?apiKey=apiKey
 */


/**
 * @api {post} /users Create a new user
 * @apiName Create a new user
 * @apiGroup User
 *
 * @apiDescription Create and register a new user.
 *
 * @apiParam {String} [firstname] First name of the new user
 * @apiParam {String} [lastname] Last name of the new user
 * @apiParam {String} email Last name of the new user
 * @apiParam {String} [password="default"]  The password of the new user
 * @apiParam {String} username The username of the new user
 * @apiParam {String[]} [scripts="[]"] List of the scripts. Only admin can have some.
 * @apiParam {Object} [authorization] Value to restrict user.
 * @apiParam {Boolean} [authorization.admin="false"] Param to set a user admin.
 * @apiParam {Boolean} [authorization.blocked="true"] The user can't use the API when true.
 * @apiParam {Object[]} [authorization.fermes="[]"] List of the farms the user have access.
 *
 * @apiSuccess {Boolean} success
 * @apiSuccess {String} message Successful created new user.
 *
 * @apiSuccessExample {json} Success-Response:
 {
   "success": true,
   "message": "Successful created new user.",
   "user": {
     "__v": 0,
     "username": "Postman",
     "firstname": "Post",
     "lastname": "Man",
     "email": "postman@gmail.com",
     "_id": "1234567980",
     "authorization": {
       "blocked": true,
       "fermes": [],
       "admin": false
     },
     "scripts": [],
     "password": "1234567980"
   }
 }
 *
 * @apiError Error Message detail
 * @apiErrorExample {json} Error-Response
 *  {
 *       "success": false,
 *      "message": "User validation failed"
 *  }
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
        fs.mkdir(__dirname + '/../file_system_api/fileSystem/' + newUser._id, function () {

        });
    });
});



/*
 From here
 A partir d'ici un token avec un _id de user doit etre fournis
 */

router.use(function(req, res, next) {
    // check header or url parameters or post parameters for token
    var token = authorization.getApiFromReq(req);
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

/**
 * @api {get} /users/:id/redirections User redirections
 * @apiName User redirections
 * @apiGroup User
 * @apiDescription Get all link of application the user has access.
 * @apiPermission apiKey
 * @apiPermission sameUser
 *
 * @apiParam {String} id The id of the user.
 *
 * @apiSuccess {Object[]} list List of the link with title.
 * @apiSuccess {String} .name Title of the link.
 * @apiSuccess {String} .url The url of the link.
 * @apiSuccessExample {json} Reponse-Example
 * [
 {
   "name": "Blandford",
   "url": "http://carte.canneberge.io/?fermeId=1234567890"
 }
 * ]
 *
 */
router.use('/users/:user_id/redirections', function (req, res, next) {
    authorization.sameUserOrAdmin(req, res, next);
});
router.get('/users/:user_id/redirections', function (req, res) {
    User.findById(req.params.user_id, function (err, user) {
        res.json(user.getRedirections());
    });
});


router.use('/users/:user_id', function (req, res, next) {
    authorization.sameUserOrAdmin(req, res, next);
});
router.route('/users/:user_id')
/**
 * @api {get} /users/:id Get User
 * @apiName Get User
 * @apiGroup User
 * @apiDescription Get the information of an user.
 * @apiPermission apiKey
 * @apiPermission sameUser
 *
 * @apiParam {String} id The id of the user.
 *
 * @apiSuccess {Object} user Object user
 * @apiSuccess {String} user.firstname First name of the new user
 * @apiSuccess {String} user.lastname Last name of the new user
 * @apiSuccess {String} user.email Last name of the new user
 * @apiSuccess {String} user.password The password of the new user
 * @apiSuccess {String} user.username The username of the new user
 * @apiSuccess {String[]} user.scripts="[]" List of the scripts. Only admin can have some.
 * @apiSuccess {Object} user.authorization Value to restrict user.
 * @apiSuccess {Boolean} user.authorization.admin="false" Param to set a user admin.
 * @apiSuccess {Boolean} user.authorization.blocked="true" The user can't use the API when true.
 * @apiSuccess {Object[]} user.authorization.fermes="[]" List of the farms the user have access.
 *
 * @apiSuccessExample {json} Success-Response
 *{
  "user": {
    "_id": "1234567980",
    "firstname": "PostMan",
    "lastname": "Pampev",
    "email": "pampev@gmail.com",
    "username": "pampev",
    "__v": 0,
    "authorization": {
      "blocked": false,
      "fermes": [
        {
          "_id": "1234567980",
          "name": "Pampev"
        }
      ],
      "admin": false
    },
    "scripts": [],
    "password": "1234567980"
  }
}
 *
 * @apiError UserNotFound The user doesn't exist.
 * @apiErrorExample {json} Error-Response
 *{
  "message": "no user"
}
 *
 */
    .get(function (req, res) {
        User.findById(req.params.user_id, function (err, user) {
            if(err) res.status(404).json({message : 'no user'});
            else if(!user) res.status(404).json({message : 'no user'});
            else res.json({user: user});
        });
    })
/**
 * @api {put} /users/:id Update User
 * @apiName Update User
 * @apiGroup User
 * @apiPermission apiKey
 * @apiPermission sameUser
 *
 * @apiDescription Update a user by it's id
 *
 * @apiParam {String} [firstname] First name of the new user
 * @apiParam {String} [lastname] Last name of the new user
 * @apiParam {String} [email] Email of the new user
 * @apiParam {String} [password="default"]  The password of the new user
 * @apiParam {String} [username] The username of the new user
 * @apiParam {String[]} [scripts="[]"] List of the scripts. Only admin can have some.
 * @apiParam {Object} [authorization] Value to restrict user.
 * @apiParam {Boolean} [authorization.admin="false"] Param to set a user admin.
 * @apiParam {Boolean} [authorization.blocked="true"] The user can't use the API when true.
 * @apiParam {Object[]} [authorization.fermes="[]"] List of the farms the user have access.
 *
 * @apiSuccess {Object} user The object of the user updated.
 *
 * @apiSuccessExample {json} Success-Response:
 *     {
*          "user": Object
*     }
 *
 * @apiError Error Message detail
 * @apiErrorExample {json} Error-Response
 {
   "success": false,
   "message": "Error no user found"
 }
 */
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
/**
 * @api {delete} /users/:id Delete User
 * @apiName Delete User
 * @apiGroup User
 * @apiPermission apiKey
 * @apiPermission sameUser
 *
 * @apiDescription Delete a user by it's id
 *
 * @apiParam {String} id The user id.
 *
 * @apiSuccess {String} Code Status message
 *
 */
    .delete(function (req, res) {
        User.remove({_id : ObjectId(req.params.user_id)}, function (err, result) {
            if (err) {
                res.status(404).send(err.message);
            }
            // console.log(result);
            res.sendStatus(200);
        });
    });


/**
 * @api {get} /users Get all user
 * @apiName Get all user
 * @apiGroup User
 * @apiPermission admin
 *
 * @apiDescription Retrive all users
 *
 *
 * @apiSuccess {Object[]} list List of all users
 *
 */
router.use('/users', function (req, res, next) {
    authorization.isAdmin(req, res, next);
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

function getGeoJSONFormData(path, sourceSrs) {
    var newSourceSrs = "epsg:26918";
    if(typeof sourceSrs != 'undefined')
        newSourceSrs = 'epsg:' + sourceSrs;
    console.log(newSourceSrs);
    return {
        sourceSrs : newSourceSrs,
        targetSrs : "epsg:4326",
        upload : fs.createReadStream(path)
    };
}

/**
 * @api {post} /shapefile-to-geojson Convert Shapefile
 * @apiName Convert Shapefile to geosjson
 * @apiGroup Shapefile
 * @apiPermission apiKey
 * @apiDescription Convert a shapefile
 *
 * @apiParam {File} shapefileZip A zip file with .shp, .dbf, and .shx (.prj optionnel) en form-data
 * @apiParam {Integer} [sourceSrs=26918] The projection of the shapefile
 * @apiParamExample {String} Request example
 * /api/shapefile-to-geojson?=sourceSrs=4326
 *
 * @apiSuccessExample {html} Geojson
 * <a href="example.html#example-geojson">Example geojson</a>
 */

router.post('/shapefile-to-geojson', upload.single('shapefileZip'), function (req, res) {
    request.post({url : "http://ogre.adc4gis.com/convert", formData: getGeoJSONFormData(req.file.path, req.query.sourceSrs)},
        function (err, httpResponse, body) {
            if (err) {
                return res.status(400).send({message : 'upload failed:' +  err.message});
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

/**
 * @api {post} /geojson-to-shapefile Convert GeoJSON
 * @apiName Convert a GeoJSON to a shapefile
 * @apiGroup Shapefile
 * @apiPermission apiKey
 * @apiDescription Convert a GeoJSON
 *
 * @apiParam {Object} geojson The geojson object to convert
 *
 * @apiSuccess {File} file A stream witch content a zip file of the shapefile (EPSG:4326)
 */

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


router.use('/fermes/:ferme_id/*', function (req, res, next) {
    authorization.fermeExiste(req, res, next);
});

router.use('/fermes/:ferme_id*', function (req, res, next) {
    authorization.fermeAuthorization(req, res, next);
});

router.route('/fermes/:ferme_id/data')
/**
 * @api {get} /fermes/:id/data Get ferme data
 * @apiName Get ferme data
 * @apiGroup Ferme
 * @apiDescription Retrive only the data / attribut of the shapefile of the ferme in a list of Object.
 *
 * @apiPermission apiKey
 * @apiPermission fermeAccess
 *
 * @apiParam {String} id The id of the ferme
 * @apiSuccess {Object[]} list List of object of every attribut of the ferme shapefile
 *
 * @apiSuccessExample {html} Response-Example
 * <a href="example.html#example-ferme-data">Example ferme data</a>
 */
    .get(function (req, res) {
        Ferme.getFermeById(req.params.ferme_id, function (ferme) {
            res.json(Ferme.geojsonToData(ferme.geojson));
        });
/**
 * @api {put} /fermes/:id/data Update ferme data
 * @apiName update ferme data
 * @apiGroup Ferme
 * @apiDescription Update the shapefile data with a list of Object. Must put the entier data. The function doesn't merge
 * the data on the database, <strong>it replace it</strong>.
 *
 * @apiPermission apiKey
 * @apiPermission fermeAccess
 *
 * @apiParam {String} id The id of the ferme
 * @apiParam {Object[]} data List of object that represent the data. <strong> Must have the same lenght of features </strong>
 * @apiSuccess {String} code OK
 *
 * @apiError LenghtOfData doesn't match
 * @apiErrorExample {json} Lenght data error
 * {"success" : false, "message" : "Le nombre de ligne de 'data' ne concorde pas"}
 *
 */
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

/**
 * @api {get} /fermes/:id/weather Get ferme weather
 * @apiName Get ferme weather
 * @apiGroup Ferme
 * @apiDescription Get the weather at the location of the ferme.
 *
 * @apiPermission apiKey
 * @apiPermission fermeAccess
 *
 * @apiParam {String} id The id of the ferme
 * @apiParam {Boolean} [simple=false] If simple return only a list of certain data of the weather
 * @apiParamExample {String} Resquest simple example
 * /api/fermes/:id/weather?simple=true
 *
 * @apiSuccess {Object} forecast The data object for the forecast weather
 * @apiSuccess {Object} forecast.simpleforecast
 * @apiSuccess {Object[]} forecast.simpleforecast.forecastday A list of the data for today to today + 3 day
 * @apiSuccess {Object} current_observation The data of the current observation
 * @apiSuccessExample {html} simple=false
 * <a href="example.html#example-weather">Example weather</a>
 * @apiSuccessExample {html} simple=true
 * <a href="example.html#example-weather-simple">Example weather simple</a>
 *
 *
 */
router.get('/fermes/:ferme_id/weather', function (req, res) {
    var simple = req.query.simple || false;
    Ferme.getFermeById(req.params.ferme_id, function (ferme) {
        Weather.getWeatherByLatLng(ferme.centerCoordinate.lat, ferme.centerCoordinate.lng, simple, function (weather) {
            if(typeof weather.message !== 'undefined') res.status(404);
            res.send(weather);
        });
    });
});


/**
 * @api {get} /fermes/:id/file/:path Ferme file
 * @apiName Get ferme
 * @apiGroup Ferme
 * @apiDescription See the section <a href="#api-File">File</a>. The only difference is the url to use. <br>
 * Replace <code>/file/:path</code> by <code>/fermes/:id/file/:path</code>
 *
 * @apiPermission apiKey
 * @apiPermission fermeAccess
 *
 * @apiParam {String} id The id of the ferme.
 * @apiParam {String} path The path to the file or the folder.
 * @apiParamExample {String} Request example
 * /api/fermes/1234567890/file/path/to/file.png
 *
 */
router.use('/fermes/:ferme_id/file', fileserver);

var rasters = require('../routes/rasters');
router.use('/fermes/:ferme_id/rasters', rasters);


router.route('/fermes/:ferme_id')
/**
 * @api {get} /fermes/:id Get ferme
 * @apiName Get ferme
 * @apiGroup Ferme
 * @apiDescription Get ferme informations in a object
 *
 * @apiPermission apiKey
 * @apiPermission fermeAccess
 *
 * @apiParam {String} id The id of the ferme
 * @apiParam {Boolean} [weather=true] If false, doesn't return the weather.
 * @apiParamExample {String} weather=false
 * /api/fermes/:id?=weather=false
 *
 * @apiSuccess {Object} ferme Object with the information of the ferme
 * @apiSuccess {String} ferme._id The id of the ferme.
 * @apiSuccess {String} ferme.name The name of the ferme
 * @apiSuccess {Object} ferme.geojson The geosjon of the shapefile of the ferme
 * @apiSuccess {Object} ferme.centerCoordinate The coordinate of the center of the ferme
 * @apiSuccess {Number} ferme.centerCoordinate.lat The latitide.
 * @apiSuccess {Number} ferme.centerCoordinate.lng The longitude.
 * @apiSuccess {Object[]} ferme.rasters List of object with the information of the raster, see <a href="#api-Rasters-Get_all_info">Rasters</a>
 * @apiSuccess {Object[]} ferme.markers List of the markers to show on map
 * @apiSuccess {String} ferme.markers.title Title of the markers
 * @apiSuccess {String} ferme.markers.note Note of the markers
 * @apiSuccess {String} ferme.markers.id Id of the markers
 * @apiSuccess {Object} ferme.markers.latLng Object with the <code>latLng.lat</code> and <code>latLng.lng</code>
 * @apiSuccess {Object} weather The data of the weather for the location of the ferme.
 * @apiSuccessExample {html} Example response
 * <a href="example.html#example-ferme">Example Ferme</a>
 */
    .get(function (req, res) {
        Ferme.findById(req.params.ferme_id, function (err, ferme) {
            if(err)
                console.log(err);

            var send = {ferme : ferme};
            send['weather'] = {};
            if(!ferme)
                return res.json({});

            if(req.query.weather === 'false' || typeof ferme.centerCoordinate === 'undefined')
                return res.json({ferme : ferme});

            Weather.getWeatherByLatLng(ferme.centerCoordinate.lat, ferme.centerCoordinate.lng, false, function (weather) {
                if(typeof weather.message !== 'undefined') res.status(404);
                send.weather = weather;
                res.send(send);
            });
        });
    })
/**
 * @api {put} /fermes/:id Update ferme
 * @apiName Update ferme
 * @apiGroup Ferme
 * @apiDescription Upadte ferme informations
 *
 * @apiPermission apiKey
 * @apiPermission fermeAccess
 *
 * @apiParam {String} id The id of the ferme
 * @apiParam {Object} object The body must have the structure like the object ferme of <a href="#api-Ferme-Get_ferme">Get ferme</a>.
 */
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
/**
 * @api {delete} /fermes/:id Delete ferme
 * @apiName Delete ferme
 * @apiGroup Ferme
 * @apiDescription Delete the ferme from the database.
 *
 * @apiPermission apiKey
 * @apiPermission fermeAccess
 *
 * @apiParam {String} id The id of the ferme
 */
    .delete(function (req, res) {
        Ferme.remove({_id : ObjectId(req.params.ferme_id)}, function (err, result) {
            if (err) {
                console.log(err);
                res.status(400).send({message : err.message});
            }
            res.send(result);
        });
    });


router.use('/fermes', function (req, res, next) {
    authorization.isAdmin(req, res, next);
});
router.route('/fermes')
/**
 * @api {get} /fermes Get all ferme
 * @apiName Get all ferme
 * @apiGroup Ferme
 * @apiDescription Get all ferme information. Admin only.
 *
 * @apiPermission admin
 *
 * @apiSuccess {Object[]} list List of ferme object
 */
    .get(function (req, res) {
        Ferme.find({}, function (err, fermes) {
            res.json(fermes);
        });
    })
/**
 * @api {post} /fermes Create a ferme
 * @apiName Create a ferme
 * @apiGroup Ferme
 * @apiDescription Create a new ferme. Admin only.
 *
 * @apiPermission admin
 * @apiParam {String} name The name of the ferme.
 * @apiParam {Object} [geojson] The geosjon of the ferme.
 *
 */
    .post(function (req, res) {
        var newferme = new Ferme(req.body);
        newferme.save(function (err) {
            if (err) {
                return res.status(400).json({success: false, message: err.message});
            }
            res.json({success: true, message: 'Successful created new ferme.', ferme : newferme});
        });
    });

/**
 * @api {post} /executeR Execute R code
 * @apiName Execute R code
 * @apiGroup R
 * @apiDescription Execute a R code and print the output <a href="http://r.canneberge.io/filetext">r.canneberge.io</a>
 *
 * @apiPermission apiKey
 * @apiParam {String} filetext The string of the script to execute
 *
 */
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
            "setwd('" + __dirname + "/../file_system_api/fileSystem/" + authorization.getApiFromReq(req) +"')\n" +
            req.body.filetext +
            "\n}";

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


/**
 * @api {get} /weather Get weather latLng
 * @apiName Get weather latLng
 * @apiGroup Weather
 * @apiDescription Get the current weather condition and the forecast with latitude and longitude.
 *
 * @apiPermission apiKey
 * @apiParam {Number} lat The latitude
 * @apiParam {Number} lng The longitude
 * @apiParam {Boolean} [simple] If <code>true</code> return only a array on forecast data.
 * @apiParamExample {String} Request example
 * /api/weather?lat=46.123&lng=-72.123
 * @apiParamExample {String} Request example simple
 * /api/weather?lat=46.123&lng=-72.123&simple=true
 *
 * @apiSuccessExample {html} Response Example
 * <a href="example.html#example-weather">Example weather</a>
 * @apiSuccessExample {html} Response Example simple
 * <a href="example.html#example-weather-simple">Example weather simple</a>
 */
router.get('/weather', function (req, res) {
    var query = req.query;
    var simple = req.query.simple || false;
    if(query.hasOwnProperty('lat') && query.hasOwnProperty('lng')){
        Weather.getWeatherByLatLng(query.lat, query.lng, simple, function (weather) {
            if(typeof weather.message !== 'undefined') res.status(404);
            res.send(weather);
        });
    }
    else res.status(400).send({message : 'Liste des paramètres valide : lat, lng'});
});





module.exports = router;

