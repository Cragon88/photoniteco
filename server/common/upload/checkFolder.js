var fs = require('fs');
var mkdirp  = require('mkdirp');
var path = require('path');
var AlbumsBo = require('../../bo/AlbumsBo.js');
/**
 * check if folder exists, otherwise create it
 */
var folderApi = {};
folderApi.checkExists = function checkExists(transporter, cb) {
  fs.exists(transporter.options.uploadDir, function(exists) {
    if (!exists) {
      mkdirp(path.join(transporter.options.uploadDir, 'thumbnail') , function(err) {
        if (err) {
          console.error(err);
        } else {
           console.log('The uploads folder was not present, we have created it for you [' + transporter.options.uploadDir + ']');
           AlbumsBo.insert(transporter, function(err, datas){
             if(cb) cb();
           });
        }
      });
    } else {
      if(cb) cb();
    }
  });
};

folderApi.markTmpFolder = function (dir) {
  fs.exists(dir, function(exists) {
    if (!exists) {
      mkdirp(dir, function(err) {
        if (err) console.error(err);
        else console.log('The uploads folder was not present, we have created it for you [' + dir + ']');
      });
      //throw new Error(dir + ' does not exists. Please create the folder');
    }
  });
};


module.exports = folderApi;
