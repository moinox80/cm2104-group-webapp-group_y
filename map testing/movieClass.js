class Movie{
    constructor(name, imdbID){
        this.name = name;
        this.imdbID = imdbID;
        this.filmingLocations = [];
        getFilmingLocationsOf(this.setUpFilmingLocations, imdbID, this);
        //this.testFakeAddress();
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
                            "San Juan de Gaztelugatxe, Bermeo, Vizcaya, País Vasco, Spain"];
        this.setUpFilmingLocations(locationsByName)
    }
}
