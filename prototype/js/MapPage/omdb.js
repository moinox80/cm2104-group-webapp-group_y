/**
 * omdb
 * gets movie information from omdb database
 */

var baseURL = "https://www.omdbapi.com/?apikey=7c3f362c&";//base url without movie id or name, kavehs api key

function getResultsFromOMDBByName(movieName){
    var url = baseURL + "s=" + movieName;
    
    $.getJSON(url, function(jsondata){
        if(jsondata.Search){
            selectMovieFromOptions(jsondata.Search)
        };
    });
};

function getResultsFromOMDBByID(movieID){
    var url = baseURL + "i=" + movieID;
    
    $.getJSON(url, function(jsondata){
        if(jsondata && jsondata.imdbID){
            makeMovie(jsondata);
        };
    });
};