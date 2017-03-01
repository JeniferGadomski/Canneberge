// Dependencies
// -----------------------------------------------------
var express         = require('express');
var port            = process.env.PORT || 3001;
var morgan          = require('morgan');
var bodyParser      = require('body-parser');
var app             = express();

// Express Configuration
// -----------------------------------------------------

// Logging and Parsing
app.use(express.static(__dirname + '/public'));                 // sets the static files location to public
app.use(morgan('common'));                                         // log with Morgan
app.use(bodyParser.json());                                     // parse application/json
app.use(bodyParser.urlencoded({extended: true}));               // parse application/x-www-form-urlencoded
app.use(bodyParser.text());                                     // allows bodyParser to look at raw text
app.use(bodyParser.json({ type: 'application/vnd.api+json'}));  // parse application/vnd.api+json as json

app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

// Routes
// ------------------------------------------------------
app.use('/', require('./app/routes'));


// Listen
// -------------------------------------------------------
app.listen(port);
console.log('App listening on port ' + port);