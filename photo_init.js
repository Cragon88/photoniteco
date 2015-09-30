/**
 * Created by thanhnguyen on 29/09/2015.
 */
var mongoose = require('mongoose');
var uriUtil = require('mongodb-uri');
var dir = require('node-dir');
var path = require('path');
var fs = require('fs');

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

    var Schema = mongoose.Schema;
    var PhotoSchema = new Schema({
        year: Number,
        albumName: String,
        photoName: String,
    }, { _id: true });
    mongoose.model('Photo', PhotoSchema);

    dir.subdirs(path.join(__dirname, 'ui','imgs'), function(err, subdirs) {
        if (err) throw err;
        subdirs.forEach(function(sub) {
            insertPhoto(path.basename(sub))
        });
    });

});

function insertPhoto(album) {
    dir.files(path.join(__dirname, 'ui', 'imgs', album) , function(err, files) {
        if (err) throw err;
        files.forEach(function(f) {
            console.log( 'Album: '+album+"   "+path.basename(f));

            var Photo = mongoose.model('Photo');
            var p = new Photo({year: album, albumName: '', photoName: path.basename(f)});
            p.save(function(err, result){
                if(err) {
                    console.log('Can not insert document.............')
                }
            });
        });
    });
}

//function readYearDir(year) {
//    dir.subdirs(path.join(__dirname, 'ui','imgs', year), function(err, albumDirs) {
//        if (err) throw err;
//        albumDirs.forEach(function(al) {
//            readAlbum(year, path.basename(al));
//        });
//    });
//}


//
//dir.files(path.join(__dirname, 'ui/imgs') , function(err, files) {
//    if (err) throw err;
//
//    files.forEach(function(f) {
//        console.log('Files: ' + path.basename(f));
//    });
//});

//dir.paths(__dirname + '/ui/imgs', function(err, paths) {
//    if (err) throw err;
//    console.log('files:\n',paths.files);
//    console.log('subdirs:\n', paths.dirs);
//});

//fs.readdir(__dirname + '/ui/imgs', function(err, files) {
//    if (err) return;
//
//    files.forEach(function(f) {
//        console.log('Files: ' + f);
//    });
//});

//function getDirectories(srcpath) {
//    return fs.readdirSync(srcpath).filter(function(file) {
//        return fs.statSync(path.join(srcpath, file)).isDirectory();
//    });
//}


