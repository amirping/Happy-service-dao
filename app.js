// Main server thread , getting all request come to server , pass all throw mideltware ----
const express = require('express');
const app = express();
// const mongoose = require('mongoose');  removed for override
const port = 3000;
const db_engine = require('./js/engine_db');
var bodyParser = require("body-parser");
const cryptage_engine = require('./js/cryptage');
// loading models
const User = require('./models/user').User;
const Connection = require('./models/connection').COnnection;
// loading routes
var routes = require('./js/routes');
// bodyParser loading
app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(bodyParser.json());

// DB bind
let db = db_engine.connector();

// Loging mid
app.use((request, response, next) => {
  console.log(request.headers);
  next();
});

// check the request comming source IP
app.use((request, response, next) => {
  console.log("IP : " + request.connection.remoteAddress);
  next();
});

// mid to allow CROS

app.use(function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*'); // make it * later
  // Request methods you wish to allow
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  // Request headers you wish to allow
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
  // Set to true if you need the website to include cookies in the requests sent
  // to the API (e.g. in case you use sessions)
  res.setHeader('Access-Control-Allow-Credentials', true);
  // intercept OPTIONS method
   if ('OPTIONS' == req.method) {
     res.status(200).json({});
   }
   else {
     next();
}
});

// check the DB stat to decide where we can run or not
app.use((request, response, next) => {
  let db = db_engine.stats;
  // let it false until we run the DB
  if (!db.DB_linked) {
    console.log("Blocked access while DB is OFF");
    response.status(500).json({
      "msg": "Dis off , plz try later"
    });
  } else {
    console.log(request.originalUrl);
    var fullUrl = request.protocol + '://' + request.get('host') + request.originalUrl;
    console.log("URL : " + fullUrl);
    next();
  }
});



// response for main access to server
let resp = {
  server: "",
  db: ""
}

app.all('/', (request, response) => {
  let b_rep = resp;
  b_rep.server = "ON";
  b_rep.db = db_engine.stats;
  if (!b_rep.db.DB_linked) {
    b_rep.set('msg', "can't connect to Database , plz try later");
    b_rep.set("code", "DBx01");
  } else {
    b_rep.msg = "connected";
    b_rep.code = "200";
  }
  response.json(b_rep);
});

//api routings goes here nanananana

app.use('/api', routes);

// err handler
app.use((err, request, response, next) => {
  // log the error, for now just console.log
  console.log(err);
  response.status(500).send('Something broke!');
});

app.listen(process.env.PORT || port);
