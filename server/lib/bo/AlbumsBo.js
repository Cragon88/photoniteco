/**
 * Created by thanhnguyen on 08/10/2015.
 */

var mongoose = require('mongoose');

var AlbumsBo = {};

AlbumsBo.saveFileUploaded = function(transporter, files, cb) {
    var Albums = mongoose.model('Albums');
    var album = buildAlbumObj(transporter.albumFolderName, transporter.albumName, [files[0].name]);
    var albumArr = [album];
    var albums = new Albums({year: transporter.albumYear, month: transporter.albumMonth, albums: albumArr});
    albums.save(function(err, result){
        debugger;
        if(err) {
            console.log(err)
        } else if(!cb) {
            cb(err, albums)
        }
    });
};

AlbumsBo.findByPhotoName = function(name, callback) {
    var Albums = mongoose.model('Albums');
    Albums.find({photos:name}).exec(function(err, photos) {
        if(err)
            console.log(err);
        else
            console.log('Data find by '+name+ ' '+photos);
        callback(err, photos);
    });
};

AlbumsBo.findAll = function(callback) {
    var Albums = mongoose.model('Albums');
    Albums.find().exec(function(err, photos) {
        if(err)
            console.log(err);
        callback(err, photos);
    });
};

var buildAlbumObj = function(folderName, albumName, photoName) {
  var albumObj = {};
    var photos = [photoName];
    albumObj.folderName = folderName;
    albumObj.albumName = albumName;
    albumObj.photoNames = photos;

    return albumObj;

};

module.exports = AlbumsBo;