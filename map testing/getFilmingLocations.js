function getFilmingLocationsOf(callback, imdbID, movie){
    const settings = {
        "async": true,
        "crossDomain": true,
        "url": "https://rapidapi.p.rapidapi.com/title/get-filming-locations?tconst=" + imdbID,
        "method": "GET",
        "headers": {
            "x-rapidapi-key": "2215b5754fmsh339dd4545346c2bp1d5792jsnc7ebe24b4e77",
            "x-rapidapi-host": "imdb8.p.rapidapi.com"
        }
    };
    
    $.ajax(settings).done(function (response) {
        
        locations = unpackLocationList(response);
        callback(locations, movie);
    });
}

function unpackLocationList(rapidapiResponse){
    locations = []
    rapidapiResponse.locations.forEach(location => {
        locations.push(location.location)
    });

    locations.forEach(location => {
        console.log(location)
    });

    return locations
}