var currentPossition;
const BASEGOOGLEDIRECTIONSURL = "https://maps.googleapis.com/maps/api/directions/json?";

navigator.geolocation.getCurrentPosition(setCurrentPosition);

function setCurrentPosition(possition){
    currentPossition = [possition.coords.latitude, possition.coords.longitude];
}

function getDirectioons(from, to){
    var url =  BASEGOOGLEDIRECTIONSURL + "origin=" + from + "destination=" + to;
    console.log(url)
    $.getJSON(url, onDirectionsCalculated)
}


function onDirectionsCalculated(something){
    console.log(something)
}