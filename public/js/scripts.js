var submitDirectionsCall = function() {

  //grabs start and end city from the input field and concats the strings with spaces
  var startCity = parseOutSpacesReplaceWithPlus($("#startCity").val())
  var endCity = parseOutSpacesReplaceWithPlus($("#endCity").val());

  //build url because jquery sucks
  var urlForGet = "https://maps.googleapis.com/maps/api/directions/json?origin=" + startCity + ",IA&destination=" + endCity + ",IA&key=AIzaSyB3ICm7VHE5GlI68GLti1BYWCehHIEiFgU"

  $.get(urlForGet, function(result){

      // result.routes[0].legs[0].steps.forEach(function(p) {
      //   console.log('start ' + p.start_location.lat, p.start_location.lng)
      //   console.log('end ' + p.end_location.lat, p.end_location.lng)
      //
      // });

      sendRoute(result.routes[0].legs[0].steps);



    })
}

//used to parse out spaces (cryptic method name)
var parseOutSpacesReplaceWithPlus = function(input){
  return input.split(' ').join('+')
}

var sendRoute = function(routeSteps){

  var routeCoordinates = [];

  routeSteps.forEach(function(step){
    routeCoordinates.push([step.start_location.lng, step.start_location.lat])
    routeCoordinates.push([step.end_location.lng, step.end_location.lat])
  })

  var temp = {
    "points": routeCoordinates
  }

  $.ajax({
      url: "/intersects-line",
      data: JSON.stringify(temp),
      dataType: 'json',
      contentType: "application/json",
      type: 'POST'
    }).done(function(response){
      console.log(response)
    })

}
