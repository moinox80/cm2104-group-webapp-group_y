L.mapquest.key = 'AiGN2vsDdT5UAnLeJdree3Vk7xBg6yGd';

var mapQuestResponseFunctionsMap = {"0" : mapQuestSucces, "402" : locationNotFound}

var start = '350 5th Ave, New York, NY 10118';
var end = 'New York, NY';
var map;
var userLocation;

window.onload = function(){
    getDirections(start, end);
}

function getUserLocation(){
    navigator.geolocation.getCurrentPosition(onUserLocationRecieved)
}

function onUserLocationRecieved(location){
    userLocation = location;
}

function getDirections(start, end){
    var directions = L.mapquest.directions();
    directions.route({
      start: start,
      end: end,
    }, directionsCallback);
}

function directionsCallback(error, response) {
    console.log(response)
    console.log("---------")
    console.log(error)

    handleResponseStatus(response)
}

function makeMap(){
    map = L.mapquest.map('map', {
      center: [0,0],
      layers: L.mapquest.tileLayer('map'),
      zoom: 7
    });
}

function addDirectionsToMap(response){
    var directionsLayer = L.mapquest.directionsLayer({
        directionsResponse: response
  }).addTo(map);
}

function mapQuestSucces(response){
    makeMap();
    addDirectionsToMap(response);
}

function locationNotFound(response){
    console.log("notfound")
}

function handleResponseStatus(response){
    var status = response.info.statuscode;
    console.log(status);
    mapQuestResponseFunctionsMap[status](response);
}
