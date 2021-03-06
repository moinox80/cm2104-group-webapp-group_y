/**
 * movieClass
 * main class for all movies and shows
 * manages creation of all subclasses
 */
var movies = [];

class Movie {
    constructor(movieDeatilsOMDB, alreadyStalking, locationsSeenFromServer = null) {
        this.OMDBData = movieDeatilsOMDB;
        this.name = this.OMDBData.Title;
        this.imdbID = this.OMDBData.imdbID;
        this.year = this.OMDBData.Year;
        this.poster = this.OMDBData.Poster;
        this.filmingLocationsMarkers = [];
        this.filmingLocationsByNameAndLatLong = [];
        this.stalking = alreadyStalking;
        this.locationsSeenFromServer = locationsSeenFromServer;
        getFilmingLocationsOf(this.setUpFilmingLocationsForTheFirstTime.bind(this), this.imdbID, this); //uses imdb which has max 500 call requests per month
        // this.testFakeAddress();// acts as getFilmingLocationsOf
        this.visibleOnMap = true;
        movies.push(this);
    }

    setUpComplete() {//when the set up is complete, add ui
        this.addSelfToShowMovieCheckBox();
        this.makeDeleteButton();
        this.addSelfToMyMovies();
    }

    setUpFilmingLocationByNameAndLatLong(locationName, locationLatLong) {
        this.filmingLocationsByNameAndLatLong.push([locationName, locationLatLong]);
    }


    setUpFilmingLocationsForTheFirstTime(locationsByName) {
        this.setUpFilmingLocations(locationsByName);
        setTimeout(function () {
            this.setUpComplete();
        }.bind(this), 1000);
    }

    setUpFilmingLocations(locationsByName) {
        locationsByName.forEach(locationByName => {
            var seen = false;
            if (!(typeof this.locationsSeenFromServer == 'undefined' || this.locationsSeenFromServer == null || this.locationsSeenFromServer.length == 0)){
                seen = this.locationsSeenFromServer.includes(locationByName)
            }
            new FilmingLocation(this, locationByName, seen);
        });
    }

    addAllMarkersToMap() {
        this.filmingLocationsMarkers.forEach(location => {
            location.marker.addToMap();
        })
        this.visibleOnMap = true;
    }

    removeAllMarkersFromMap() {
        this.filmingLocationsMarkers.forEach(location => {
            location.marker.removeFromMap();
        })
        this.visibleOnMap = false;
    }


    testFakeAddress() {// so i dont make too many imdb calls
        var locationsByName = ["Split, Split-Dalmatia County, Croatia",
            "Vrsno, Sibenik, Croatia",
            "Dubrovnik, Croatia",
            "Almod??var del R??o, C??rdoba, Andaluc??a, Spain",
            "Los Angeles, California, USA",
            "San Juan de Gaztelugatxe, Bermeo, Vizcaya, Pa??s Vasco, Spain"];// basic copy paste of addreses returned by getFilmingLocationsOf
        this.setUpFilmingLocationsForTheFirstTime(locationsByName, this);
    }

    changeVisibilityStateOnMap() {
        if (this.visibleOnMap) {
            this.removeAllMarkersFromMap();
        }
        else {
            this.addAllMarkersToMap();
        }
    }

    addSelfToShowMovieCheckBox() {
        var checkboxID = this.imdbID + "-checkbox";
        var checkboxDivID = this.imdbID + "-div";
        this.makeCheckBox(checkboxDivID, checkboxID);
        $('#' + checkboxID).change(function () {
            this.changeVisibilityStateOnMap();
        }.bind(this));
    }

    makeCheckBox(checkboxDivID, checkboxID) {
        $("<div id=" + checkboxDivID + "></div>").appendTo("#show-movie-checkbox");
        $("<input type='checkbox'  id='" + checkboxID + "'checked='true' value = " + this + ">").appendTo("#" + checkboxDivID);
        $("<label  for='" + this.name + "Checkbox'>" + this.name + " " + this.year + "</label>").appendTo("#" + checkboxDivID);
    }

    makeDeleteButton() {
        $("<button id='delete-movie-" + this.imdbID + "'>Delete</button>").appendTo("#" + this.imdbID + "Div");
        $('#delete-movie-' + this.imdbID).click(function () {
            removeMovie(this);
        }.bind(this));
    }

    addSelfToMyMovies() {
        $("#my-movies").css("display","block");

        var url = "href=movie.html?m=" + this.imdbID + "," //containes movie stored in session
        var id = "id=" + this.imdbID + "-my-movies-link";
        var text = this.name + "-" + this.year;

        this.$movieTemplate = $(`
            <div class="row mt-2">
                <div class="col-md-3 d-flex align-items-center">
                    <h5>${this.name}</h5>
                </div>
                <div class="col-md-9 d-flex align-items-center">
                    <label class="form-check-label mr-3">
                        <input type="checkbox" class="form-check-input" value="" checked>Visible
                    </label>
                    <button type="button" class="mystalksbutton">Add to MyStalks</button>
                </div>
            </div>
        `).appendTo("#my-movies");

        this.$movieTemplate.find(".form-check-input").click(this.changeVisibilityStateOnMap.bind(this));
        this.$movieTemplate.find(".mystalksbutton").click(this.toggleMyStalks.bind(this));
        if (this.stalking){
            this.$movieTemplate.find(".mystalksbutton").text("Remove from my stalks")
        }
    }

    toggleMyStalks(){
        if (this.stalking){
            this.$movieTemplate.find(".mystalksbutton").text("Add to myStalks");
            this.sendMovieIdToServerRemoveFromMyStalks();
            this.stalking = false;
        }
        else{
            this.storeMovieInSession();
            this.sendMovieIdToServerAddToMyStalks();
            this.$movieTemplate.find(".mystalksbutton").text("Remove from my stalks")
            this.stalking = true;
        }
    }
    
    storeMovieInSession() {//store movie in session
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
        sessionStorage.setItem(this.imdbID, JSON.stringify(this, getCircularReplacer()));
    }
    
    sendMovieIdToServerAddToMyStalks(){
        function requestUtils(method, url, body) {//https://stackoverflow.com/questions/59511205/how-to-send-string-from-client-to-server-via-post
            var xhr = new XMLHttpRequest();
            xhr.open(method, url, true);
            xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
            xhr.send(body);
        }
        var body = 'movieId=' + this.imdbID;
        var visitedLocations = []
        
        for (var filmingLocation of this.filmingLocationsMarkers){
            if (filmingLocation.visited){
                visitedLocations.push(filmingLocation.name + "//")
            }
        }

        body += "&locationsVisited=" + visitedLocations;

        requestUtils('post', '/addMovieToMyStalks', body);
    }

    sendMovieIdToServerRemoveFromMyStalks(){
        function requestUtils(method, url, body) {//https://stackoverflow.com/questions/59511205/how-to-send-string-from-client-to-server-via-post
            console.log(body);
            var xhr = new XMLHttpRequest();
            xhr.open(method, url, true);
            xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
            xhr.send(body);
        }
        
        var body = 'movieId=' + this.imdbID; 

        requestUtils('post', '/removeMovieFromMyStalks', body);
    }
}


function removeMovie(movie) {
    var movieIndex = movies.indexOf(movie);
    if (movieIndex != -1) {
        movie.removeAllMarkersFromMap();
        if (movieIndex == 0) {
            movies.shift();
        }
        else {
            movies.splice(movieIndex, movieIndex);
        }
        removeMovieFromMovieCheckBox(movie);
        removeMovieFromMyMoviesLinkSection(movie);
    }
}

function removeMovieFromMovieCheckBox(movie) {
    var divID = movie.imdbID + "-div";
    $('#' + divID).remove();
}

function removeMovieFromMyMoviesLinkSection(movie) {
    var linkID = movie.imdbID + "-my-movies-link";
    $('#' + linkID).remove();
}


function makeMovie(movieDeatilsOMDB, alreadyStalking = false, locationsSeen = []) {
    if (!checkIfMovieExists(movieDeatilsOMDB.imdbID)) {
        new Movie(movieDeatilsOMDB, alreadyStalking, locationsSeen);
    }
    else {
        alert(movieDeatilsOMDB.Title + " already exists");
    }
}

function checkIfMovieExists(newMovieIMDBID) {
    var found = false;
    movies.forEach(movie => {
        if (movie.imdbID == newMovieIMDBID) {
            found = true;
        };
    });
    return found;
}
