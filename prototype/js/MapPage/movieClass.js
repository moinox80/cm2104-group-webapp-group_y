var movies = [];

class Movie{
    constructor(movieDeatilsOMDB){
        this.OMDBData = movieDeatilsOMDB
        this.name = this.OMDBData.Title;
        this.imdbID = this.OMDBData.imdbID;
        this.year = this.OMDBData.Year;
        this.filmingLocations = [];
        getFilmingLocationsOf(this.setUpFilmingLocations, this.imdbID, this); //uses imdb which has max 500 call requests per month
        // this.testFakeAddress();// acts as getFilmingLocationsOf
        this.addSelfToSHowMovieCheckBox()
        this.visibleOnMap = true;
        movies.push(this);
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
        var labelID = this.imdbID + "Label";
        $("<input type='checkbox' id='" + checkboxID + "'checked='true' value = " + this + "> <label for='" + this.name + "Checkbox' id =" + labelID + " >" + this.name + " " + this.year + "</label>").appendTo($("#showMovieCheckBox"));
        $('#'+ checkboxID).change(function() {
            movie.changeVisibilityStateOnMap();
        })
    }

}

function removeMovie(movie){
    var movieIndex = movies.indexOf(movie) - 1;
    movies.splice(movieIndex);
    removeMovieFromMovieCheckBox(movie);
}

function removeMovieFromMovieCheckBox(movie){
    var checkboxID = movie.imdbID + "Checkbox";
    var labelID = movie.imdbID + "Label";
    $('#'+ checkboxID).remove();
    $('#'+ labelID).remove();
}


function makeMovie(movieDeatilsOMDB){
    if (!checkIfMovieExists(movieDeatilsOMDB.imdbID)){
        new Movie(movieDeatilsOMDB);
    }
    else{
        alert(movieDeatilsOMDB.Title + " already exists");
    }
}

function checkIfMovieExists(newMovieIMDBID){
    var found = false;
    movies.forEach(movie =>{
        if(movie.imdbID == newMovieIMDBID){
            found = true
        };
    });
    return found;
}
