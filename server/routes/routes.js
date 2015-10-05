var express = require('express');
var fs = require('fs');
var path = require('path');
module.exports = function(app) {
  var photo = require('../controllers/photo_controller');
  app.get('/photos/:year', photo.getPhotos);
  app.post('/photo/add', photo.addPhoto);

  //app.get('/imgs/:year/:imageName', function(req, res) {
  //  var year = req.params['year'];
  //  var image = req.params['imageName'];
  //  res.sendfile(path.join('/ui', 'imgs', year, image));
  //
  //});
};