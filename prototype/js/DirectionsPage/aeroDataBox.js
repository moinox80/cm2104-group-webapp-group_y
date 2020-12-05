var baseurl = "https://aerodatabox.p.rapidapi.com/airports/search/location/LAT/LNG/km/200/16";

const SETTINGS = {
	"async": true,
	"crossDomain": true,
	"method": "GET",
	"headers": {
		"x-rapidapi-key": "2215b5754fmsh339dd4545346c2bp1d5792jsnc7ebe24b4e77",
		"x-rapidapi-host": "aerodatabox.p.rapidapi.com"
	}
};


/*
countryCode: "GB"
iata: "BQH"
icao: "EGKB"
location: Object { lat: 51.3308, lon: 0.032499 }
municipalityName: "London"
name: "London, London Biggin Hill"
shortName: "Biggin Hill"
*/

function getNearestAirports(latLng, callback){//max 100 requests per month
    if(confirmTouseAeroDataBox()){
        var settings = SETTINGS;
        settings["url"] = setUpUrl(latLng);
        $.ajax(settings).done(function (response) {
            console.log(response)
            var airportLatLng = [response.items[0].location.lat, response.items[0].location.lon];
            callback(airportLatLng);
        });
    }
}

function setUpUrl(latLng){
    var latLng = latLng.split(",");
    var url = baseurl;
    url = url.replace("LAT", latLng[0]);
    url = url.replace("LNG", latLng[1]);
    return url;
}

function confirmTouseAeroDataBox(){
    return(confirm("will use aeroDataBox, max 100 requests per month"));
}
