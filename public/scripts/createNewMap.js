// Having an issue where the auto-complete City field and the map do not
// load together. Issue may be with order of scripts and could be fixed
// with  jQuery $( document ).ready

// this function creates a new marker (point) (do we need to return it?)
let markers = [];
const addNewPoint = (lat, lng) => {
  let marker = new google.maps.Marker({
    position: {
      lat: lat,
      lng: lng,
    },
    map: map,
    title: 'marker title',
  });
  markers.push(marker);
};

// while a user has not clicked 'save point' change the marker lat-lng to the most recently clicked area on the map

let map;

function initMap() {
  window.navigator.geolocation.getCurrentPosition(
    (geoLocPos) => {
      const { latitude, longitude } = geoLocPos.coords;

      // getCurrentPosition is successful
      map = new google.maps.Map(document.getElementById('map'), {
        center: {
          lat: latitude,
          lng: longitude,
        },
        zoom: 13,
      });

      // event listener for user clicking Add Point
      $('#add-point-button').on('click', (event) => {
        console.log('add-point-button clicked');
        $('#point-form').css('display', 'block');
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
      map.addListener('click', function (mapsMouseEvent) {
        let coords = mapsMouseEvent.latLng.toString().split(',');
        let lat = coords[0].replace('(', '');
        let lng = coords[1].replace(')', '');
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
        $('#point-latitude').attr('value', lat);
        $('#point-longitude').attr('value', lng);

        // if we begin workflow to add point from clicking on a map (instead "add point" button)
        // we need to add a new section <div> to create-new-map.html with form to fill in point data
        //$('#point_form')
      });
    },
    () => {
      // if getCurrentPosition is not successful (if user blocks location tracking)
      map = new google.maps.Map(document.getElementById('map'), {
        center: {
          lat: 0,
          lng: 0,
        },
        zoom: 1,
      });
    }
  );
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
  document.getElementById('testid').readOnly = false;
});

$('.new-map').submit(function (event) {
  event.preventDefault();
  const serializedData = $(this).serialize();
  $.post('/api/map/new', serializedData);
});

// Create new pin

$('#point-form').submit(function (event) {
  event.preventDefault();
  const serializedData = $(this).serialize();
  const mapId = $('#point-form').data('mapid');

  $.post(`/api/pin/${mapId}`, serializedData);
});

// add  to favorite map
$('.fav').click(() => {
  const mapId = $('#point-form').data('mapid');
  $.post('/api/map/fav', { mapId });
});

$('.remove-fav').click(() => {
  const mapId = $('#point-form').data('mapid');
  $.post('/api/map/fav/delete', { mapId });
});

$('.toggle-fav').click(function () {
  const mapId = $('#point-form').data('mapid');
  $(this).children().toggleClass('far fa-star  fas fa-star added');

  const added = $(this).children().hasClass('added');

  if (added) {
    $.post('/api/map/fav', { mapId });
  } else {
    $.post('/api/map/fav/delete', { mapId });
  }
});


// event listener for user clicking Edit Point
$('.edit-point-control').on('click', function (event) {

  //if this form is already showing for another point
  //keep showing it but update the data for the current point
  //or slide it up and down again with new data
  $('#edit-point-form').css('display', 'block');
  // populate form with info from that point
  $('#edit-point-title').val()
});

// event listener for user clicking Submit Edit Point
$('#edit-point-submit').on('submit', () => {
  $('#edit-point-form').css('display', 'none');
  document.getElementById("#edit-point-form").reset();
});



// need an autocomplete field that filters for cities
// this feature is not working right now due to async/timing of loading scripts
let autocomplete = new google.maps.places.Autocomplete(
    document.getElementById('city-autocomplete')
 )



