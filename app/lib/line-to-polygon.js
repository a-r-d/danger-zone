const _ = require('lodash');

function angleBetween (p1, p2) {
  return Math.atan2(p2[1] - p1[1], p2[0] - p1[0]) * 180 / Math.PI;
};

function translatePoint(p, a, d) {
  var cx = p[0], cy = p[1];
  var x = cx + d, y = cy;

  var radians = (Math.PI / 180) * a ,
    cos = Math.cos(radians),
    sin = Math.sin(radians),
    nx = (cos * (x - cx)) - (sin * (y - cy)) + cx,
    ny = (sin * (x - cx)) + (cos * (y - cy)) + cy;

  return [nx, ny];
}

var lineStringToPolygon = function (lineString, distance) {
  distance = distance || 0.1; // 0.1 in lt lng is pretty large really.

  var vectorPoints = _(lineString).map(function(point, i, list){
    var r = { coords: point };
    if ( i !== list.length - 1 )
      r.direction = angleBetween(point, list[i+1]);
    return r;
  });

  var polygon = [];

  _(vectorPoints).each(function(vectorPoint, i, list){
    var angle;
    var d = distance;
    var v2 = vectorPoint.direction;

    if ( i === 0 ) {
      angle = v2 + 90;
    } else {
      var v1 = list[i-1].direction;
      if ( i == list.length - 1 ) {
        angle = v1 + 90;
      } else {
        angle = ( (v1 + 180) - v2 ) % 360 / 2 + v2;
        d = distance / Math.sin((Math.PI / 180) * Math.abs(angle - v2));
      }
    }
    var begin = translatePoint( vectorPoint.coords, angle, d );
    var end = translatePoint( vectorPoint.coords, angle - 180, d );

    // Insert at the middle of polygon array
    var middle = polygon.length / 2;
    polygon.splice(middle, 0, begin);
    polygon.splice(middle + 1, 0, end);
  });

  // Duplicate first element to duplicate the line
  // Not needed if defining a polygon, because it is
  // self-closing
  polygon.push(polygon[0]);
  return polygon;
};

module.exports = lineStringToPolygon;
