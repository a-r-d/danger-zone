var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

var Incident = new Schema({
  geometry: {
    coordinates: { type: [Number], index: '2dsphere'}
  },
  caseNumber: {type: String, unique: true}, 
  month: String,
  day: String,
  tmstr: String,
  district: String,
  county: String,
  city: String,
  state: String,
  street: String,
  year: String,
  type: String,
  raw: Schema.Types.Mixed
});

module.exports = mongoose.model('Incident', Incident);


