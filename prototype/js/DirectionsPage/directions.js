L.mapquest.key = 'AiGN2vsDdT5UAnLeJdree3Vk7xBg6yGd';

var mapQuestResponseFunctionsMap = {"0" : mapQuestSucces, "402" : locationNotFound, "602" : sixzerotwo};

//var start = '350 5th Ave, New York, NY 10118';
var end;
var start;
var userLocation;

window.onload = function(){
    makeMap();
    getUserLocation();
    end = getSearchParamFromUrl("destination");
}

function getSearchParamFromUrl(param){
    var url = window.location.href;
    url = new URL(url);
    return url.searchParams.get(param);
}

function getUserLocation(){
    navigator.geolocation.getCurrentPosition(onUserLocationRecieved);
}

function onUserLocationRecieved(location){
    userLocation = [location.coords.latitude, location.coords.longitude];
    //start = userLocation;
    start = "40.731855,-73.982775";
    getDirections(start, end);
}

function getDirections(start, end){
    console.log("dir to " + end + " from " + start );
    var directions = L.mapquest.directions();
    directions.route({
      start: start,
      end: end,
    }, directionsCallback);
}

function directionsCallback(error, response) {
    handleResponseStatus(response);
}

function mapQuestSucces(response){
    addUserInputToMap(start, end);
}

function sixzerotwo(response){
    console.log(602 + " status code");
}


function locationNotFound(){
    getNearestAirports(start, getDirectionsToAirport);
    //getNearestAirports(end, onCoordsForDestinationAirportFound);
}

function onCoordsForDestinationAirportFound(coords){
    var latLngInString = coords[0] + "," + coords[1];
    getDirections(latLngInString, end);
}

function getDirectionsToAirport(coords){
    var latLngInString = coords[0] + "," + coords[1];
    getDirections(start, latLngInString);
}

// function onAirportFound(isArrivalAirport, airport){
//     var aiportLatLng = airport.location;
//     if(!isArrivalAirport){
//         openCageAPIConvertLatLongToAddress(aiportLatLng, setUpDirectionFromAirport);
//     }
// }

// function setUpDirectionsToAirport(airportAddress){
//     getDirections(start, airportAddress);
// }

// function setUpDirectionFromAirport(airportAddress){
//     getDirections(airportAddress, end);
// }

function handleResponseStatus(response){
    if(response){
        var status = response.info.statuscode;
        console.log("map directions status: " + status);
        mapQuestResponseFunctionsMap[status](response);
    }
}
