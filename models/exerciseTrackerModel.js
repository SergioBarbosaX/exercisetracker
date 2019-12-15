const mongoose  = require( 'mongoose' );
//const shortid   = require( 'shortid' );
const Schema    = mongoose.Schema;

const exerciseTrackerModel = new Schema ( {
  shortId    : { type: String/*, default: shortid.generate*/},
  username   : { type: String, required: true },
  exercises  : [{ description: String, 
                  duration   : Number, 
                  date       : Date}]
} );

module.exports = mongoose.model( 'exerciseTrackerModel', exerciseTrackerModel );