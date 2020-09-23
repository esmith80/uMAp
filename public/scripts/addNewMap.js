$('.submission_form').submit(function (event) {
  event.preventDefault();
  const serializedData = $(this).serialize();
  $.post('/api/map/new', serializedData);
});
