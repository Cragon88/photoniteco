var mongoose = require('mongoose');
var Photo = mongoose.model('Photo');
var photoUntil = require('../photountil/photo_until.js');

exports.getPhotos = function(req, res) {
    var year = req.params.year;
    Photo.find({year:year})
    .exec(function(err, photos) {
        if (!photos){
          res.json(404, {msg: 'Photo Not Found.'});
        } else {
            //Test Photo API.
            //var fullPath = '/ui/imgs/2015/MalaysiaCompanyTrip/IMG_1654.JPG';
            //photoUntil.resize(fullPath);
            res.json(photos);
        }
    });
};

exports.addPhoto = function(req, res){
  var newPhoto = new Photo({name: "new photo"});
    newPhoto.save(function(err, results){
    if(err){
      res.json(500, "Failed to save Photo.");
    } else {
        res.json({msg: "Photo Saved."});
    }
  });
};
