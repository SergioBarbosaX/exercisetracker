const moment                    = require( 'moment' );
const exerciseTrackerModel      = require( '../models/exerciseTrackerModel' );

const filterExerciseInfoByLimit = ( exercisesArr, limit) => {
  return exercisesArr.slice(0, limit);
}

const filterExerciseInfoByDate = ( exercisesArr, from, to) => {
  let exerciseMap = [];
  
  exercisesArr.forEach ( exercise => {
    if ( to !== undefined && from !== undefined ) {
      if ( moment(exercise.date).isSameOrAfter(from) && moment(exercise.date).isSameOrBefore(to) ) {
        exerciseMap.push(exercise);
      } 
    }
    else if ( to === undefined && from !== undefined ) {
      if ( moment(exercise.date).isSameOrAfter(from) ) {
        exerciseMap.push(exercise);
      }
    }
    else if ( to !== undefined && from === undefined ) {
      if ( moment(exercise.date).isSameOrBefore(to) )
        exerciseMap.push(exercise);
    }
  });
    
  return exerciseMap;
  
}

const filterExerciseInfo = ( exercisesArr, from, to, limit ) => {
  let exerciseMap = [];
  
  if ( from !== undefined || to !== undefined )
    exercisesArr = filterExerciseInfoByDate( exercisesArr, from, to);
  
  if ( limit !== undefined )
    exercisesArr = filterExerciseInfoByLimit( exercisesArr, limit );
  
  exercisesArr.forEach ( exercise => {
    exerciseMap.push({'description': exercise.description, 'duration': exercise.duration, 'date': moment(exercise.date, 'YYYY-MM-DD').format("dd MMM DD YYYY") });
  });
  
  return exerciseMap;
}


// Main functions
exports.getFullExerciseUserLog = ( req, res ) => {
  let userId = req.query.userId;
  let from, to, limit;
  
  if (req.query.from !== undefined)
    from  = moment(req.query.from).format();
  
  if (req.query.to !== undefined)
    to  = moment(req.query.to).format();
  
  if (req.query.limit !== undefined)
    limit = req.query.limit
    
  
  exerciseTrackerModel.findOne( {'shortId': userId}, ( err, foundUser ) => {
    if ( err )      
      return console.log( err );
    if ( foundUser ) {
      if (foundUser.exercises.length > 0) {
        let arrExercise = filterExerciseInfo (foundUser.exercises, from, to, limit);
        res.json({'_id': foundUser.shortId, 'username': foundUser.username, 'count': /*foundUser*/arrExercise/*.exercises*/.length, 'log': arrExercise});
      }
      else
        res.send('No exercise registered');
    }
    else 
      res.send('Unknown userId');
  });
}

exports.getAllUsers = ( req, res ) => {
  exerciseTrackerModel.find( {}, ( err, usersArr) => {
    if ( err )
      return console.log( err );
    else {     
      let userMap = [];
      usersArr.forEach ( user => {
        userMap.push({'username': user.username, '_id': user.shortId});
      } );
      res.send(userMap);
    }
  } );
}