var mongoose = require('mongoose');

var timeSchema = new mongoose.Schema({
  _id: String,
  date: {type: Date, default: Date.now},
  time: Number
});
module.exports = mongoose.model('Time', timeSchema);