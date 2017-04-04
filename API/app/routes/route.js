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

router.post('/shapefile-to-geojson', upload.single('shapefileZip'), function (req, res) {
    request.post({url : "http://ogre.adc4gis.com/convert", formData: getGeoJSONFormData(req.file.path, req.query.sourceSrs)},
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



// router.use('/fermes/data', function (req, res, next) {
//     authorization.fermeAuthorization(req, res, next);
// });
// router.route('/fermes/data')
//     .get(function(req, res){
//         var query = req.query;
//         if(query.hasOwnProperty('fermeName')){
//             Ferme.getFermeByName(query.fermeName, function (ferme) {
//                 res.json(Ferme.geojsonToData(ferme.geojson));
//             })
//         }
//         else {
//             res.status(400).send({message : 'Aucune ferme demander'});
//         }
//     })
//     .put(function (req, res) {
//         var query = req.query;
//         var body = JSON.parse(JSON.stringify(req.body));
//         if(!body.hasOwnProperty('data')){
//             res.statusMessage = 'Aucune donne, \'data\' doit etre fournie';
//             res.sendStatus(400);
//         }
//         else if(query.hasOwnProperty('fermeId')){
//             Ferme.getFermeById(query.fermeId, function (ferme) {
//                 Ferme.updateDataFerme(req, res, ferme);
//             });
//         }
//         else if(query.hasOwnProperty('fermeName')){
//             Ferme.getFermeByName(query.fermeName, function (ferme) {
//                 Ferme.updateDataFerme(req, res, ferme);
//             })
//         }
//         else{
//             res.statusMessage = "Parametre valide : fermeId, fermeName";
//             res.sendStatus(400);
//         }
//     });

router.use('/fermes/:ferme_id/*', function (req, res, next) {
    authorization.fermeExiste(req, res, next);
});

router.use('/fermes/:ferme_id*', function (req, res, next) {
    authorization.fermeAuthorization(req, res, next);
});

router.route('/fermes/:ferme_id/data')
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

router.get('/fermes/:ferme_id/weather', function (req, res) {
    var simple = req.query.simple || false;
    Ferme.getFermeById(req.params.ferme_id, function (ferme) {
        Weather.getWeatherByLatLng(ferme.centerCoordinate.lat, ferme.centerCoordinate.lng, simple, function (weather) {
            if(typeof weather.message !== 'undefined') res.status(404);
            res.send(weather);
        });
    });
});

router.use('/fermes/:ferme_id/file', fileserver);

var rasters = require('../routes/rasters');
router.use('/fermes/:ferme_id/rasters', rasters);

router.route('/fermes/:ferme_id')
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
    authorization.isAdmin(req, res, next);
});
router.route('/fermes')
    .get(function (req, res) {
        Ferme.find({}, function (err, fermes) {
            res.json(fermes);
        });
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
            "setwd('" + __dirname + "/../file_system_api/fileSystem/" + authorization.getApiFromReq(req) +"')\n" +
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
        Weather.getWeatherByLatLng(query.lat, query.lng, simple, function (weather) {
            if(typeof weather.message !== 'undefined') res.status(404);
            res.send(weather);
        });
    }
    else res.status(400).send({message : 'Liste des paramètres valide : lat, lng'});
});





module.exports = router;

