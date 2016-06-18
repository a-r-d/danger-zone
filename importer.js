const app = require('./app');
const Incident = require('./app/models/incident');
const async = require('async');
const Converter = require("csvtojson").Converter;
const converter = new Converter({});


function importer(file) {
  converter.fromFile(file, function(err,result){
    //console.log(err, result);
    const incidents = [];
    result.forEach(function(res) {
      const crash = new Incident({
        raw: res,
        geometry: {
          coordinates: [res.X, res.Y]
        },
        state: 'IA',
        caseNumber: res.CASENUMBER,
        month: res.MNTH,
        day: res.DAYOFWEEK,
        timestr: res.TIMESTR,
        county: res.CNTY,
        city: res.CITYNAME,
        street: res.LITERAL,
        type: res.CSEV
      });
      incidents.push(crash);
    });

    //console.log(incidents);
    let i = 1;
    async.each(incidents, (incident, cb) => {
      incident.save((err) => {
        console.log('inserted: ', i);
        i++;
        return cb(err);
      });
    }, (err) => {
      if(err) console.error(err);
      console.log('done...');
    });
  });
}


importer('./data/Minor_Injury.csv');


