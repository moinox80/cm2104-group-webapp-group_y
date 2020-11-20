var baseURL = "http://www.omdbapi.com/?apikey=7c3f362c&s=";

function getResultsFromOMDBByName(movieName){
    var url = baseURL + movieName;
    
    $.getJSON(url, function(jsondata){
        if(jsondata.Search){
            confirmMovie(jsondata.Search)
        };
    });
};

function getResultsFromOMDBByID(movieID){
    var url = baseURL + movieID;
    
    $.getJSON(url, function(jsondata){
        if(jsondata){
            makeMovie(jsondata);
        };
    });
};