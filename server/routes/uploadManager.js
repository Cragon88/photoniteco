// config the uploader
var fs = require('fs');
var options = {
    tmpDir: __dirname + '/../uploaded/tmp',
    uploadDir: __dirname + '/../uploaded/files',
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

var uploader = require('../lib/uploadHandler.js')(options);
var AlbumsBo = require('../lib/bo/AlbumsBo.js');


module.exports = function(router) {
    //router.get('/upload', function(req, res) {
    //    uploader.get(req, res, function(err, obj) {
    //        res.send(JSON.stringify(obj));
    //    });
    //
    //});

    router.post('/upload', function(req, res) {
        uploader.post(req, res, function(err, obj) {
            res.send(JSON.stringify(obj));
        });

    });

    router.delete('/uploaded/files/:name', function(req, res) {
        uploader.delete(req, res, function(err, obj) {
            res.send(JSON.stringify(obj));
        });
    });

    router.get('/uploaded/files/:file', function(req, res) {
        uploader.getFullSizeFile(req, res, function(err, data) {
            res.writeHead(200, {'Content-Type': 'image/jpg' });
            res.end(data, 'binary');
        });
    });

    router.get('/uploaded/files/thumbnail/:file', function(req, res) {
        uploader.getThumbsFile(req, res, function(err, data) {
            res.writeHead(200, {'Content-Type': 'image/jpg' });
            res.end(data, 'binary');
        });
    });

    router.get('/uploaded/files/thumbnail/:file', function(req, res) {
        uploader.getThumbsFile(req, res, function(err, data) {
            res.writeHead(200, {'Content-Type': 'image/jpg' });
            res.end(data, 'binary');
        });
    });

    router.get('/albums', function(req, res) {
        AlbumsBo.findAll(function(err, data){
            if (err) {
                console.log("Failure to get menu!")
            } else {
                res.json(data);
            }
        });
    });

    router.get('/albums/year', function(req, res) {
        AlbumsBo.findAlbumYears(function(err, data){
            if (err) {
                console.log("Failure to get menu!")
            } else {
                res.json(data);
            }
        });
    });

    router.get('/albums/month/:year', function(req, res) {
        AlbumsBo.findAlbumMonthsByYear(req.params.year, function(err, data){
            if (err) {
                console.log("Failure to get menu!")
            } else {
                res.json(data);
            }
        });
    });

    router.get('/albums/:year/:month', function(req, res) {
        AlbumsBo.findAlbumsByMonthAndYear(req.params.year, req.params.month, function(err, data){
            if (err) {
                console.log("Failure to get menu!")
            } else {
                res.json(data);
            }
        });
    });

    router.get('/photos/:year/:month/:folderName', function(req, res) {
        AlbumsBo.getPhotos(req.params.year, req.params.month, req.params.folderName, function(err, data){
            if (err) {
                console.log("Failure to get Photos!")
            } else {
                res.json(data);
                console.log("data to get Photos!");
                console.log(data);
            }
        });
    });

    router.get('/photo/file/:year/:month/:folderName/:name', function(req, res) {
        uploader.getOriginalPhoto(req, res, function(err, data) {
            res.writeHead(200, {'Content-Type': 'image/jpg' });
            res.end(data, 'binary');
        });
    });
    router.get('/photo/thumbnail/:year/:month/:folderName/:name', function(req, res) {
        uploader.getThumbnail(req, res, function(err, data) {
            res.writeHead(200, {'Content-Type': 'image/jpg' });
            res.end(data, 'binary');
        });
    });

    return router;
};
