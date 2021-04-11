const express = require('express');
const app = express();

const MongoClient = require('mongodb').MongoClient; //npm install mongodb@2.2.32 //mongo db is for the databse managment
const url = "mongodb://127.0.0.1:27017/filmStalker";//url to the databse
const ObjectId = require('mongodb').ObjectId;//used to get the object id from mongo

const bodyParser = require('body-parser');
const session = require('express-session');//used to store information in the session such as logged in and user id

const bcrypt = require('bcrypt');//used for password hashing and salting
var xssSanitizer = require("xss");//used to ensure no xss is in user input (email, name and postcode)
var emailValidator = require("email-validator");//used to ensure user email is correct

const port = 8080;

//send grid is used to send an email to the user, standard email is used to send the user a key that can be used to reset their passowrd if they forgot
// get a instance of sendgrid and set the API key
const sendgrid = require('@sendgrid/mail');//https://mailslurp.medium.com/sending-emails-in-javascript-3-ways-to-send-and-test-emails-with-nodejs-8f3e5c3d0964
sendgrid.setApiKey("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");// construct an email
var baseResetPassEmail = {
  to: null,
  from: 'filmstalkerrgu@gmail.com',
  subject: 'Get Passowrd FilmStalker',
  text: null,
};// send the email via sendgrid

var db; //initalize the database variable

MongoClient.connect(url, function(err, database) {//start the server
  if (err) throw err;
  db = database;//set database
  app.listen(port);//listen
  console.log('listening on: ', port);//log
});

app.use(session({ secret: 'example' }));//enables session storage

app.use(bodyParser.urlencoded({
  extended: true
}))

app.set('view engine', 'ejs');//use ejs

app.use(express.static('public'));//use public


app.get('/', (req, res) => {//render the index page
  res.render("pages/index");
});

app.get('/about', (req, res) => {//render the about page
  res.render("pages/about");
});

app.get('/account', (req, res) => {//render the account page
  if(!req.session.loggedin){//redirect to the signup page if the user is not logged in
    res.redirect('signup');
    return;
  }

  var userid = req.session.userid;//get user id
  var o_id = new ObjectId(userid);//turn user id into mongo id
  db.collection('users').findOne({_id:o_id},function(err, user) {//find the user
    if (!user) return;//if there is an error return
    res.render("pages/account", {loggedIn:req.session.loggedin, email: user.email, username: user.username, postalCode: user.postcode});//send the acount page
  })
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
  res.render("pages/signup", {loggedIn:req.session.loggedin});
});

app.get("/resetPassword", (req, res) => {
  res.render("pages/resetPassword", {loggedIn:req.session.loggedin});
});

app.get('/logOut', (req, res) => {
  logOutuser(req);
  res.redirect('/');
})

app.post('/adduser', async function(req, res) {//add a user
  var uncryptedPassword = req.body.password;//gets the uncryptedPassword
  var email = req.body.email;//gets email
  var username = req.body.username;//gets username
  var postCode = req.body.postcode;//gets postcode

  if(!(emailValidator.validate(email))){//checks if user name is valide in guard clause. if not render the signup page with the error message
    res.render("pages/signup", {"falseEmail":true, loggedIn:req.session.loggedin});
    return;
  }

  if (!(email && username && postCode && uncryptedPassword)){//ensures all fields are inputed in guard clause. if not, render signup with error message
    res.render("pages/signup", {"incompleteFields":true, loggedIn:req.session.loggedin});
    return;
  }

  const hashedPassword = await bcrypt.hash(uncryptedPassword, 10)//https://www.npmjs.com/package/bcrypt //hash password
  var oldUserWithName = await db.collection('users').findOne({"username":username});// gets a user with the same name, if any

  var oldUserWithEmail = await db.collection('users').findOne({"email":email});// gets a user with the same email, if any

  if (oldUserWithName){//if another user has the same name, render with error message
    console.log("Username exists");
    res.render("pages/signup", {"usernameExists":true, loggedIn:req.session.loggedin});
    return;
  }

  if (oldUserWithEmail){//if user exists with same email. render with error message
    console.log("email exists");
    res.render("pages/signup", {"emailExists":true, loggedIn:req.session.loggedin});
    return;
  }

  if (await containsXSS([email, username, postCode])){//if email, username, postCode contain XSS render signup with warning
    console.log("XSS");
    res.render("pages/signup", {"xssFound":true, loggedIn:req.session.loggedin});
    return;
  }

  var new_user_info = {//gets the user info. xssSanitizer is probably unecesery
    "email" : xssSanitizer(email),
    "username" : xssSanitizer(username),
    "password" : hashedPassword,
    "DELETEplaintextPasswordDELETEME" : uncryptedPassword,//only user for testing. ie i am not saving fake user info in my password manager
    "postcode" : xssSanitizer(postCode),
    "myStalks" : [],
    "locationsVisited" : {},
    "resetPasswordKey" : null
  };

  console.log("user info:\n", new_user_info);//log the new user info for debuging

  db.collection('users').save(new_user_info, function(err, result) {//save the user to mongo
    if (err) throw err;
    console.log('added user ', new_user_info.username, " to database");
  });

  res.redirect('/map');//send user to map
});

app.post('/removeUser', function(req, res) {//remove a user from the databse
  if(!req.session.loggedin){return;}//guard clause for if user is not logged in
  
  var userid = req.session.userid;//get user id
  var o_id = new ObjectId(userid);//convert to object id
  db.collection('users').deleteOne({_id:o_id},function(err, result) {//delete
    if (err) throw err;
    if (result){
      console.log("deleted user: ", userid)
      logOutuser(req);//log out
    }
  })
  res.redirect('/');//send to index
})

app.post('/dologin', async function(req, res) {//to log in user
  var username = req.body.username;//gets the name
  var plainTextPassword = req.body.password;//gets the password
  if (!(username && plainTextPassword)){//guard clause to check if there is a password and user name, if not redirect with warning
    console.log("no password or username");
    res.render("pages/logIn", {loggedIn:req.session.loggedin, "wrongUsernameOrPass":true});
    return;
  }

  db.collection('users').findOne({"username":username},async function(err, user) {//find a user with name
    if (err) throw err;
    if (user){
      var isPasswordMatch = await bcrypt.compare(plainTextPassword, user.password);//do passwords match
      if (isPasswordMatch){
        logInUser(user, req)//log in
        res.redirect('/map');
        return;
      }
    }
    res.render("pages/logIn", {loggedIn:req.session.loggedin, "wrongUsernameOrPass":true});//if passwords dont match, complain
  })
});

app.post("/addMovieToMyStalks", function(req, res) {//used to save a movie to myStalks
  if(!req.session.loggedin){return;}//return if the user is not logged in
  if (!(req.body.movieId)){return;}//return if there is no movie id
  var userid = req.session.userid;
  var o_id = new ObjectId(userid);
  db.collection('users').findOne({_id:o_id},function(err, result) {//find user
    if (err) throw err;
    var user = result;
    var usersStalks = user.myStalks;//get old stalks
    var newMovieId = req.body.movieId;

    if(!newMovieId){return;}
    if(usersStalks.includes(newMovieId)){return};//if the new movie exist. (should be possible. but why not be sure)

    usersStalks.push(newMovieId);//add to list
    var newMyStalks = {$set: {"myStalks": usersStalks}};//mongo format
    db.collection('users').updateOne({_id:o_id},newMyStalks,function(err, result) {//save
      if (err) throw err;
    })
    console.log("added ", MovieId, "to myStalks on user: ", user.username);//log for testing
  })
})

app.post("/addLocationToVisited", function(req, res) {//add a location to the user databse
  if(!req.session.loggedin){return;}//return if they are not signed in

  var userid = req.session.userid;
  var o_id = new ObjectId(userid);
  db.collection('users').findOne({_id:o_id},function(err, result) {//find the usr
    if (err) throw err;
    if (!result){return;}

    //get location info
    var locationName = req.body.locationByName;
    var loactionLat = req.body.locationLat;
    var locationLong = req.body.locationLong;
    var location = [loactionLat, locationLong]
    var MovieId = req.body.movieId;

    var user = result;
    var userslocations = user.locationsVisited;
    if(!Object.keys(userslocations).includes(MovieId)){//if the user hasnt visited any locations of the movie, initialize a array
      userslocations[MovieId] = [];
    };

    var found = false;//check to see if it exists, should not be possible, but best to check
    userslocations[MovieId].forEach(location => {
      if (location.locationName == locationName){
        console.log("location exist");
        found = true;
      }
    });

    if (found){return;}//if it is found, return
    userslocations[MovieId].push({"locationName":locationName, "locationByLatLong":location});//add it to the array
    var newLocationsVisited = {$set: {"locationsVisited": userslocations}};//format to mongo 
    db.collection('users').updateOne({_id:o_id},newLocationsVisited,function(err, result) {//update
      if (err) throw err;
      console.log("added ", locationName, " from ", MovieId, " on user: ", user.username)//log for testing...... logs are very usefull
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
    var userslocations = user.locationsVisited;
    var MovieId = req.body.movieId;
    if(!Object.keys(userslocations).includes(MovieId)){
      return;
    };

    var index = null;
    var i = 0;
    while (i < userslocations[MovieId].size || index == null){
      if (userslocations[MovieId][i].locationName == locationName){
        index = i;
      }
      i++;
    }
    if (index == null){return;}
    userslocations[MovieId].splice(index, 1);
    var newLocationsVisited = {$set: {"locationsVisited": userslocations}};
    db.collection('users').updateOne({_id:o_id},newLocationsVisited,function(err, result) {
      if (err) throw err;
      console.log("removed ", locationName, " from ", MovieId, " on user: ", user.username)
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

app.post("/doResetPassword", async function(req, res){
  console.log("doResetPassword");
  var username = req.body.username;
  var newPassword = req.body.newpassword;
  var resetPasswordKey = req.body.resetkey;

  db.collection('users').findOne({"username":username}, async function(err, result) {
    if (err) throw err;
    if (!result){
      res.render("pages/resetPassword", {wrongUserName: true, loggedIn: req.session.loggedin});
      return;};
    var user = result;
    if (!user.resetPasswordKey){
      res.render("pages/resetPassword", {wasFakeKey: true, loggedIn: req.session.loggedin});
      return;
    }
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
      removeResetPasswordKey(user);
      res.redirect("/");
      return;
    }
    removeResetPasswordKey(user);
    
    if (!(user.resetPasswordKey == resetPasswordKey)){
      console.log("fake key");
      res.render("pages/resetPassword", {wasFakeKey: true, loggedIn: req.session.loggedin});
    }
  })
})

app.post("/updateUserInfo", async function(req, res){
  if(!req.session.loggedin){return;}

  var uncryptedPassword = req.body.password;

  var newEmail = req.body.email;
  var newUsername = req.body.username;
  var newPostCode = req.body.postcode;
  var newPass = req.body.newPassword;


  var userid = req.session.userid;
  var o_id = new ObjectId(userid);
  db.collection('users').findOne({_id:o_id}, async function(err, user) {
    if (!user) return;
    if (!uncryptedPassword){
      console.log("no pass")
      res.render("pages/account", {loggedIn:req.session.loggedin, email: user.email, username: user.username, postalCode: user.postcode, falsePass:true});
      return;
    }
    var isPasswordMatch = await bcrypt.compare(uncryptedPassword, user.password);
    if (!isPasswordMatch){
      console.log("no match")
      res.render("pages/account", {loggedIn:req.session.loggedin, email: user.email, username: user.username, postalCode: user.postcode, falsePass:true});
      return;
    }

    if (await containsXSS([newEmail, newUsername, newPostCode])){
      console.log("XSS");
      res.render("pages/account", {loggedIn:req.session.loggedin, email: user.email, username: user.username, postalCode: user.postcode, xssFound:true});
      return;
    }

    var oldUserWithName = await db.collection('users').findOne({"username":newUsername});

    var oldUserWithEmail = await db.collection('users').findOne({"email":newEmail});


    if (oldUserWithName && !(newUsername == user.username)){
      console.log("Username exists");
      res.render("pages/account",{loggedIn:req.session.loggedin, email: user.email, username: user.username, postalCode: user.postcode, usernameExists:true});
      return;
    }
  
    if (oldUserWithEmail && !(newEmail == user.email)){
      console.log("email exists");
      res.render("pages/account", {loggedIn:req.session.loggedin, email: user.email, username: user.username, postalCode: user.postcode, emailExists:true});
      return;
    }

    if( newEmail && !(emailValidator.validate(newEmail))){
      res.render("pages/account", {loggedIn:req.session.loggedin, email: user.email, username: user.username, postalCode: user.postcode, falseEmail:true});
      return;
    }

    var newUserInfo = {};

    if (newEmail){
      newUserInfo["email"] = newEmail;
    }

    if (newUsername){
      newUserInfo["username"] = newUsername;
    }

    if (newPostCode){
      newUserInfo["postcode"] = newPostCode;
    }

    if (newPass){
      var newPassMatchOld = await bcrypt.compare(newPass, user.password);
      console.log("match: ", newPassMatchOld)
      if (!newPassMatchOld){
        newHashed = await bcrypt.hash(newPass, 10);
        newUserInfo["password"] = newHashed;
        newUserInfo["DELETEplaintextPasswordDELETEME"] = newPass;
      }
    }

    var toUpdate = {$set: newUserInfo};
    
    db.collection('users').updateOne({_id:o_id},toUpdate,function(err, result) {
    if (err) throw err;
    console.log("updated user info");
    res.redirect("/map");
    return;
  })

  })
})


function removeResetPasswordKey(user){
  var nullResetKey = {$set: {"resetPasswordKey": null}};
  db.collection('users').updateOne({username:user.username},nullResetKey,function(err, result) {
    if (err) throw err;
    console.log("set reset key to null");
  })
}

  
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

async function containsXSS(list){
  var foundXSS = false;
  list.forEach(element => {
    if (element != xssSanitizer(element)){
      console.log("XSS in " + element);
      foundXSS = true;
    }
  })
  return foundXSS;
}