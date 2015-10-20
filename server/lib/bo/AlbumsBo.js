/**
 * Created by thanhnguyen on 08/10/2015.
 */

var mongoose = require('mongoose');

var AlbumsBo = {};

AlbumsBo.saveFileUploaded = function(transporter, files, cb) {
    var Albums = mongoose.model('Albums');
    Albums.findOne({year: transporter.albumYear, month: transporter.albumMonth, 'album.albumName': transporter.albumName}).exec(function(err, result) {
        if(err) {
            console.log(err);
            cb(err, null);
            return;
        }

        if (!result){
            var albumNew = buildAlbumObj(transporter.albumFolderName, transporter.albumName, [files[0].name]);
            var albums = new Albums({year: transporter.albumYear, month: transporter.albumMonth, album: albumNew});
            albums.save(function(err, rs){
                if(err)
                console.log(err);
                cb(err, rs);
            });
        } else {
            result.album.photoNames.push([files[0].name]);
            result.save(function(err, rs){
                if(err) {
                    console.log(err)
                } else if(!cb) {
                    cb(err, rs)
                }
            });
        }
    });
};

AlbumsBo.insert = function(transporter, cb) {
    var Albums = mongoose.model('Albums');

    var albumObj = {};
    albumObj.folderName = transporter.albumFolderName;
    albumObj.albumName = transporter.albumName;
    albumObj.photoNames = [];
    var albums = new Albums({year: transporter.albumYear, month: transporter.albumMonth, album: albumObj});

    albums.save(function(err, rs){
        if(err)
            console.log(err);
        cb(err, rs);
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

AlbumsBo.findAlbumYears = function(callback) {
    var Albums = mongoose.model('Albums');
    Albums.aggregate({$group:{_id:{name: '$year'}, total: {$sum:1}}}).exec(function(err, years) {
        if(err)
            console.log(err);
        callback(err, years);
    });
};

AlbumsBo.findAlbumMonthsByYear = function(year, callback) {
    var Albums = mongoose.model('Albums');
    Albums.aggregate([
        {$match:{year:parseInt(year)} },
        {$group:{
            _id: {name: '$month', year: '$year'},
            total: {$sum:1}}
        }

    ]).exec(function(err, months) {
        if(err)
            console.log(err);
        callback(err, months);
    });
};

AlbumsBo.findAlbumsByMonthAndYear = function(year, month, callback) {
    var Albums = mongoose.model('Albums');
    Albums.find({year: year, month: month}).exec(function(err, albums) {
        if(err)
            console.log(err);
        callback(err, albums);
    });
};

AlbumsBo.getPhotos = function(year, month, folderName, callback) {
    var Albums = mongoose.model('Albums');
    Albums.findOne({year: year, month: month, "album.folderName": folderName}).exec(function(err, albums) {
        if(err)
            console.log(err);
        callback(err, albums);
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