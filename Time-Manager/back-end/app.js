var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var Time = require('./models/time');
var mongoose = require('mongoose');
const cors = require('cors');

const corsOptions = {
  origin: (origin, callback) => {
    //if(/kevin9.iptime.org/.test(origin)) callback(null, true);
    //else callback(new Error('Not allowed by CORS'));
    callback(null, true);
  },
  credentials: true
};

app.use(cors(corsOptions));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

mongoose.connect('mongodb://localhost/Practice');  

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'Connection Error!'));
db.once('open', () => {
  console.log('Connection Success!');
});

var port = process.env.PORT || 9000;
var server = app.listen(port, () => {
  console.log('Express server has started on port ' + port);
});

var router = require('./routes')(app, Time);
