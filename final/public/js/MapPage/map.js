
var mymap;
var userLocation;

function getUserLocation(){
    navigator.geolocation.getCurrentPosition(onUserLocationRecieved);
}

function onUserLocationRecieved(location){
    userLocation = [location.coords.latitude, location.coords.longitude];
}

$(document).ready(function(){
    getUserLocation();

    mymap = L.map('mapid').setView([0,0], 1);
    
    L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw', {
        maxZoom: 18,
        minZoom: 1,
        attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, ' +
        '<a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
        'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
        id: 'mapbox/streets-v11',
        tileSize: 512,
        zoomOffset: -1
    }).addTo(mymap);
    
    mymap.setMaxBounds([[180, -180], [-180, 180]]);//sets max bounds to top left and bottom right courners of common maps
    
    
    $(function(){
        $('#add-movie').submit(function(){
            if ($("#new-movie-input-by-imdb-number").val()){//add movie by imdb id
                var movieId = $("#new-movie-input-by-imdb-number").val();
                getResultsFromOMDBByID(movieId, makeMovie);
            }
            else if($("#new-movie-input-by-name").val()){//add movie by name
                var movieName = $("#new-movie-input-by-name").val();
                movieName = setStringForOMDBURLFormat(movieName);
                getResultsFromOMDBByName(movieName, selectMovieFromOptions);
            }
            return false;
        })
    })
    
    function setStringForOMDBURLFormat(string){//remove string from name to work with urls, ie. no spaces
        var words = string.split(" ");
        var newString = "";
        newString += words.shift();
        words.forEach(word => {
            newString += "%20" + word;
        });
        return newString;
    }
})

function addMovieIDsToUrl(link){
    var url = "../html/mystalks.html?"
    movies.forEach( movie => {
        movie.storeMovieInSession(movie);
        url += movie.imdbID + "stringifiedNEXT"
        movie.storeMovieInSession(movie)
    })
    $(link).attr("href", url);
}