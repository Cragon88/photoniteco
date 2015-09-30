var mongoose = require('mongoose'),
    Schema = mongoose.Schema;
var PhotoSchema = new Schema({
  year: Number,
  albumName: String,
  photoName: String,
}, { _id: false });
mongoose.model('Photo', PhotoSchema);