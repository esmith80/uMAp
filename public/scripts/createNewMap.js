// Having an issue where the auto-complete City field and the map do not
// load together. Issue may be with order of scripts and could be fixed
// with  jQuery $( document ).ready

// this function creates a new marker (point) (do we need to return it?)

// while a user has not clicked 'save point' change the marker lat-lng to the most recently clicked area on the map
let markers = [];
let map;

const addMarker = (props) => {
  new google.maps.Marker({
    position: props.coords,
    map: map,
  });
};

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

      // event listener for user clicking on map
      map.addListener('click', function (event) {
        addMarker({ coords: event.latLng });

        const { lat, lng } = event.latLng;
        $('#point-latitude').attr('value', lat);
        $('#point-longitude').attr('value', lng);
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

$(document).ready(() => {
  // get all marker for single map

  const mapId = $('#point-form').data('mapid');
  $.get(`/api/pin/${mapId}`).then(({ pins }) => {
    for (const marker of pins) {
      const coords = {
        lat: Number(marker.latitude),
        lng: Number(marker.longitude),
      };
      addMarker({ coords });
    }
  });
});

// create map
$('.new-map').submit(function (event) {
  event.preventDefault();
  $('.title-error').remove();
  $('.description-error').remove();
  $('.city-error').remove();
  const titleText = $('#new-title-text').val();
  const descriptionText = $('#new-description-text').val();
  const cityText = $('#new-city-text').val();
  const categoryText = $('new-category-text').val();
  if (titleText === '') {
    return $('#new-title-container').append(
      $('<p>').addClass('title-error').text("Title can't be blank")
    );
  } else if (descriptionText === '') {
    return $('#new-description-container').append(
      $('<p>').addClass('description-error').text('Description is missing')
    );
  } else if (cityText === '') {
    return $('#new-city-container').append(
      $('<p>').addClass('city-error').text("City is can't be blank")
    );
  }
  const serializedData = $(this).serialize();
  $.post('/api/map/new', serializedData)
  .then(({mapID}) => {
    console.log('mapID', mapID);
    window.location.href = window.location.origin + '/api/map/' + mapID;
   });


});

// Create new pin
$('#point-form').submit(function (event) {
  event.preventDefault();
  $('.pin-title-error').remove();
  $('.pin-desc-error').remove();
  $('.pin-lat-long-error').remove();
  const pinTitleText = $('#point-title').val();
  const pinDescText = $('#point-description').val();
  const pinLatText = $('#point-latitude').val();
  const pinLongText = $('#point-longitude').val();

  if (pinTitleText === '') {
    return $('#pin-title-container').append(
      $('<p>').addClass('pin-title-error').text("Title can't be blank")
    );
  } else if (pinDescText === '') {
    return $('#pin-description-container').append(
      $('<p>').addClass('pin-desc-error').text("Description can't be blank")
    );
  } else if (pinLatText === '' || pinLongText === '') {
    return $('#pin-description-container').append(
      $('<p>')
        .addClass('pin-lat-long-error')
        .text('Please select a point on map')
    );
  }
  const serializedData = $(this).serialize();
  const mapId = $('#point-form').data('mapid');
  $.post(`/api/pin/${mapId}`, serializedData)
  .then((response) => {
    console.log(response);
    $("#markers").append(`
    <li>
          <div>${this.title.value}</div>
          <div>${this.description.value}</div>
          <div>
            <button class="edit-point-control"
              data-pindata=${[response.id, mapId, this.latitude.value, this.longitude.value]}>Edit</button>
            <button class="delete-point-control" data-pinid=${response.id}>DELETE</button>
          </div>
        </li>
    `)
    listenForEditControl();
    })
    // .then(() => {
      // console.log(mapId);
      // window.location.href = window.location.origin + '/api/map/' + mapId;
    //  });
  $(this).children('input').val('');

});

// add  to favorite map
$('.toggle-fav').click(function () {
  const mapId = $('#point-form').data('mapid');
  $(this).children().toggleClass('far fa-star fas fa-star added');

  const added = $(this).children().hasClass('added');

  if (added) {
    $.post('/api/map/fav', { mapId });
  } else {
    $.post('/api/map/fav/delete', { mapId });
  }
});

// event listener for user clicking Edit Point
let editFormVisible = false;
function listenForEditControl() {

  $('.edit-point-control').on('click', function (event) {
    console.log('edit-point-control entered');
    //if this form is not showing, display it. If it is already showing for another point that was not submitted, keep showing it
    if (!editFormVisible) {
      $('#edit-point-form').slideDown('slow');
      editFormVisible = true;
    }
    // identify the point/pin that was clicked and put all data in pinid button
    let pinData = $(this).data('pindata').split(',');

    const [id, mapId, latitude, longitude] = pinData;
    //populate form with values from selected point to edit
    $('#edit-point-id').val(id);
    $('#edit-point-mapid').val(mapId);
    $('#edit-point-latitude').val(latitude);
    $('#edit-point-longitude').val(longitude);
  });
}

listenForEditControl();

// event listener for Submit Edit Point
$('#edit-form').submit(function (event) {
  event.preventDefault();
  $('#edit-form').slideUp('slow');
  const serializedData = $(this).serialize();
  // how are we getting map id and pin id

  const pinId = $('#edit-point-id').val();
  const mapId = $('#point-form').data('mapid');
  // needs to go to route for pinId, not mapId
  // document.getElementById("#edit-form").reset();
  $.post(`/api/pin/${mapId}/${pinId}`, serializedData)
  .then(() => {
    window.location.href = window.location.origin + '/api/map/' + mapId;
   });
});

$('.delete-point-control').on('click', function (event) {
  const mapId = $('#point-form').data('mapid');
  let pinId = $(this).data('pinid');
  $.post(`/api/pin/${pinId}/delete`)
  .then(() => {
    console.log(mapId);
    window.location.href = window.location.origin + '/api/map/' + mapId;
   });

  // .then( function (response) {
  // put code to delete pin from DOM THIS
    // $(`[data-pinid=${pinId}]`).closest('li').remove();
  // });

});

// toggle create marker form
$('.toggle-form').hide();
$('.add-marker').click(function () {
  $('.toggle-form').slideToggle(1000);
});
