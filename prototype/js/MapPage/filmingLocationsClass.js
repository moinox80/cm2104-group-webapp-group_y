/**
 * FilmLocationClass
 * the individual filming locations of each movie
 */
class FilmingLocation{
    constructor(movie, locationByName){
        this.movie = movie;
        this.location = openCageAPIConvertToLatLong(locationByName, this.setMarker, this);
        this.name = locationByName;
        this.visited = false;
        movie.filmingLocationsMarkers.push(this);
    }
    
    setMarker(filmingLocation, coordinates){
        filmingLocation.movie.setUpFilmingLocationByNameAndLatLong(filmingLocation.name, coordinates);
        filmingLocation.location = coordinates;        
        filmingLocation.marker = new Marker(filmingLocation.location, filmingLocation.name, filmingLocation.createIcon(filmingLocation), filmingLocation.movie, filmingLocation);
    }

    createIcon(filmingLocation){
        return L.icon({
            iconUrl: filmingLocation.movie.poster,
            iconSize:     [35, 50], // size of the icon
            iconAnchor:   [22, 40], // point of the icon which will correspond to marker's location
            popupAnchor:  [-3, -76] // point from which the popup should open relative to the iconAnchor
            })
    }
}