/**
 * MarkerClass
 * manages the mao markers for the filming locations
 */

var numberOfMarkers = 0;
var  buttonMap = {};

class Marker{
    constructor(position, label, movie, parent){
        this.markerID = makeMarkerID();
        buttonMap[this.markerID] = this;
        this.position = position;
        this.label = label;
        this.movie = movie;
        this.parent = parent;
        this.createMarker();
        this.addToMap();
    }
    
    createMarker(){
        this.marker = L.marker(this.position);
        this.creatMarkerPopUp();
    }
    
    creatMarkerPopUp(){//creates the text for the marker pop up
        var toggleVisitButton = "<button onclick=markerToggleVisistedButtonClicked(" + this.markerID + ")>toggle visited</button>";
        var movieNameAndYear = this.movie.name + "  " + this.movie.year;
        var visited = "Visited:" + this.parent.visited;
        var directionsLink = this.googleMapsLink()
        
        this.marker.bindPopup(movieNameAndYear + "<br><br>" + this.label +  "<br><br>" + visited + toggleVisitButton + "<br>" + directionsLink);
    }
    
    
    addToMap(){
        this.marker.addTo(mymap);
    }
    
    removeFromMap(){
        this.marker.removeFrom(mymap);
    }

    googleMapsLink(){
       return "<a href=https://www.google.com/maps/dir/?api=1&origin=" + userLocation + "&destination=" + this.position + ">Directions</a>";
    }
}

function makeMarkerID(){
    return ++numberOfMarkers;
}

function markerToggleVisistedButtonClicked(markerID){//when visited button is clicked, change visited status to the opposite of the current.
    var marker = buttonMap[markerID];
    marker.parent.visited = !marker.parent.visited;
    marker.creatMarkerPopUp();
}
