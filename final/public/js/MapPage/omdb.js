/**
 * omdb
 * gets movie information from omdb database
 */

var baseURL = "https://www.omdbapi.com/?apikey=7c3f362c&";//base url without movie id or name, kavehs api key

function getResultsFromOMDBByName(movieName, callback){
    var url = baseURL + "s=" + movieName;
    
    $.getJSON(url, function(jsondata){
        if(jsondata.Search){
            callback(jsondata.Search)
        };
    });
};

function getResultsFromOMDBByID(movieID, callback, alreadyStalking = false, locationsSeen = null){
    var url = baseURL + "i=" + movieID;
    
    $.getJSON(url, function(jsondata){
        if(jsondata && jsondata.imdbID){
            callback(jsondata, alreadyStalking, locationsSeen);
        };
    });
};