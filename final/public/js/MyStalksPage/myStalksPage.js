var movies = [];
class Card {
  constructor(movie) {
    console.log("Adding card for movie " + movie);

    this.imdbID = movie;

    this.currentLocation;
    this.filmingLocations = [];
    this.filmingLocationsJSON;

    this.$card = this.addCardTemplate();
    this.$locationList = [];

    getResultsFromOMDBByID(this.imdbID, function (moveRes) {
      this.movieName = movieRes.name;

      this.$card.find(".movie-title").text(this.movieName);
      this.$card.find(".movie-facts").eq(0).html(`
                <li>Release year: ${movieRes.year}</li>
                <li>Genres: ${moveRes.Genre}</li>
                <li>Rating: ${moveRes.Rated}</li>
            `);
      this.$card.find(".movie-facts").eq(1).html(`
                <li>Director: ${moveRes.Director}</li>
                <li>Writers: ${moveRes.Writer}</li>
                <li>Actors: ${moveRes.Actors}</li>
            `);

      this.addLocationsToCard();
    }.bind(this));
  }

  addCardTemplate() {
    var cardTemplate =
      `<div class="movie-box">
            <div class="card-header">
              <div class="row movie-info">
                <div>
                  <h2 class="movie-title"></h2>
                </div>
                <div>
                  <ul class="movie-facts">
                    <li>Release year: </li>
                    <li>Genres: </li>
                    <li>Rating: </li>
                  </ul>
                </div>
                <div>
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
          </div>`;

    return $(cardTemplate).appendTo(".container");
  }

  addLocationsToCard() {
    this.currentLocation = navigator.geolocation.getCurrentPosition(function (position) {
      this.currentLocation = [position.coords.latitude, position.coords.longitude];
    }.bind(this));

    var apiKey = "a9eb244cd4msh1023a1ad25868ebp174b04jsn1fa8197ee780";
    var url = "https://imdb8.p.rapidapi.com/title/get-filming-locations?tconst=" + this.imdbID + "&rapidapi-key=" + apiKey;

    $.getJSON(url, function (data) {
      this.filmingLocationsJSON = data;
      this.filmingLocationsJSON.length = this.filmingLocationsJSON.locations.length;
      this.filmingLocationsJSON.locations.forEach((locationIt, i) => {
        this.addLocationTemplate();

        var filmingLocation = this.filmingLocations[i];

        var locationText = locationIt.location;
        filmingLocation.$element.find(".form-check-label").append(locationText);
        filmingLocation.$element.find(".see-on-map").click(function () {
          sessionStorage.setItem("locationOfInterest", JSON.stringify(locationText));
        });

        openCageAPIConvertToLatLong(locationText, function (position) {
          filmingLocation.geoCoord = position;
          this.waitForCurrentLocation(filmingLocation);
        }.bind(this));
      })
    }.bind(this));
  }

  addLocationTemplate() {
    var locationTemplate =
      `<div>
            <div>
              <label class="form-check-label">
                <input type="checkbox" class="form-check-input" value="">
              </label>
            </div>
            <div class="proximity">
                
            </div>
            <div>
              <a class="see-on-map" href="../html/map.html?l=true">See on map</a>
            </div>
          </div>`;

    this.filmingLocations.push(
      {
        $element: $(locationTemplate).appendTo(this.$card.find(".collapse")),
        geoCoord: [0, 0]
      }
    );
  }

  waitForCurrentLocation(filmingLocation) {
    if (typeof this.currentLocation === "undefined") {
      setTimeout(function () {
        this.waitForCurrentLocation(filmingLocation)
      }.bind(this), 100);
      return;
    } else {
      var distance = this.getDistance(filmingLocation.geoCoord);
      filmingLocation.$element.find(".proximity").text(distance + " miles");
    }
  }

  getDistance(filmingLocation) {
    const lon1 = this.currentLocation[0];
    const lat1 = this.currentLocation[1];
    const lon2 = filmingLocation[0];
    const lat2 = filmingLocation[1];

    //Code from https://www.movable-type.co.uk/scripts/latlong.html
    //Converts distance between geographic coordinates into metres
    const R = 6371e3; // metres
    const φ1 = lat1 * Math.PI / 180; // φ, λ in radians
    const φ2 = lat2 * Math.PI / 180;
    const Δφ = (lat2 - lat1) * Math.PI / 180;
    const Δλ = (lon2 - lon1) * Math.PI / 180;

    const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
      Math.cos(φ1) * Math.cos(φ2) *
      Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    const d = R * c; // in metres

    var miles = this.metresToMiles(d);
    return Math.round(miles * 100) / 100;
  }

  metresToMiles(metres) {
    return metres / 1609.344;
  }

}

$(function () {
  //getMoviesFromSession();
  /*
  Note: This script can only display a select set of movies.
  The final product would store movies of interest for a user in a backend database.
  */
  movies.forEach(movie => {
    new Card(movie);
  })
});

function getMoviesFromSession() {
  //var queryString = window.location.search;
  //queryString = queryString.substring(1);
  //var movieStrings = queryString.split("NEXT");
  var keys = Object.keys(sessionStorage);
  keys.forEach(key => {
    movies.push(JSON.parse(sessionStorage.getItem(key)));
  });
  //movies.pop();
}
