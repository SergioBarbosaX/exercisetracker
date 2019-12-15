const moment                    = require( 'moment' );
const exerciseTrackerModel      = require( '../models/exerciseTrackerModel' );


const generateShortId = ( idObject ) => {
  let id       = JSON.stringify(idObject);
  let idLength = id.length;
  let shortId  = id.substring(idLength - 10, idLength - 1);
  
  return shortId;
}

const saveUser = ( user, res ) => {
  const newExerciseTracker = new exerciseTrackerModel ( );
  newExerciseTracker.username = user;
  
  newExerciseTracker.save ( ( err, data ) => {
    if ( err )
      return console.log( err );
    else {
      let shortId  = generateShortId(data._id);
      exerciseTrackerModel.findOneAndUpdate( {'username': user}, {'shortId': shortId}, (err, doc) => {
        res.json({'username': doc.username, '_id': shortId});
      } );
    }
  } );
};

const checkIfUsernameExists = ( user, res ) => {
  exerciseTrackerModel.findOne( {'username': user}, ( err, foundUser ) => {
    if ( err )      
      return console.log( err );
    if ( foundUser ){
      res.send('Username already taken');
    }
    else 
      saveUser( user, res );
  } );
};

const checkDateAndFormat = ( dateExercise ) => {
  let validDate = /^\d{4}-\d{2}-\d{2}$/.test(dateExercise);
  if (validDate) 
    return moment(dateExercise, 'YYYY-MM-DD').format("dd MMM DD YYYY");
  
  return null;
}

const saveExercise = ( foundUser, exercise, res ) => {
  foundUser.save(  ( err, data ) => {
    if ( err )
      return console.log( err );
    else 
      res.json({'username': foundUser.username, 'description': exercise.description, 'duration': exercise.duration, '_id': foundUser.shortId, 'date': exercise.date});
    });
};

const checkIfUseridExists = ( userId, exercise, res ) => {
  exerciseTrackerModel.findOne( {'shortId': userId}, ( err, foundUser ) => {
    if ( err )      
      return console.log( err );
    if ( foundUser ) {
      foundUser.exercises.push( exercise );
      saveExercise( foundUser, exercise, res);
    }
  });
}


// Main methods
exports.postCreateUser = ( req, res ) => {
  const user                   = req.body.username;
  
  checkIfUsernameExists( user, res );
}

exports.postAddExercise = ( req, res ) => {
  let userId   = req.body.userId;
  let exercise = {'description' : req.body.description, 
                  'duration'    : req.body.duration, 
                  'date'        : req.body.date};
  
  
  if ( (exercise.description.length > 0) && (exercise.duration.length > 0) ) {
    if (exercise.date.length === 0)
      exercise.date = moment().format("dd MMM DD YYYY");
    else {
      exercise.date = checkDateAndFormat(exercise.date);
      if (exercise.date === null)
        res.send('Invalid date format');
    }
    checkIfUseridExists(userId, exercise, res);
  }
  else {
    res.send('Mandatory fields need to be filled');
  }
}