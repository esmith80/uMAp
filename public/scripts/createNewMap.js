
// this function creates a new marker (point) (do we need to return it?)
const addNewMarker = (lat, lng) => {
  let marker = new google.maps.Marker({
    position: {
      lat: lat,
      lng: lng
    },
    map: map,
    title: 'marker title'
  });
}

let map;

function initMap() {
  window.navigator.geolocation
    .getCurrentPosition((geoLocPos) => {
      const {
        latitude,
        longitude
      } = geoLocPos.coords;

      // getCurrentPosition is successful
      map = new google.maps.Map(document.getElementById("map"), {
        center: {
          lat: latitude,
          lng: longitude
        },
        zoom: 13
      });

      map.addListener('click', function(mapsMouseEvent) {
        let coords = mapsMouseEvent.latLng.toString().split(",");
        console.log(coords);
        let lat = coords[0].replace("(", "");
        lat = parseFloat(lat);
        console.log(lat);
        let lon = parseFloat(coords[1]);
        console.log(lon);
        addNewMarker(lat, lon);
      });

    }, () => {
      // if getCurrentPosition is not successful (if user blocks location tracking)
      map = new google.maps.Map(document.getElementById("map"), {
        center: {
          lat: 0,
          lng: 0
        },
        zoom: 1
      });
    });
}

$('#new-point-form').on('submit', (event) => {
  event.preventDefault();
  let lat = $("input[name=point-latitude]").val();
  let lon = $("input[name=point-longitude]").val();
  lat = parseFloat(lat);
  lon = parseFloat(lon);
  addNewMarker(lat, lon);
});


// need an autocomplete field that filters for cities
let autocomplete = new google.maps.places.Autocomplete(
    document.getElementById("city-autocomplete"));


