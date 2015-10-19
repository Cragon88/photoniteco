var mongoose = require('mongoose'),
    Schema = mongoose.Schema;
var PhotoSchema = new Schema({
  year: Number,
  albumName: String,
  photoName: String,
}, { _id: false });
mongoose.model('Photo', PhotoSchema);

var Albums = new Schema({
    name: String,
    date: {
        type: Date,
        default: Date.now
    },
    path: String,
    photos: [String]
}, { _id: true });

mongoose.model('Albums', Albums);

var Menus = new Schema({
    year:Number,
    month:Number,
    albumNames: [String]
}, { _id: true });

mongoose.model('Menus', Menus);

var AL = new Schema ({
    albumName: String,
    photoNames :[String]
});
var Tests = new Schema({
    year:Number,
    month:Number,
    albums: [AL]
}, { _id: true });

mongoose.model('Tests', Tests);

