/**
 * Opencage api
 * used to convert latitude and logitudevto addresses
 * code is from https://opencagedata.com/tutorials/geocode-in-javascript and hardly edited
 */

const APIKey = "5021b9e2912f454494eee897238f672a";//kaveh's API Key
const api_url = 'https://api.opencagedata.com/geocode/v1/json'

//most of this code is copy pasted from https://opencagedata.com/tutorials/geocode-in-javascript
function openCageAPIConvertLatLongToAddress(locationLatLng, callback){
    var request_url = api_url
    + '?'
    + 'key=' + APIKey
    + '&q=' + encodeURIComponent(locationLatLng)
    + '&pretty=1';

    // see full list of required and optional parameters:
    // https://opencagedata.com/api#forward
    
    var request = new XMLHttpRequest();
    request.open('GET', request_url, true);
    
    request.onload = function() {
        // see full list of possible response codes:
        // https://opencagedata.com/api#codes
        
        if (request.status == 200){ 
            // Success!
            var data = JSON.parse(request.responseText);
            
            callback(data)
        
        }
        else if (request.status <= 500){ 
            // We reached our target server, but it returned an error
                                
            console.log("unable to geocode! Response code: " + request.status);
            var data = JSON.parse(request.responseText);
            console.log(data.status.message);
        }
        else {
            console.log("server error");
        }
    };
    
    request.onerror = function() {
        // There was a connection error of some sort
        console.log("unable to connect to server");        
    };

    request.send();  // make the request
}

function openCageAPIConvertToLatLong(locationByName, callback, location){
    var request_url = api_url
    + '?'
    + 'key=' + APIKey
    + '&q=' + encodeURIComponent(locationByName)
    + '&pretty=1';

    // see full list of required and optional parameters:
    // https://opencagedata.com/api#forward
    
    var request = new XMLHttpRequest();
    request.open('GET', request_url, true);
    
    request.onload = function() {
        // see full list of possible response codes:
        // https://opencagedata.com/api#codes
        
        if (request.status == 200){ 
            // Success!
            var data = JSON.parse(request.responseText);
            
            callback(location, [data.results[0].geometry.lat, data.results[0].geometry.lng])
        
        }
        else if (request.status <= 500){ 
            // We reached our target server, but it returned an error
                                
            console.log("unable to geocode! Response code: " + request.status);
            var data = JSON.parse(request.responseText);
            console.log(data.status.message);
        }
        else {
            console.log("server error");
        }
    };
    
    request.onerror = function() {
        // There was a connection error of some sort
        console.log("unable to connect to server");        
    };

    request.send();  // make the request
}
