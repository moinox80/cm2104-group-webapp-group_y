/**
 * omdb
 * gets movie information from omdb database
 */

var baseURL = "http://www.omdbapi.com/?apikey=7c3f362c&";//base url without movie id or name, kavehs api key

function getResultsFromOMDBByName(movieName, callback){
    var url = baseURL + "s=" + movieName;
    
    $.getJSON(url, function(jsondata){
        if(jsondata.Search){
            callback(jsondata.Search)
        };
    });
};

function getResultsFromOMDBByID(movieID, callback){
    var url = baseURL + "i=" + movieID;
    
    $.getJSON(url, function(jsondata){
        if(jsondata){
            callback(jsondata);
        }
    });
};