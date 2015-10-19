/**
 * Created by thanhnguyen on 08/10/2015.
 */

var mongoose = require('mongoose');

var TestsBo = {};

TestsBo.saveFileUploaded = function(transporter, files, cb) {
    var Tests = mongoose.model('Tests');
    Tests.findOne({year : transporter.albumYear, month:transporter.albumMonth})
        .exec(function(err, album) {
            if (!album){
                var album = buildAlbumObj(transporter.albumName, [files[0].name]);
                var albumArr = [album];
                var tests = new Tests({year: transporter.albumYear, month: transporter.albumMonth, albums: albumArr});
                tests.save(function(err, result){
                    if(err) {
                        console.log(err)
                    } else if(!cb) {
                        cb(err, tests)
                    }
                });
            } else {
                var albumArr = album.albums;
                var albumObj;
                for(var i = 0 ;i < albumArr.length; i++) {
                   if(albumArr[i].albumName === transporter.albumName) {
                       albumObj = albumArr[i];
                       break;
                   }
                }

                if(!albumObj) {
                    albumObj = buildAlbumObj(transporter.albumName, [files[0].name]);
                    album.albums.push(albumObj);
                } else {
                    albumObj.photoNames.push([files[0].name]);
                }
                album.save(function(err, result){
                    if(err) {
                        console.log(err)
                    } else if(!cb) {
                        cb(err, album)
                    }
                });
            }
        });
};

TestsBo.findByPhotoName = function(name, callback) {
    var Albums = mongoose.model('Albums');
    Albums.find({photos:name}).exec(function(err, photos) {
        if(err)
            console.log(err);
        else
            console.log('Data find by '+name+ ' '+photos);
        callback(err, photos);
    });
};

var buildAlbumObj = function(albumName, photoName) {
  var albumObj = {};
    var photos = [photoName];

    albumObj.albumName = albumName;
    albumObj.photoNames = photos;

    return albumObj;

};

module.exports = TestsBo;