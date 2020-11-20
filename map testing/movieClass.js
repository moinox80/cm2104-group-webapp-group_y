class Movie{
    constructor(movieDeatilsOMDB){
        this.OMDBData = movieDeatilsOMDB
        this.name = this.OMDBData.Title;
        this.imdbID = this.OMDBData.imdbID;
        this.filmingLocations = [];
        getFilmingLocationsOf(this.setUpFilmingLocations, this.imdbID, this); //uses imdb which has max 500 call requests per month
        // this.testFakeAddress();// acts as getFilmingLocationsOf
        this.addSelfToSHowMovieCheckBox()
        this.visibleOnMap = true;
    }
    
    setUpFilmingLocations(locationsByName, movie){
        locationsByName.forEach(locationByName => {
            new FilmingLocation(movie, locationByName);
        });
    }
    
    addAllMarkersToMap(){
        this.filmingLocations.forEach( location =>{
            location.marker.addToMap();
        })
        this.visibleOnMap = true;
    }
    
    removeAllMarkersFromMap(){
        this.filmingLocations.forEach( location =>{
            location.marker.removeFromMap()
        })
        this.visibleOnMap = false;
    }
    
    
    testFakeAddress(){// so i dont make too many imdb calls
        var locationsByName = ["Split, Split-Dalmatia County, Croatia",
        "Vrsno, Sibenik, Croatia",
        "Dubrovnik, Croatia",
        "Almodóvar del Río, Córdoba, Andalucía, Spain",
        "Los Angeles, California, USA",
        "San Juan de Gaztelugatxe, Bermeo, Vizcaya, País Vasco, Spain"];// basic copy paste of addreses returned by getFilmingLocationsOf
        this.setUpFilmingLocations(locationsByName, this);
    }

    changeVisibilityStateOnMap(){
        if(this.visibleOnMap){
            this.removeAllMarkersFromMap();
        }
        else{
            this.addAllMarkersToMap();
        }
    }
    
    addSelfToSHowMovieCheckBox(){
        var movie = this;
        var checkboxID = this.imdbID + "Checkbox";
        $("<input type='checkbox' id='" + checkboxID + "'checked='true' value = " + this + "> <label for='" + this.name + "Checkbox'>" + this.name + "</label>").appendTo($("#showMovieCheckBox"));
        $('#'+ checkboxID).change(function() {
            movie.changeVisibilityStateOnMap();
        })
    }

}


function makeMovie(movieDeatilsOMDB){
    new Movie(movieDeatilsOMDB);
}