/**
 * gets directions to location
 * would use google api, but i didnt really want to submit my back details,
 * and this seemed to be the best alternative
 * 
 * Page gives directions to location by car. If the route is impossible,
 * it will gives directions from your current location to the nearest airport,
 * and from the nearest airpot of the location to the location.
 * Sometimes mapquest returns error, i believe this to be due to a mistake in their software, error states, 'Error: this.data.latLng is undefined'
*/

L.mapquest.key = 'AiGN2vsDdT5UAnLeJdree3Vk7xBg6yGd'; // kavehs mapguest api key

var mapQuestResponseFunctionsMap = {"0" : mapQuestSucces, "402" : locationNotFound, "602" : sixZeroTwoStatus};//used to map mapwuest response status with appropriate function

var startLocation;
var endLocation;
var userLocation;

window.onload = function(){//runs when page is loaded
    alertAboutPage();
    makeMap();
    getUserLocation();
    endLocation = getSearchParamFromUrl("destination");
}

function alertAboutPage(){
    var basicFuncOfPage = "Page gives directions to location by car. If the route is impossible,"
    basicFuncOfPage += " it will gives directions from your current location to the nearest airport,"
    basicFuncOfPage += "and from the nearest airpot of the location to the location."
    var possibleError = " Sometimes mapquest returns error, i believe this to be due to a mistake in their software, error states, 'Error: this.data.latLng is undefined'"
    alert(basicFuncOfPage + possibleError)
}

function getSearchParamFromUrl(param){//gets the param from the url
    var url = window.location.href;
    url = new URL(url);
    return url.searchParams.get(param);
}

function getUserLocation(){//gets the users current location
    navigator.geolocation.getCurrentPosition(onUserLocationRecieved);
}

function onUserLocationRecieved(location){//is run once the user has agreed to giving their location
    userLocation = [location.coords.latitude, location.coords.longitude];
    startLocation = userLocation;
    //startLocation = "40.731855,-73.982775"; // somewhere in New York
    getDirections(startLocation, endLocation);
}

function getDirections(startLocation, endLocation){//gets the directions from startLocation to endLocation
    //this is mainly to test if a car can travel to the location, 
    //as map page also calculates it later and adds it to the map

    //console.log("dir to " + endLocation + " from " + startLocation );
    var directions = L.mapquest.directions();
    directions.route({//creates the route
      start: startLocation,
      end: endLocation,
    }, directionsCallback);
}

function directionsCallback(error, response) {//call back directions creater
    handleResponseStatus(response);
}

function mapQuestSucces(response){//if map quest is succesfull in ploting
    addUserInputToMap(startLocation, endLocation);
}

function sixZeroTwoStatus(response){
    console.log(602 + " status code");
    console.log(response);
}

function locationNotFound(){// if a route is not found, get directions to and from the airports
    getNearestAirports(startLocation, getDirectionsToAirport);
    getNearestAirports(endLocation, onCoordsForDestinationAirportFound);
}

function onCoordsForDestinationAirportFound(coords){
    var latLngInString = coords[0] + "," + coords[1];
    getDirections(latLngInString, endLocation);
}

function getDirectionsToAirport(coords){
    var latLngInString = coords[0] + "," + coords[1];
    getDirections(startLocation, latLngInString);
}

// function onAirportFound(isArrivalAirport, airport){
//     var aiportLatLng = airport.location;
//     if(!isArrivalAirport){
//         openCageAPIConvertLatLongToAddress(aiportLatLng, setUpDirectionFromAirport);
//     }
// }

// function setUpDirectionsToAirport(airportAddress){
//     getDirections(startLocation, airportAddress);
// }

// function setUpDirectionFromAirport(airportAddress){
//     getDirections(airportAddress, endLocation);
// }

function handleResponseStatus(response){// handles the response of the mapquest route maker, and calls appropriate function
    if(response){
        var status = response.info.statuscode;
        //console.log("map directions status: " + status);
        mapQuestResponseFunctionsMap[status](response);
    }
}
