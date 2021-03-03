const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = 8080

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
    "password" : req.body.password
  }

  console.log(new_user_info)
});

console.log("listening on port: ", port)
app.listen(port);