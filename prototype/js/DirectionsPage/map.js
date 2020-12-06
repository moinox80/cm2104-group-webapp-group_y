/**
 * makes mapquest map for directions page
 * and adds route to map with ui
 */

var map;

function makeMap(){
  map = L.mapquest.map('map', {
    center: [0,0],
    layers: L.mapquest.tileLayer('map'),
    zoom: 7
  });
}


function addUserInputToMap(start, end){//code mostly copy pasted from mapquest
    L.mapquest.directionsControl({
        className: '',
        directions: {
          options: {
            timeOverage: 25,
            doReverseGeocode: false,
          }
        },
        directionsLayer: {
          startMarker: {
            title: 'Drag to change location',
            draggable: true,
            icon: 'marker-start',
            iconOptions: {
              size: 'sm'
            }
          },
          endMarker: {
            draggable: true,
            title: 'Drag to change location',
            icon: 'marker-end',
            iconOptions: {
              size: 'sm'
            }
          },
          viaMarker: {
            title: 'Drag to change route'
          },
          routeRibbon: {
            showTraffic: true
          },
          alternateRouteRibbon: {
            showTraffic: true
          },
          paddingTopLeft: [100, 20],
          paddingBottomRight: [180, 20],
        },
        startInput: {
          compactResults: true,
          disabled: false,
          location: start,
          placeholderText: start,
          geolocation: {
            enabled: true
          },
          clearTitle: 'Remove starting point'
        },
        endInput: {
          compactResults: true,
          disabled: false,
          location: end,
          placeholderText: end,
          geolocation: {
            enabled: true
          },
          clearTitle: 'Remove this destination'
        },
        addDestinationButton: {
          enabled: true,
          maxLocations: 10,
        },
        routeTypeButtons: {
          enabled: true,
        },
        reverseButton: {
          enabled: true,
        },
        optionsButton: {
          enabled: true,
        },
        routeSummary: {
          enabled: true,
          compactResults: false,
        },
        narrativeControl: {
          enabled: true,
          compactResults: false,
          interactive: true,
        }
        
    }).addTo(map);
}
