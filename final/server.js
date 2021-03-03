const MongoClient = require('mongodb').MongoClient; //npm install mongodb@2.2.32
const express = require('express');
const url = "mongodb://127.0.0.1:27017/filmStalker";
const bodyParser = require('body-parser');
const app = express();
const port = 8080

var db

MongoClient.connect(url, function(err, database) {
  if (err) throw err;
  db = database;
  app.listen(port);
  console.log('listening on: ', port);
});

app.use(bodyParser.urlencoded({
  extended: true
}))

app.set('view engine', 'ejs');

app.use(express.static('public'));


app.get('/', (req, res) => {
  res.render("pages/index");
});

app.get('/about', (req, res) => {
  res.render("pages/about");
});

app.get('/account', (req, res) => {
  res.render("pages/account");
});

app.get('/contact', (req, res) => {
  res.render("pages/contact");
});

app.get('/directions', (req, res) => {
  res.render("pages/directions");
});

app.get('/directions', (req, res) => {
  res.render("pages/directions");
});

app.get('/login', (req, res) => {
  res.render("pages/logIn");
});

app.get('/map', (req, res) => {
  res.render("pages/map");
});

app.get('/movie', (req, res) => {
  res.render("pages/movie");
});

app.get('/mystalks', (req, res) => {
  res.render("pages/mystalks");
});

app.get('/signup', (req, res) => {
  res.render("pages/signup");
});

app.post('/adduser', function(req, res) {
  var new_user_info = {
    "email" : req.body.email,
    "username" : req.body.username,
    "password" : req.body.password,
    "postcode" : req.body.postcode
  }

  console.log(new_user_info)

  db.collection('users').save(new_user_info, function(err, result) {
    if (err) throw err;
    console.log('saved to database')
  })

  res.redirect('/map');
});

