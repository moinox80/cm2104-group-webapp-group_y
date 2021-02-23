/**
 * getFilmingLocations
 * returns a list of filming loctions from imdb
 * max 500 requests per month
 * 
 */
var imdb8Settings = {
    "async": true,
    "crossDomain": true,
    "url": "",
    "method": "GET",
    "headers": {
        "x-rapidapi-key": "2215b5754fmsh339dd4545346c2bp1d5792jsnc7ebe24b4e77",//kavehs key
        "x-rapidapi-host": "imdb8.p.rapidapi.com"
    }
};

var imdb8BaseURL = "https://rapidapi.p.rapidapi.com/title/get-filming-locations?tconst=";//base url without movie id


function getFilmingLocationsOf(callback, imdbID, movie){
    if(confirmUseOfIMDBWithUser()){//checks if user want to use fake locations or use imdb
        imdb8Settings["url"] = imdb8BaseURL + String(imdbID);//sets url with movie id
        $.ajax(imdb8Settings).done(function (response) {

            if(response && response.locations){
                locations = unpackLocationList(response);
                callback(locations);
            }
            else{
                alert("Film or Show has no filming locations");
                removeMovie(movie);
            }

        });
    }
    else{
        movie.testFakeAddress();// use previusly stored response to save imdb queries
    }
}

function unpackLocationList(rapidapiResponse){//returns the relavent information from the response
    locations = []
    rapidapiResponse.locations.forEach(location => {
        locations.push(location.location);
    });
    return locations;
}

function confirmUseOfIMDBWithUser(){
    return (confirm("will use imdb with 500 querries per months, press cancel to use testFakeAddress"));
}