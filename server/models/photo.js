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