var movies = [];

class Movie{
    constructor(movieDeatilsOMDB){
        this.OMDBData = movieDeatilsOMDB
        this.name = this.OMDBData.Title;
        this.imdbID = this.OMDBData.imdbID;
        this.year = this.OMDBData.Year;
        this.poster = this.OMDBData.Poster;
        this.filmingLocationsMarkers = [];
        this.filmingLocationsByNameAndLatLong = []
        getFilmingLocationsOf(this.setUpFilmingLocationsForTheFirstTime, this.imdbID, this); //uses imdb which has max 500 call requests per month
        // this.testFakeAddress();// acts as getFilmingLocationsOf
        this.visibleOnMap = true;
        movies.push(this);
    }
    
    setUpComplete(movie){
        movie.addSelfToSHowMovieCheckBox();
        movie.makeDeleteButton();
        movie.addSelfToMyMovies();
    }
    
    setUpFilmingLocationByNameAndLatLong(locationName, locationLatLong){
        this.filmingLocationsByNameAndLatLong.push([locationName, locationLatLong]);
    }


    setUpFilmingLocationsForTheFirstTime(locationsByName, movie){
        movie.setUpFilmingLocations(locationsByName, movie);
        setTimeout(function (){
            movie.setUpComplete(movie);
          }, 1000);
    }

    setUpFilmingLocations(locationsByName, movie){
        locationsByName.forEach(locationByName => {
            new FilmingLocation(movie, locationByName);
        });
    }
    
    addAllMarkersToMap(){
        this.filmingLocationsMarkers.forEach( location =>{
            location.marker.addToMap();
        })
        this.visibleOnMap = true;
    }
    
    removeAllMarkersFromMap(){
        this.filmingLocationsMarkers.forEach( location =>{
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
        this.setUpFilmingLocationsForTheFirstTime(locationsByName, this);
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
        var checkboxDivID = this.imdbID + "Div";
        this.makeCheckBox(checkboxDivID, checkboxID);
        $('#'+ checkboxID).change(function() {
            movie.changeVisibilityStateOnMap();
        });
    }
    
    makeCheckBox(checkboxDivID, checkboxID){
        $("<div id=" + checkboxDivID + "></div>").appendTo("#showMovieCheckBox");
        $("<input type='checkbox' id='" + checkboxID + "'checked='true' value = " + this + ">").appendTo("#" + checkboxDivID);
        $("<label for='" + this.name + "Checkbox'>" + this.name + " " + this.year + "</label>").appendTo("#" + checkboxDivID);
    }

    makeDeleteButton(){
        var movie = this;
        $("<button id='deleteMovie" + this.imdbID + "'>Delete</button>").appendTo("#" + this.imdbID + "Div");
        $('#deleteMovie' + this.imdbID).click(function(){
            removeMovie(movie);
        });
    }

    addSelfToMyMovies(){
        const getCircularReplacer = () => {//from https://docs.w3cub.com/javascript/errors/cyclic_object_value/
            const seen = new WeakSet();
            return (key, value) => {
              if (typeof value === "object" && value !== null) {
                if (seen.has(value)) {
                  return;
                }
                seen.add(value);
              }
              return value;
            };
          };

          sessionStorage.setItem(this.imdbID + "stringified", JSON.stringify(this ,getCircularReplacer()));
        $("<br> <a href='movie.html?" + this.imdbID + "stringified' id=" + this.imdbID + "myMoviesLink" + ">" + this.name + "-" + this.year + "</a>").appendTo("#myMovies")
    }
}


function removeMovie(movie){
    var movieIndex = movies.indexOf(movie);
    if(movieIndex != -1){
        movie.removeAllMarkersFromMap();
        if(movieIndex == 0){
            movies.shift();
        }
        else{
            movies.splice(movieIndex, movieIndex);
        }
        removeMovieFromMovieCheckBox(movie);
        removeMovieFromMyMoviesLinkSection(movie)
    }
}

function removeMovieFromMovieCheckBox(movie){
    var divID = movie.imdbID + "Div";
    $('#'+ divID).remove();
}

function removeMovieFromMyMoviesLinkSection(movie){
    var linkID = movie.imdbID + "myMoviesLink";
    $('#'+ linkID).remove();
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
            found = true;
        };
    });
    return found;
}
