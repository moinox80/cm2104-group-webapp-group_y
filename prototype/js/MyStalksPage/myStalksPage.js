class Card {
    constructor(movieID) {
        this.imdbID = movieID;
        this.movieName;

        this.currentLocation;
        this.filmingLocations = [];
        this.distances = [];
        this.filmingLocationsJSON;

        this.$card;
        this.$locationList = [];
        this.addCardTemplate();

        getResultsFromOMDBByID(this.imdbID, function(movie) {
            this.movieName = movie.Title;

            this.$card.find(".movie-title").text(movie.Title);
            this.$card.find(".movie-facts").eq(0).html(`
                <li>Release year: ${movie.Year}</li>
                <li>Genres: ${movie.Genre}</li>
                <li>Rating: ${movie.Rated}</li>
            `);
            this.$card.find(".movie-facts").eq(1).html(`
                <li>Director: ${movie.Director}</li>
                <li>Writers: ${movie.Writer}</li>
                <li>Actors: ${movie.Actors}</li>
            `);

            this.addLocationsToCard();
        }.bind(this));
    }

    addCardTemplate() {
        var appendString =
        `<div class="card m-2 p-2 shadow-sm movie-box">
            <div class="card-header">
            <div class="row movie-info">
                <div class="col-lg-4">
                <h2 class="movie-title"></h2>
                </div>
                <div class="col-lg-4">
                <ul class="movie-facts">
                    <li>Release year: </li>
                    <li>Genres: </li>
                    <li>Rating: </li>
                </ul>
                </div>
                <div class="col-lg-4">
                <ul class="movie-facts">
                    <li>Director: </li>
                    <li>Writer: </li>
                    <li>Actors: </li>
                </ul>
                </div>
            </div>
            </div>

            <div class="card-body">
                <button data-toggle="collapse" data-target="#demo">
                    <h5>Locations</h5>
                </button>
                <div id="demo" class="collapse">
                    
                </div> 
            </div>
        </div>`
        

        this.$card = $(appendString).appendTo(".container");
    }

    addLocationsToCard() {
        this.currentLocation = navigator.geolocation.getCurrentPosition(function(position) {
            this.currentLocation = [position.coords.latitude, position.coords.longitude];
        }.bind(this));

        var apiKey = "a9eb244cd4msh1023a1ad25868ebp174b04jsn1fa8197ee780";
        var url = "https://imdb8.p.rapidapi.com/title/get-filming-locations?tconst=" + this.imdbID + "&rapidapi-key=" + apiKey;

        $.getJSON(url, function(data) {
            this.filmingLocationsJSON = data;
            this.filmingLocationsJSON.length = this.filmingLocationsJSON.locations.length;
            for (var i = 0; i < this.filmingLocationsJSON.locations.length; i++) {
                this.addLocationTemplate();

                var locationText = this.filmingLocationsJSON.locations[i].location;
                this.$locationList[i].find(".form-check-label").append(locationText);

                /*
                    While the following function was originally intended to take a FilmingLocation object as its third parameter,
                    it just so happens it has the right number of arguments for the purpose of ordering the filming locations in the array
                */


                openCageAPIConvertToLatLong(locationText, function(index, position){
                    this.filmingLocations[index] = position;
                    this.waitForCurrentLocation(index, position);
                }.bind(this), i);
            }
        }.bind(this));
    }

    addLocationTemplate() {
        this.$locationList.push($(`
            <div class="row">
                <div class="col-lg-8">
                    <label class="form-check-label">
                        <input type="checkbox" class="form-check-input" value="">
                    </label>
                </div>
                <div class="col-lg-2 proximity">
                    
                </div>
                <div class="col-lg-2">
                    See on map >
                </div>
            </div>
        `).appendTo(this.$card.find(".collapse")));
    }

    waitForCurrentLocation(index, position) {
        if (typeof this.currentLocation === "undefined") {
            setTimeout(function(){ this.waitForCurrentLocation(index, position) }.bind(this), 500)
            return;
        } else {
            this.distances[index] = this.getDistance(this.filmingLocations[index]);
            this.$locationList[index].find(".proximity").text(this.distances[index] + " miles");
        }
    }

    getDistance(filmingLocation) {
        const lon1 = this.currentLocation[0];
        const lat1 = this.currentLocation[1];
        const lon2 = filmingLocation[0];
        const lat2 = filmingLocation[1];

        //Code from https://www.movable-type.co.uk/scripts/latlong.html
        const R = 6371e3; // metres
        const φ1 = lat1 * Math.PI/180; // φ, λ in radians
        const φ2 = lat2 * Math.PI/180;
        const Δφ = (lat2-lat1) * Math.PI/180;
        const Δλ = (lon2-lon1) * Math.PI/180;

        const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
                Math.cos(φ1) * Math.cos(φ2) *
                Math.sin(Δλ/2) * Math.sin(Δλ/2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

        const d = R * c; // in metres
        
        var miles = this.metresToMiles(d);
        return Math.round(miles * 100) / 100;

        /*var xDistance = filmingLocation[0] - this.currentLocation[0];
        var yDistance = filmingLocation[1] - this.currentLocation[1];
        var fullDistance = Math.sqrt(Math.pow(xDistance,2) + Math.pow(yDistance,2));
        return fullDistance;*/
    }

    metresToMiles(metres) {
        return metres / 1609.344;
    }

}

$(function(){
    /*
    Note: This script can only display a select set of movies.
    The final product would store movies of interest for a user in a backend database.
    */
    new Card("tt0087332");
});