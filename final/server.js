const MongoClient = require('mongodb').MongoClient; //npm install mongodb@2.2.32
const express = require('express');
const url = "mongodb://127.0.0.1:27017/filmStalker";
const ObjectId = require('mongodb').ObjectId; 
const bodyParser = require('body-parser');
const session = require('express-session');
const app = express();
const fs = require ("fs");
const bcrypt = require('bcrypt')
const port = 8080;
const ejs = require('ejs');
const axios = require('axios').default;

// get a instance of sendgrid and set the API key
const sendgrid = require('@sendgrid/mail');//https://mailslurp.medium.com/sending-emails-in-javascript-3-ways-to-send-and-test-emails-with-nodejs-8f3e5c3d0964
sendgrid.setApiKey("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");// construct an email
var baseResetPassEmail = {
  to: null,
  from: 'filmstalkerrgu@gmail.com',
  subject: 'Get Passowrd FilmStalker',
  text: null,
};// send the email via sendgrid

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
  if (req.session.loggedin){
    var userid = req.session.userid;
    var o_id = new ObjectId(userid);
    db.collection('users').findOne({_id:o_id}, async function(err, result) {
      if (err) throw err;
      var userStalks = result.myStalks;
      var locationsVisited = result.locationsVisited;
      res.render("pages/map", {loggedIn:req.session.loggedin, stalksFromServer: userStalks});

    })
    return;
  }
  res.render("pages/map", {loggedIn:req.session.loggedin});
});

app.get('/movie', (req, res) => {
  res.render("pages/movie", {loggedIn:req.session.loggedin});
});

app.get('/mystalks', async (req, res) => {
  if (req.session.loggedin) {
    var userid = req.session.userid;
    var o_id = new ObjectId(userid);
    db.collection('users').findOne({_id:o_id}, async function(err, result) {
      if (err) throw err;
      var userStalks = result.myStalks;
      var locationsVisited = result.locationsVisited;
      var html = await ejs.renderFile(
        "views/pages/mystalks.ejs",
        {loggedIn:req.session.loggedin, userStalks:userStalks, locationsVisited: locationsVisited, axios:axios},
        {async:true}
      );
      res.send(html);
    });
  }
  else{
    res.render("pages/map", {loggedIn:req.session.loggedin});
  }
});

app.get('/signup', (req, res) => {
  res.render("pages/signup", {loggedIn:req.session.loggedin});
});

app.get("/resetPassword", (req, res) => {
  res.render("pages/resetPassword", {loggedIn:req.session.loggedin});
});

app.get('/logOut', (req, res) => {
  logOutuser(req);
  res.redirect('/');
})

app.post('/adduser', async function(req, res) {
  var uncryptedPassword = req.body.password;
  const hashedPassword = await bcrypt.hash(uncryptedPassword, 10)//https://www.npmjs.com/package/bcrypt
  var new_user_info = {
    "email" : req.body.email,
    "username" : req.body.username,
    "password" : hashedPassword,
    "DELETEplaintextPasswordDELETEME" : uncryptedPassword,
    "postcode" : req.body.postcode,
    "myStalks" : [],
    "locationsVisited" : {},
    "resetPasswordKey" : null
  };

  console.log("user info:\n", new_user_info);

  db.collection('users').save(new_user_info, function(err, result) {
    if (err) throw err;
    console.log('added user ', new_user_info.username, " to database");
  });

  res.redirect('/map');
});

app.post('/removeUser', function(req, res) {
  if(!req.session.loggedin){return;}
  
  var userid = req.session.userid;
  var o_id = new ObjectId(userid);
  db.collection('users').deleteOne({_id:o_id},function(err, result) {
    if (err) throw err;
    if (result){
      console.log("deleted user: ", userid)
      logOutuser(req);
      console.log("redirecting");
      return;
    }
  })
  res.redirect('/');
})

app.post('/dologin', async function(req, res) {
  var username = req.body.username;
  var plainTextPassword = req.body.password;
  var user;
  db.collection('users').findOne({"username":username},async function(err, result) {
    if (err) throw err;
    if (result){
      user = result;
      var isPasswordMatch = await bcrypt.compare(plainTextPassword, user.password);
      if (isPasswordMatch){
        logInUser(user, req)
        res.redirect('/map');
        return;
      }
    }
    res.redirect('/login');
  })
});

app.post("/addMovieToMyStalks", function(req, res) {
  if(!req.session.loggedin){return;}
  var userid = req.session.userid;
  var o_id = new ObjectId(userid);
  db.collection('users').findOne({_id:o_id},function(err, result) {
    if (err) throw err;
    var user = result;
    var userStalks = user.myStalks;
    var newMovieID = req.body.movieId;
    var newMovieObject = {"imdbID": req.body.movieId, "locationsVisited": []};

    if(!newMovieID){return;}
    for (movieObject of userStalks){
      if (movieObject.imdbID == newMovieID){
        console.log("movie already exists");
        return;
      }
    }

    userStalks.push(newMovieObject);
    var newMyStalks = {$set: {"myStalks": userStalks}};
    db.collection('users').updateOne({_id:o_id},newMyStalks,function(err, result) {
      if (err) throw err;
    });
    console.log("added ", newMovieID, "to myStalks on user: ", user.username);
  })
})

app.post("/removeMovieFromMyStalks", function(req, res) {
  if(!req.session.loggedin) return;
  var userid = req.session.userid;
  var o_id = new ObjectId(userid);
  db.collection('users').findOne({_id:o_id},function(err, result) {
    if (err) throw err;
    var user = result;
    var userStalks = user.myStalks;
    var movieIdToRemove = req.body.movieId;

    if (!movieIdToRemove) return;

    var index = -1;
    userStalks.forEach((stalk, stalkIndex) => {
      if (stalk.imdbID === movieIdToRemove) {
        index = stalkIndex;
      }
    });
    if (index === -1) return;

    userStalks.splice(index, 1);
    var newMyStalks = {$set: {"myStalks": userStalks}};
    db.collection('users').updateOne({_id:o_id},newMyStalks,function(err, result) {
      if (err) throw err;
    });
    console.log("removed ", movieIdToRemove, "to myStalks on user: ", user.username);
  })
})

app.post("/addLocationToVisited", function(req, res) {
  if(!req.session.loggedin){return;}

  var userid = req.session.userid;
  var o_id = new ObjectId(userid);
  db.collection('users').findOne({_id:o_id},function(err, result) {
    if (err) throw err;
    if (!result){return;}
    var locationName = req.body.locationByName;
    var user = result;
    var userStalks = user.myStalks;
    var imdbID = req.body.movieId;

    userStalks.forEach(stalk => {
      if (stalk.imdbID === imdbID) {
        if (stalk.locationsVisited.includes(locationName)) return;
        stalk.locationsVisited.push(locationName);
      }
    });
    
    /*
    console.log(imdbID)
    if(!Object.keys(userLocations).includes(imdbID)){
      userLocations[imdbID] = [];
    };
    var found = false;
    userLocations[imdbID].forEach(location => {
      if (location.locationName == locationName){
        found = true;
      }
    });

    if (found){return;}
    userLocations[imdbID].push({"locationName":locationName, "locationByLatLong":location});
    */

    var newMyStalks = {$set: {"myStalks": userStalks}};
    db.collection('users').updateOne({_id:o_id},newMyStalks,function(err, result) {
      if (err) throw err;
      console.log("added ", locationName, " from ", imdbID, " on user: ", user.username)
    })
  });
})

app.post("/removeLocationFromVisited", function(req, res) {
  if(!req.session.loggedin){return;}

  var userid = req.session.userid;
  var o_id = new ObjectId(userid);
  db.collection('users').findOne({_id:o_id},function(err, result) {
    if (err) throw err;
    if (!result){return;}
    var locationName = req.body.locationByName;
    var user = result;
    var userStalks = user.myStalks;
    var imdbID = req.body.movieId;

    if(!Object.keys(userLocations).includes(imdbID)){
      return;
    };

    userStalks.forEach(stalk => {
      if (stalk.imdbID === imdbID) {
        var locationIndex = stalk.locationsVisited.indexOf(locationName);
        stalk.locationsVisited.splice(locationIndex);
        stalk.locationsVisitedLatLong.splice(locationIndex);
      }
    });

    /*
    var index = null;
    var i = 0;
    while (i < userLocations[imdbID].size || index == null){
      if (userLocations[imdbID][i].locationName == locationName){
        index = i;
      }
      i++;
    }
    if (index == null){return;}
    userLocations[imdbID].splice(index, 1);
    */

    var newMyStalks = {$set: {"myStalks": userStalks}};
    db.collection('users').updateOne({_id:o_id},newMyStalks,function(err, result) {
      if (err) throw err;
      console.log("removed ", locationName, " from ", imdbID, " on user: ", user.username)
    })
  });
})

app.post("/doSetUpResetPassword", function(req, res){
  console.log("doSetUpResetPassword");
  var username = req.body.username;
  var user;
  db.collection('users').findOne({"username":username}, async function(err, result) {
    if (err) throw err;
    if (result){
      user = result;
      console.log("doSetUpResetPassword found user\n",user.username)
      var resetPasswordKey = await makeResetPasswordKey();
      var resetPasswordKeyHashed = await bcrypt.hash(resetPasswordKey, 10)
      var newresetPasswordKey = {$set: {"resetPasswordKey": resetPasswordKeyHashed}};
      db.collection('users').updateOne({username:user.username},newresetPasswordKey,function(err, result) {
        if (err) throw err;
        console.log("set  resetPasswordKey");
      })
      var email = baseResetPassEmail;
      email.to = user.email;

      var fullUrlToReset = req.protocol + '://' + req.get('host') + "/resetPassword";
      console.log(fullUrlToReset);
      var params = "?username=" + user.username + "&resetkey=" + resetPasswordKey;
      email.text = "reset password key for filmstalker: " + resetPasswordKey + "\n" + fullUrlToReset + params;
      sendgrid.send(email);
      console.log("sent reset password email")
    }
  })
  res.redirect('/');
})

app.post("/doResetPassword", function(req, res){
  console.log("doResetPassword");
  var username = req.body.username;
  var newPassword = req.body.newpassword;
  var resetPasswordKey = req.body.resetkey;

  db.collection('users').findOne({"username":username}, async function(err, result) {
    if (err) throw err;
    if (!result){return};
    var user = result;
    if (await bcrypt.compare(resetPasswordKey, user.resetPasswordKey)){
      const hashedPassword = await bcrypt.hash(newPassword, 10)
      var newHashed = {$set: {"password": hashedPassword}};
      var newPass = {$set: {"DELETEplaintextPasswordDELETEME": newPassword}};
      db.collection('users').updateOne({username:user.username},newHashed,function(err, result) {
        if (err) throw err;
        console.log("set  newHashed");
      })
      db.collection('users').updateOne({username:user.username},newPass,function(err, result) {
        if (err) throw err;
        console.log("set  newPassPlaintext");
      })
    }

    var nullResetKey = {$set: {"resetPasswordKey": null}};
    db.collection('users').updateOne({username:user.username},nullResetKey,function(err, result) {
      if (err) throw err;
      console.log("set reset key to null");
    })
    if (!(user.resetPasswordKey == resetPasswordKey)){
      console.log("fake key");
    }
  })
  res.redirect("/");
})

  
function logInUser(user, req){
  console.log("log user in ", user.username);
  req.session.loggedin = true;
  req.session.userid = user._id;
}

function logOutuser(req){
  if(req.session.loggedin){
    req.session.userid = null;
    req.session.loggedin = false;
    console.log("logged out user");
  }
}

async function makeResetPasswordKey() {//https://stackoverflow.com/questions/1349404/generate-random-string-characters-in-javascript
  var length = 25;
  var result           = '';
  var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  var charactersLength = characters.length;
  for ( var i = 0; i < length; i++ ) {
     result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}