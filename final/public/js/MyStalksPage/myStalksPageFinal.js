//const e = require("express");

$(function() {
  $('[type=checkbox]').change(function() {
    // $(this) should hopefully refer to the current checkbox
    let imdbID = $(this).attr('class').split(' ')[1];
    let locationByName = $(this).parent().find('.locationText').text();
    console.log("A checkbox of movie " + imdbID + " and location " + locationByName + " was clicked");
    if ($(this).is(':checked')) {
      sendMovieIdToServerAddToMyStalks(imdbID, locationByName);
    } else {
      sendMovieIdToServerRemoveFromMyStalks(imdbID, locationByName);
    }
  });
});


function sendMovieIdToServerAddToMyStalks(imdbID, locationByName) {
  //https://stackoverflow.com/questions/59511205/how-to-send-string-from-client-to-server-via-post
  var url = '/addLocationToVisited';
  var body = 'imdbID=' + encodeURIComponent(imdbID) + '&locationByName=' + encodeURIComponent(locationByName);
  var xhr = new XMLHttpRequest();
  xhr.open('post', url, true);
  xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
  xhr.send(body);
}

function sendMovieIdToServerRemoveFromMyStalks(imdbID, locationByName) {
  //https://stackoverflow.com/questions/59511205/how-to-send-string-from-client-to-server-via-post
  var url = '/removeLocationFromVisited';
  var body = 'imdbID=' + imdbID + '&locationByName=' + locationByName;
  var xhr = new XMLHttpRequest();
  xhr.open('post', url, true);
  xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
  xhr.send(body);
}