var express     = require('express');
var app         = express();
var bodyParser  = require('body-parser');
var morgan      = require('morgan');
var mongoose    = require('mongoose');
var routes = require('./app/routes/route');
var passport = require('passport');
var port = process.env.PORT || 8080; // used to create, sign, and verify tokens
var config = require('./app/config/config'); // get our config file
var path = require('path');
var multer = require('multer');
var fileserver = require('./app/file_system_api/fileserver');
var favicon = require('serve-favicon');


app.use(express.static(path.join(__dirname, 'public')));
app.use(favicon(__dirname + '/app/favicon.ico'));

var options = {
    server: {
        socketOptions: { keepAlive: 300000, connectTimeoutMS: 30000 },
        auto_reconnect : true,
        reconnectTries : 100
    },
    replset: { socketOptions: { keepAlive: 300000, connectTimeoutMS : 30000 } }
};

var db = mongoose.connection;
db.on('disconnected', function() {
    console.log('MongoDB disconnected!');
    mongoose.connect(config.database, options);
});

mongoose.connect(config.database, options);


app.set('superSecret', config.secret); // secret variable

// use body parser so we can get info from POST and/or URL parameters
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(passport.initialize());
app.use(passport.session());


app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header('Access-Control-Allow-Methods', 'GET, POST , PUT, DELETE', 'OPTIONS');
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With,     Content-Type, Accept");
    next();
});

// use morgan to log requests to the console
app.use(morgan('common'));

app.get('/', function (req, res) {
    res.send('<h1>Api a l\'adresse api.canneberge.io/api/</h1>');
});

app.options('*', function (req, res) {
    // console.log('!OPTIONS');
    var headers = {};
    // IE8 does not allow domains to be specified, just the *
    // headers["Access-Control-Allow-Origin"] = req.headers.origin;
    headers["Access-Control-Allow-Origin"] = "*";
    headers["Access-Control-Allow-Methods"] = "POST, GET, PUT, DELETE, OPTIONS";
    headers["Access-Control-Allow-Credentials"] = false;
    headers["Access-Control-Max-Age"] = '86400'; // 24 hours
    headers["Access-Control-Allow-Headers"] = "Origin, X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept, x-access-token";
    res.writeHead(200, headers);
    res.end();
});

app.use('/api', routes);
app.use('/api/file', fileserver);


app.listen(port);
console.log('Magic happens at http://localhost:' + port);
