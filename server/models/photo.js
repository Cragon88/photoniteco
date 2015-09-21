var mongoose = require('mongoose'),
    Schema = mongoose.Schema;
var PhotoSchema = new Schema({
  name: String
}, { _id: false });
mongoose.model('Photo', PhotoSchema);