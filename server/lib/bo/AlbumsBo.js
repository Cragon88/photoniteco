/**
 * Created by thanhnguyen on 08/10/2015.
 */

var mongoose = require('mongoose');

var AlbumsBo = {};

AlbumsBo.saveFileUploaded = function(transporter, files, cb) {
    var Albums = mongoose.model('Albums');
    Albums.findOne({name : transporter.albumName})
        .exec(function(err, album) {
            if (!album){
                var photoArr = [files[0].name];
                var al = new Albums({name: transporter.albumName, date: new Date(),
                    path: 'uploaded/'+transporter.albumYear+ '/' + transporter.albumMonth+ '/' +transporter.albumName, photos : photoArr});

                al.save(function(err, result){
                    if(err) {
                        console.log(err)
                    } else if(!cb) {
                        cb(err, al)
                    }
                });
            } else {
                album.photos.push([files[0].name]);
                album.save(function(err, result){
                    if(err) {
                        console.log(err)
                    } else if(!cb) {
                        cb(err, al)
                    }
                });
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

module.exports = AlbumsBo;