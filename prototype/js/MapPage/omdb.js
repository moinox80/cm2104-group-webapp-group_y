var baseURL = "http://www.omdbapi.com/?apikey=7c3f362c&";

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
        if(jsondata){
            makeMovie(jsondata);
        };
    });
};