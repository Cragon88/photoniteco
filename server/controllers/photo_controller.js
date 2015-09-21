var mongoose = require('mongoose');
var Photo = mongoose.model('Photo');

exports.getPhotos = function(req, res) {
    Photo.find()
    .exec(function(err, photos) {
        if (!photos){
          res.json(404, {msg: 'Photo Not Found.'});
        } else {
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
