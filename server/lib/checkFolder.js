var fs = require('fs');
var mkdirp  = require('mkdirp');
var path = require('path');
/**
 * check if folder exists, otherwise create it
 */
var folderApi = {};
folderApi.checkExists = function checkExists(options, cb) {
  fs.exists(options.uploadDir, function(exists) {
    if (!exists) {
      mkdirp(options.uploadDir, function(err) {
        if (err) console.error(err);
        else {
          console.log('The uploads folder was not present, we have created it for you [' + options.uploadDir + ']');
          mkdirp(path.join(options.uploadDir, 'thumbnail'), function(err) {
            if (err) console.error(err);
            else {
              console.log('The uploads folder was not present, we have created it for you [' + path.join(options.uploadDir, 'thumbnail') + ']')
              if(cb) cb();
            }
          });
        }
      });
      //throw new Error(dir + ' does not exists. Please create the folder');
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
