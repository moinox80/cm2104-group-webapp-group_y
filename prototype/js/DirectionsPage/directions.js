L.mapquest.key = 'AiGN2vsDdT5UAnLeJdree3Vk7xBg6yGd';

var mapQuestResponseFunctionsMap = {"0" : mapQuestSucces, "402" : locationNotFound}

var start = '350 5th Ave, New York, NY 10118';
var end = 'New York, NY';
var userLocation = {};

window.onload = function(){
    getUserLocation();
    getDirections(start, end);
}

function getUserLocation(){
    navigator.geolocation.getCurrentPosition(onUserLocationRecieved)
}

function onUserLocationRecieved(location){
    userLocation["coordinates"] = [location.coords.latitude, location.coords.longitude];
    openCageAPIConvertLatLongToAddress(userLocation["coordinates"], setUsersAddress)
}

function setUsersAddress(openCageresponce){
    userLocation["address"] = openCageresponce.results[0].formatted;
    console.log(userLocation)
}

function addDirectionsToMap(response){
    var directionsLayer = L.mapquest.directionsLayer({
        directionsResponse: response
  }).addTo(map);
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

function mapQuestSucces(response){
    makeMap(start, end);
    addDirectionsToMap(response);
}

function locationNotFound(response){
    $("body").html("No driving route found")
}

function handleResponseStatus(response){
    var status = response.info.statuscode;
    console.log(status);
    mapQuestResponseFunctionsMap[status](response);
}
