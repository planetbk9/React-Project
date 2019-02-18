const mongoose = require('mongoose');

const dateSchema = new mongoose.Schema({
  subject: String,
  time: Number,
  updated: {type: Date, default: Date.now}
});

const userSchema = new mongoose.Schema({
  date: String,
  dateItems: [dateSchema]
});


var timeSchema = new mongoose.Schema({
  user: String,
  userItems: [userSchema]
});
module.exports = mongoose.model('Time', timeSchema);