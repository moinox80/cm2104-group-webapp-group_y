class Marker{
    constructor(position, label, movie){
        this.position = position;
        this.label = label;
        this.movie = movie;
        this.createMarker();
        this.addToMap();
    }

    createMarker(){
        this.marker = L.marker(this.position);
        this.marker.bindPopup(this.movie.name + "  " + this.movie.year + "<br><br>" + this.label);
    }

    addToMap(){
        this.marker.addTo(mymap);
    }

    removeFromMap(){
        this.marker.removeFrom(mymap);
    }
}