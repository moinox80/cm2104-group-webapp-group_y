var mymap = L.map('mapid').setView([0,0], 1);

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
    $('#add_movie').submit(function(){
        if ($("#new_movie_input_by_imdb_number").val()){//add movie by imdb id
            var movie_id = $("#new_movie_input_by_imdb_number").val();
            getResultsFromOMDBByID(movie_id);
        }
        else if($("#new_movie_input_by_name").val()){//add movie by name
            var movie_name = $("#new_movie_input_by_name").val();
            movie_name = setStringForOMDBURLFormat(movie_name);
            getResultsFromOMDBByName(movie_name);
        }
        return false;
    })
})

function setStringForOMDBURLFormat(string){//remove string from name to work with urls, ie. no spaces
    var words = string.split(" ");
    var new_string = "";
    new_string += words.shift();
    words.forEach(word => {
        new_string += "%20" + word;
    });
    return new_string;
}
