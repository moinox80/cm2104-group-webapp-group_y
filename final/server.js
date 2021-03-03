const MongoClient = require('mongodb').MongoClient; //npm install mongodb@2.2.32
const express = require('express');
const url = "mongodb://127.0.0.1:27017/filmStalker";
const bodyParser = require('body-parser');
const session = require('express-session');
const app = express();
const fs = require ("fs");
const port = 8080;

var db

var logInLink = "<a href='/logIn' <li>Log&nbsp;In</li> </a>"
var logOutLink = "<a href='/logOut' <li>Log&nbsp;Out</li> </a>"

MongoClient.connect(url, function(err, database) {
  if (err) throw err;
  db = database;
  app.listen(port);
  console.log('listening on: ', port);
});

app.use(session({ secret: 'example' }));

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
  res.render("pages/account", {loggedIn:req.session.loggedin});
});

app.get('/contact', (req, res) => {
  res.render("pages/contact");
});

app.get('/directions', (req, res) => {
  res.render("pages/directions", {loggedIn:req.session.loggedin});
});

app.get('/login', (req, res) => {
  res.render("pages/logIn", {loggedIn:req.session.loggedin});
});

app.get('/map', (req, res) => {
  res.render("pages/map", {loggedIn:req.session.loggedin});
});

app.get('/movie', (req, res) => {
  res.render("pages/movie", {loggedIn:req.session.loggedin});
});

app.get('/mystalks', (req, res) => {
  res.render("pages/mystalks", {loggedIn:req.session.loggedin});
});

app.get('/signup', (req, res) => {
  res.render("pages/signup");
});

app.get('/logOut', (req, res) => {
  if(req.session.loggedin){
    req.session.userid = null;
    req.session.loggedin = null;
  }
  res.redirect('/');
})

app.post('/adduser', function(req, res) {
  var new_user_info = {
    "email" : req.body.email,
    "username" : req.body.username,
    "password" : req.body.password,
    "postcode" : req.body.postcode
  };

  console.log(new_user_info);

  db.collection('users').save(new_user_info, function(err, result) {
    if (err) throw err;
    console.log('saved to database');
  });

  res.redirect('/map');
});

app.post('/dologin', function(req, res) {
  var username = req.body.username;
  var password = req.body.password;
  var user;
  db.collection('users').findOne({"username":username},function(err, result) {
    if (err) throw err;
    if (result){
      user = result;
      if (user.password == password){
        logInUser(user, req)
        res.redirect('/map');
        return;
      }
    }
    res.redirect('/login');
  })
});
  
  
function logInUser(user, req){
  console.log("log user in ", user.username);
  req.session.loggedin = true;
  req.session.userid = user._id;
}

function getLogInOrOutLink(req){
  if(!req.session.loggedin){
    return logOutLink;
  }
  return logInLink;
}