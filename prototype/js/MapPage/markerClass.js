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
    
    creatMarkerPopUp(){
        var toggleVisitButton = "<button onclick=markerToggleVisistedButtonClicked(" + this.markerID + ")>toggle visited</button>";
        var movieNameAndYear = this.movie.name + "  " + this.movie.year;
        var visited = "Visited:" + this.parent.visited;
        
        this.marker.bindPopup(movieNameAndYear + "<br><br>" + this.label +  "<br><br>" + visited + toggleVisitButton);
    }
    
    
    addToMap(){
        this.marker.addTo(mymap);
    }
    
    removeFromMap(){
        this.marker.removeFrom(mymap);
    }
    
}

function makeMarkerID(){
    return ++numberOfMarkers;
}

function markerToggleVisistedButtonClicked(markerID){
    var marker = buttonMap[markerID];
    marker.parent.visited = !marker.parent.visited;
    marker.creatMarkerPopUp();

}
