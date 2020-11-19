class Movie{
    constructor(movieDeatilsOMDB){
        this.OMDBData = movieDeatilsOMDB
        this.name =this.OMDBData.Title;
        this.imdbID = this.OMDBData.imdbID;
        this.filmingLocations = [];
        // getFilmingLocationsOf(this.setUpFilmingLocations, this.imdbID, this); //uses imdb which has max 500 call requests per month
        this.testFakeAddress();// acts as getFilmingLocationsOf
    }

    setUpFilmingLocations(locationsByName, movie){
        locationsByName.forEach(locationByName => {
            movie.filmingLocations.push(new FilmingLocation(movie, locationByName));
        });
    }

    addAllMarkersFromMap(){
        for(let i = 0; i < filmingLocations.length; i++){
            filmingLocations[i].addToMap()
        }
    }

    removeAllMarkersFromMap(){
        for(let i = 0; i < filmingLocations.length; i++){
            filmingLocations[i].removeFromMap()
        }
    }


    testFakeAddress(){// so i dont make too many imdb calls
        var locationsByName = ["Split, Split-Dalmatia County, Croatia",
                            "Vrsno, Sibenik, Croatia",
                            "Dubrovnik, Croatia",
                            "Almodóvar del Río, Córdoba, Andalucía, Spain",
                            "Los Angeles, California, USA",
                            "San Juan de Gaztelugatxe, Bermeo, Vizcaya, País Vasco, Spain"];// basic copy paste of addreses returned by getFilmingLocationsOf
        this.setUpFilmingLocations(locationsByName, this)
    }
}

function makeMovie(movieDeatilsOMDB){
    new Movie(movieDeatilsOMDB);
}