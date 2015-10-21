var fs = require('fs');
var constant = require('../constants');
var options = {
    tmpDir: constant.UPLOADED_FOLDER + '/tmp',
    uploadDir: constant.UPLOADED_FOLDER + '/files',
    uploadUrl: '/uploaded/files/',
    maxPostSize: 11000000000, // 11 GB
    minFileSize: 1,
    maxFileSize: 10000000000, // 10 GB
    acceptFileTypes: /.+/i,
    // Files not matched by this regular expression force a download dialog,
    // to prevent executing any scripts in the context of the service domain:
    inlineFileTypes: /\.(gif|jpe?g|png)$/i,
    imageTypes: /\.(gif|jpe?g|png)$/i,
    imageVersions: {
        maxWidth: 80,
        maxHeight: 80
    },
    accessControl: {
        allowOrigin: '*',
        allowMethods: 'OPTIONS, HEAD, GET, POST, PUT, DELETE',
        allowHeaders: 'Content-Type, Content-Range, Content-Disposition'
    },
    storage : {
        type : 'local'
    },
    nodeStatic: {
        cache: 3600 // seconds to cache served files
    }
};

var uploader = require('../common/upload/uploadHandler.js')(options);
var AlbumsBo = require('../bo/AlbumsBo.js');

exports.uploadPhoto = function(req, res) {
    uploader.post(req, res, function(err, obj) {
        res.send(JSON.stringify(obj));
    });
};

exports.deletePhoto = function(req, res) {
    uploader.delete(req, res, function(err, obj) {
        res.send(JSON.stringify(obj));
    });
};

exports.getPhoto1 = function(req, res) {
    uploader.getFullSizeFile(req, res, function(err, data) {
        res.writeHead(200, {'Content-Type': 'image/jpg' });
        res.end(data, 'binary');
    });
};

exports.getThumbnail1 = function(req, res) {
    uploader.getThumbsFile(req, res, function(err, data) {
        res.writeHead(200, {'Content-Type': 'image/jpg' });
        res.end(data, 'binary');
    });
};

exports.getAlbums = function(req, res) {
    AlbumsBo.findAll(function(err, data){
        if (err) {
            console.log("Failure to get menu!")
        } else {
            res.json(data);
        }
    });
};

exports.getAlbumYear = function(req, res) {
    AlbumsBo.findAlbumYears(function(err, data){
        if (err) {
            console.log("Failure to get menu!")
        } else {
            res.json(data);
        }
    });
};

exports.getAlbumMonthsByYear = function(req, res) {
    AlbumsBo.findAlbumMonthsByYear(req.params.year, function(err, data){
        if (err) {
            console.log("Failure to get menu!")
        } else {
            res.json(data);
        }
    });
};

exports.getAlbumsByYearAndMonth = function(req, res) {
    AlbumsBo.findAlbumsByMonthAndYear(req.params.year, req.params.month, function(err, data){
        if (err) {
            console.log("Failure to get menu!")
        } else {
            res.json(data);
        }
    });
};

exports.getPhotos = function(req, res) {
    AlbumsBo.getPhotos(req.params.year, req.params.month, req.params.folderName, function(err, data){
        if (err) {
            console.log("Failure to get Photos!")
        } else {
            res.json(data);
            console.log("data to get Photos!");
            console.log(data);
        }
    });
};

exports.getPhoto2 = function(req, res) {
    uploader.getOriginalPhoto(req, res, function(err, data) {
        res.writeHead(200, {'Content-Type': 'image/jpg' });
        res.end(data, 'binary');
    });
};

exports.getThumbnail2 = function(req, res) {
    uploader.getThumbnail(req, res, function(err, data) {
        res.writeHead(200, {'Content-Type': 'image/jpg' });
        res.end(data, 'binary');
    });
};
