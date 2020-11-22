var imdb8Settings = {
    "async": true,
    "crossDomain": true,
    "url": "",
    "method": "GET",
    "headers": {
        "x-rapidapi-key": "2215b5754fmsh339dd4545346c2bp1d5792jsnc7ebe24b4e77",
        "x-rapidapi-host": "imdb8.p.rapidapi.com"
    }
};

var imdb8BaseURL = "https://rapidapi.p.rapidapi.com/title/get-filming-locations?tconst=";


function getFilmingLocationsOf(callback, imdbID, movie){
    if(confirmUseOfIMDBWithUser()){
        imdb8Settings["url"] = imdb8BaseURL + String(imdbID);
        $.ajax(imdb8Settings).done(function (response) {
            locations = unpackLocationList(response);
            callback(locations, movie);
        });
    }
    else{
        movie.testFakeAddress();
    }
    
}

function unpackLocationList(rapidapiResponse){
    locations = []
    rapidapiResponse.locations.forEach(location => {
        locations.push(location.location);
    });
    return locations;
}

function confirmUseOfIMDBWithUser(){
    return (confirm("will use imdb with 500 querries per months, press cancel to use testFakeAddress"));
}