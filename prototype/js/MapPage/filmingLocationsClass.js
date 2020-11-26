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
        filmingLocation.marker = new Marker(filmingLocation.location, filmingLocation.name, filmingLocation.movie, filmingLocation);
    }
}