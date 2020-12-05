var baseurl = "https://aerodatabox.p.rapidapi.com/airports/search/location/LAT/LNG/km/100/16";

const SETTINGS = {
	"async": true,
	"crossDomain": true,
	"method": "GET",
	"headers": {
		"x-rapidapi-key": "2215b5754fmsh339dd4545346c2bp1d5792jsnc7ebe24b4e77",
		"x-rapidapi-host": "aerodatabox.p.rapidapi.com"
	}
};

function getNearestAirports(latLng){//max 100 requests per month
    if(confirmTouseAeroDataBox()){
        var settings = SETTINGS;
        settings["url"] = setUpUrl(latLng);
        $.ajax(settings).done(function (response) {
            callback(response.items[0]);
        });
    }
}

function setUpUrl(latLng){
    var url = baseurl;
    url = url.replace("LAT", latLng[0]);
    url = url.replace("LNG", latLng[1]);
    return url;
}

function confirmTouseAeroDataBox(){
    return(confirm("will use aeroDataBox, max 100 requests per month"));
}
