const e = require("express");

$('[type=checkbox]').change(function() {
  // $(this) should hopefully refer to the current checkbox
  let imdbID = $(this).attr('id');
  let locationByName = $(this).parent().text();
  if ($(this).is(':checked')) {
    sendMovieIdToServerRemoveFromMyStalks(imdbID, locationByName);
  } else {
    sendMovieIdToServerAddToMyStalks(imdbID, locationByName);
  }
});

function sendMovieIdToServerAddToMyStalks(imdbID, locationByName) {
  //https://stackoverflow.com/questions/59511205/how-to-send-string-from-client-to-server-via-post
  var url = '/addLocationToVisited';
  var body = 'imdbID' + imdbID + '&locationByName=' + locationByName;
  var xhr = new XMLHttpRequest();
  xhr.open('post', url, true);
  xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
  xhr.send(body);
}

function sendMovieIdToServerRemoveFromMyStalks(imdbID, locationByName) {
  //https://stackoverflow.com/questions/59511205/how-to-send-string-from-client-to-server-via-post
  var url = '/removeLocationFromVisited';
  var body = 'imdbID' + imdbID + '&locationByName=' + locationByName;
  var xhr = new XMLHttpRequest();
  xhr.open('post', url, true);
  xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
  xhr.send(body);
}