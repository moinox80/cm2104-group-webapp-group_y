function getResultsFromOMDBByName(searcheItems){
    var url = "http://www.omdbapi.com/?apikey=7c3f362c&s=" + searcheItems;
    
    $.getJSON(url, function(jsondata){
        if(jsondata.Search){
            confirmMovie(jsondata.Search)
        }
    });
};

function getResultsFromOMDBByID(movieID){
    var url = "http://www.omdbapi.com/?apikey=7c3f362c&i=" + movieID;
    
    $.getJSON(url, function(jsondata){
        if(jsondata){
            makeMovie(jsondata)
        }
    })
}