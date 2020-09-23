
// this function creates a new marker (point) (do we need to return it?)
let markers = [];
const addNewPoint = (lat, lng) => {
  let marker = new google.maps.Marker({
    position: {
      lat: lat,
      lng: lng
    },
    map: map,
    title: 'marker title'
  });
  markers.push(marker);
}

// while a user has not clicked 'save point' change the marker lat-lng to the most recently clicked area on the map


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

      // event listener for user clicking Add Point
      $('#add-point-button').on('click', (event) => {
        console.log('add-point-button clicked');
        $('#point-form').css('display','block');
      });

      // Sets the map on all markers in the array
      function setMapOnAll(map) {
        for (let i = 0; i < markers.length; i++) {
          markers[i].setMap(map);
        }
      }

      function showMarkers() {
        setMapOnAll(map);
      }

      // event listener for user clicking on map
      map.addListener('click', function(mapsMouseEvent) {
        let coords = mapsMouseEvent.latLng.toString().split(",");
        let lat = coords[0].replace("(", "");
        let lng = coords[1].replace(")", "");
        lat = parseFloat(lat);
        lng = parseFloat(lng);
        setMapOnAll(null);
        let point = addNewPoint(lat, lng);


        // if the form latitude field is blank, we know this is the user's first time clicking on the map
        //if ($("#point-latitude").attr("value")) { $("#gmimap0").closest('div').remove(); }
          // let point = addNewPoint(lat, lng);
          // if the form latittude field is NOT blank, we need to erase the first marker and place a new one
        // } else {
          // point.position.lat = lat;
          // point.position.lng = lng;
        // }
        $("#point-latitude").attr("value", lat);
        $("#point-longitude").attr("value", lng);


        // if we begin workflow to add point from clicking on a map (instead "add point" button)
        // we need to add a new section <div> to create-new-map.html with form to fill in point data
        //$('#point_form')
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

  // $.ajax({
  //   type: "POST",
  //   url: url,
  //   data: data,
  //   success: success,
  //   dataType: dataType
  // });
  // var jqxhr = $.post( "example.php", function() {
// $('#new-point-form').on('submit', (event) => {
//   event.preventDefault();
//   //addNewPoint(lat, lon);
//   // $('#point-form').css('display','none');
//   const serializedData = $(this).serialize();
//   //$.post("/api/map/new", serializedData);


// });

$('.marker-list').on('click', (event) => {

  console.log('marker-list clicked');
  document.getElementById("testid").readOnly = false;

});

$("#point-form").submit( function (event) {
  event.preventDefault();
  $('#point-form').hide();
  let lat = $("#point-latitude").val();
  let lng = $("#point-longitude").val();
  let pointTitle = $("#point-title").val();
  let pointDescription = $("#point-description").val();
  let pointImgUrl = $("#point-image-url").val();
  lat = parseFloat(lat);
  lng = parseFloat(lng);

  const serializedData = $(this).serialize();
  document.getElementById("point-form").reset();

  let markerList = `

  <div class = "marker-list" >
    <form class = "marker-list-item">
       <input type="text" value="${pointTitle}" readonly id="testid">
    </form>
       <div class = "marker-item-bottom">
         <div class = "marker-description">
           <p>${pointDescription}</p>
         </div>
         <div class = "marker-image-url">
           <img src="${pointImgUrl}" width="100" height="100">
         </div>
         <br>
         lat = ${lat} and lng = ${lng}

  </div>

  `
  $('#saved-points').append(markerList);

  console.log('serializedData: ', serializedData);
  // $.post("/api/map/new", serializedData);
});


// need an autocomplete field that filters for cities
let autocomplete = new google.maps.places.Autocomplete(
    document.getElementById("city-autocomplete"));


