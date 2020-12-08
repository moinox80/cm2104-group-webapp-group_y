/**
 * Opencage api
 * used to convert addresses to latitude and logitude
 * code is from https://opencagedata.com/tutorials/geocode-in-javascript and hardly edited
 */

const APIKey = "a71c9d2c16a84c71b64c3dda76245b2d";//kaveh's API Key
const APIkey2 = "2132037ffc084cda92aa80accb19238d";//also kavehs 
const APIkey3 = "b063cafd9f27445b99d129a7f90d9e5d";//also kavehs //bug caused infinite loop
const APIkey4 = "a71c9d2c16a84c71b64c3dda76245b2d"//also kavehs //bug caused infinite loop
const APIKey5 = "dd3bd144d5424c96a05c764fb4d3e46f"//Arthur

const api_url = 'https://api.opencagedata.com/geocode/v1/json'

//most of this code is copy pasted from https://opencagedata.com/tutorials/geocode-in-javascript
function openCageAPIConvertToLatLong(locationByName, callback, index = -1){
    var request_url = api_url
    + '?'
    + 'key=' + APIKey5
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

            if (index === -1) {
                callback([data.results[0].geometry.lat, data.results[0].geometry.lng]);
            } else {
                callback([data.results[0].geometry.lat, data.results[0].geometry.lng], index);
            }
            
            
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
