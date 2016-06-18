var express = require('express'),
  _ = require('lodash'),
  router = express.Router(),
  mongoose = require('mongoose'),
  Incident = mongoose.model('Incident');

module.exports = function (app) {
  app.use('/', router);
};

router.get('/', function (req, res, next) {
  res.render('index', {
    title: 'Generator-Express MVC',
  });
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

