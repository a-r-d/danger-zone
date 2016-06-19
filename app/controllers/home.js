var express = require('express'),
  _ = require('lodash'),
  router = express.Router(),
  mongoose = require('mongoose'),
  lineToPolygon = require('../lib/line-to-polygon'),
  Incident = mongoose.model('Incident');

module.exports = function (app) {
  app.use('/', router);
};

router.get('/', function (req, res, next) {
  res.redirect('/example-directions.html');
});

router.get('/nearby', function(req, res, next) {
  const { lat, lng, distance } = req.query;
  Incident.collection.find({
    "geometry.coordinates": {
      "$near": {
        "$geometry": {
          type: "Point",
          coordinates: [_.toNumber(lat), _.toNumber(lng)]
        },
        "$maxDistance": _.toNumber(distance) || 10000
      }
    }
  }).toArray((err, results) => {
    return res.json({
      error: err,
      results: results
    });
  });
});

router.post('/intersects-line', function(req, res, next) {
  const { points, distance } = req.body;
  const polygon = lineToPolygon(points, distance || .001);
  // Make sure to post JSON here so you get all numeric datatypes
  //console.log(polygon);
  Incident.collection.find({
    "geometry.coordinates": {
      "$geoWithin": {
        "$polygon": polygon
      }
    }
  }).toArray((err, results) => {
    return res.json({
      error: err,
      results: results
    });
  });
});
