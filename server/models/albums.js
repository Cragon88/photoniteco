var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Albums = new Schema({
    year:Number,
    month:Number,
    album: {
        folderName: String,
        albumName: String,
        photoNames :[String]
    }
}, { _id: true });

mongoose.model('Albums', Albums);

