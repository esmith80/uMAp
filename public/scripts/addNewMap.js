let map;

function initMap() {
  window.navigator.geolocation
  .getCurrentPosition((geoLocPos) => {
    const { latitude, longitude } = geoLocPos.coords;

    // getCurrentPosition is successful
    map = new google.maps.Map(document.getElementById("map"), {
      center: { lat: latitude, lng: longitude },
      zoom: 16
    });

// an added commment by Ed
  }, () => {
    // if getCurrentPosition is not successful (if user blocks location tracking)
    map = new google.maps.Map(document.getElementById("map"), {
      center: { lat: 0, lng: 0 },
      zoom: 1
    });

  }


  );
}
