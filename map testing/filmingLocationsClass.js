class FilmingLocation{
    constructor(movie, locationByName){
        this.movie = movie;
        this.location = openCageAPIConvertToLatLong(locationByName, this.setCoordinates, this);
        this.name = locationByName;
    }
    
    setCoordinates(filmingLocation, coordinates){
        filmingLocation.location = coordinates;        
        filmingLocation.marker = new Marker(filmingLocation.location, filmingLocation.name, filmingLocation.movie)
    }
}