var express = require('express');
module.exports = function(app) {
  var photo = require('../server/controllers/photo_controller');
  app.get('/photo/get', photo.getPhotos);
  app.post('/photo/add', photo.addPhoto);
};