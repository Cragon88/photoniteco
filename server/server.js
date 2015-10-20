var path = require('path');
var bodyParser = require('body-parser');
var express = require('express');
var mongoose = require('mongoose');
var uriUtil = require('mongodb-uri');

/*
 * Connect database
 */
var options = { server: { socketOptions: { keepAlive: 1, connectTimeoutMS: 30000 } },
  replset: { socketOptions: { keepAlive: 1, connectTimeoutMS : 30000 } } };
var mongodbUri = 'mongodb://admin:123456@ds051843.mongolab.com:51843/photoniteco';
var mongooseUri = uriUtil.formatMongoose(mongodbUri);
mongoose.connect(mongooseUri, options);
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'Database connect error!'));
db.once('open', function callback () {
  console.log('Database connect successfully!')
});

require('./models/Albums.js');

/*
 * Configure application
 */
var app = express();
//require("./routes/routes.js")(app);
require('./routes/uploadManager')(app);
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser());
app.use(express.static(path.dirname(__dirname) + '/ui'));
app.use(express.static(path.dirname(__dirname) + '/views'));

app.set('port', (process.env.PORT || 5000));

// views is directory for all template files
app.set('views', path.dirname(__dirname) + '/views');
app.set('view engine', 'ejs');

app.get('/', function(request, response) {
  response.render('index');
});

app.get('/upload-photos', function(request, response) {
  response.render('upload');
});

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});


