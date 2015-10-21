/*jslint node: true */
'use strict';

var FileInfo = require('./fileinfo');
var configs = require('./configs');
var formidable = require('formidable');
var fs = require('fs');
var path = require('path');
var folderApi     = require('./checkFolder');
var dd = require('date-utils');
var AlbumsBo = require('../../bo/AlbumsBo');
var constants = require('../../constants');

module.exports = uploadService;

function uploadService(opts) {
    var options = configs.apply(opts);
    var transporter = options.storage.type === 'local' ? require('./transport/local.js') : require('./transport/aws.js');

    transporter = transporter(options);

    var fileUploader = {};

    fileUploader.config = options;

    function setNoCacheHeaders(res) {
        res.setHeader('Pragma', 'no-cache');
        res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate');
        res.setHeader('Content-Disposition', 'inline; filename="files.json"');
    }

    fileUploader.get = function(req, res, callback) {
        this.config.host = req.headers.host;
        setNoCacheHeaders(res);
        transporter.get(callback);
    };

    fileUploader.post = function(req, res, callback) {

        setNoCacheHeaders(res);
        var form = new formidable.IncomingForm();
        var tmpFiles = [];
        var files = [];
        var map = {};
        var fields = {};
        var redirect;

        this.config.host = req.headers.host;

        var configs = this.config;

        req.body = req.body || {};

        function finish(error, fileInfo) {

            if (error) return callback(error, {
                files: files
            }, redirect);

            if (!fileInfo) return callback(null, {
                files: files
            }, redirect);

            var allFilesProccessed = true;

            files.forEach(function(file, idx) {
                allFilesProccessed = allFilesProccessed && file.proccessed;
            });

            if (allFilesProccessed) {
                AlbumsBo.saveFileUploaded(transporter, files, function(err, album){

                });
                callback(null, {
                    files: files
                }, redirect);
            }
        }

        form.uploadDir = configs.tmpDir;

        form.on('fileBegin', function(name, file) {
            tmpFiles.push(file.path);
            // fix #41
            configs.saveFile = true;
            var fileInfo = new FileInfo(file, configs, fields);
            map[fileInfo.key] = fileInfo;
            files.push(fileInfo);
        }).on('field', function(name, value) {
            fields[name] = value;
            if (name === 'redirect') {
                redirect = value;
            } else if(name === 'albumDate') {
                var parts = value.split('/');
                transporter.albumYear = parts[2];
                transporter.albumMonth = parts[0];
                transporter.albumDay = parts[1];
            } else if(name === 'albumName') {
                transporter.albumName = value;
                transporter.albumFolderName = getStringCode(value);
            }
        }).on('file', function(name, file) {
            var fileInfo = map[FileInfo.getFileKey(file.path)];
            fileInfo.update(file);
            if (!fileInfo.validate()) {
                finish(fileInfo.error);
                fs.unlink(file.path);
                return;
            }
            transporter.options.uploadDir = path.join(constants.UPLOADED_FOLDER, transporter.albumYear, parseInt(transporter.albumMonth).toString(), transporter.albumFolderName.toString());
            folderApi.checkExists(transporter, function() {
                transporter.post(fileInfo, file, finish);
            });
        }).on('aborted', function() {
            finish('aborted');
            tmpFiles.forEach(function(file) {
                fs.unlink(file);
            });
        }).on('error', function(e) {
            console.log('form.error', e);
            finish(e);
        }).on('progress', function(bytesReceived) {
            if (bytesReceived > configs.maxPostSize) {
                req.connection.destroy();
            }
        }).on('end', function() {

        }).parse(req);
    };

    fileUploader.delete = function(req, res, callback) {
        transporter.delete(req, res, callback);
    };

    fileUploader.getThumbsFile = function(req, res, callback) {
        var file = req.params.file;
        fs.readFile( path.join(constants.UPLOADED_FOLDER, transporter.albumYear, parseInt(transporter.albumMonth).toString(), transporter.albumFolderName.toString(), 'thumbnail', file), function (err, data) {
            if (err) console.log(err);
            callback(err, data);
        });
    };

    fileUploader.getFullSizeFile = function(req, res, callback) {
        var file = req.params.file;
        fs.readFile( path.join(constants.UPLOADED_FOLDER, transporter.albumYear, parseInt(transporter.albumMonth).toString(), transporter.albumFolderName.toString(), file), function (err, data) {
            if (err) console.log(err);
            callback(err, data);
        });
    };

    fileUploader.getThumbnail = function(req, res, callback) {
        fs.readFile( path.join(constants.UPLOADED_FOLDER, req.params.year, req.params.month, req.params.folderName, 'thumbnail', req.params.name), function (err, data) {
            if (err) console.log(err);
            callback(err, data);
        });
    };

    fileUploader.getOriginalPhoto = function(req, res, callback) {
        fs.readFile( path.join(constants.UPLOADED_FOLDER, req.params.year, req.params.month, req.params.folderName, req.params.name), function (err, data) {
            if (err) console.log(err);
            callback(err, data);
        });
    };

    var getStringCode = function(str) {
        var hash = 5381;
        var i = str.length;

        while(i) hash = (hash * 33) ^ str.charCodeAt(--i);

        /* JavaScript does bitwise operations (like XOR, above) on 32-bit signed
         * integers. Since we want the results to be always positive, convert the
         * signed int to an unsigned by doing an unsigned bitshift. */
        return hash >>> 0;
    };

    return fileUploader;
}
