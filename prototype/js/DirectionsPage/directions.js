var currentPossition;

navigator.geolocation.getCurrentPosition(setCurrentPosition);

function setCurrentPosition(possition){
    currentPossition = [possition.coords.latitude, possition.coords.longitude];
}
