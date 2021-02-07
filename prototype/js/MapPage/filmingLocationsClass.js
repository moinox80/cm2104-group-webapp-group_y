/**
 * FilmLocationClass
 * the individual filming locations of each movie
 */
class FilmingLocation {
    constructor(movie, locationByName) {
        this.movie = movie;
        this.location = openCageAPIConvertToLatLong(locationByName, this.setMarker.bind(this));
        this.name = locationByName;
        this.visited = false;
        movie.filmingLocationsMarkers.push(this);
    }

    setMarker(coordinates) {
        this.movie.setUpFilmingLocationByNameAndLatLong(this.name, coordinates);
        this.location = coordinates;
        this.marker = new Marker(this.location, this.name, this.createIcon(), this.movie, this);
    }

    createIcon() {
        return L.icon({
            iconUrl: this.movie.poster,
            iconSize: [35, 50], // size of the icon
            iconAnchor: [22, 40], // point of the icon which will correspond to marker's location
            popupAnchor: [-3, -76] // point from which the popup should open relative to the iconAnchor
        })
    }
}