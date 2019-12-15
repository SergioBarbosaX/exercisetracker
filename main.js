'use strict';

const express                = require('express');
const mongoose               = require('mongoose');
const bodyParser             = require('body-parser');
const cors                   = require('cors');
const postUrlController      = require( './controllers/PostUrlController' );
const getUrlController       = require( './controllers/GetUrlController' );
const app                    = express();



// MIDDLEWARES
// Sets PORT where server will run
app.set ( 'PORT' , process.env.PORT || 3000 );
//Defines bodyParser to handle POST requests
app.use( bodyParser.urlencoded ( { extended: false } ) );
// Defines public folder to server static files
//app.use( '/public' , express.static( process.cwd() + '/public' ) );
app.use(express.static('views/css'));
// Use cors for FCC testing
app.use( cors() );


// DATABASE
mongoose.connect( process.env.MONGOLAB_URI , {useNewUrlParser: true} )
        .then( ( ) => console.log( 'Connected to the database' ) )
        .catch( err => console.log( `Couldn't connect to the database: ${err}` ) );


// ROUTES
app.get('/', (req, res) => {
  //res.sendFile(process.cwd() + '/views/index.html');
  res.sendFile(__dirname + '/views/index.html');
});

app.get( '/api/hello' , (req, res) => {
  res.json( {greeting : 'hello API' } );
});

app.post( '/api/exercise/new-user'    , postUrlController.postCreateUser  );
app.post( '/api/exercise/add'         , postUrlController.postAddExercise  );
app.get(  '/api/exercise/users'       , getUrlController.getAllUsers  );
app.get( '/api/exercise/log?:userId'  , getUrlController.getFullExerciseUserLog ) ;

// RUNNING SERVER
app.listen( app.get( 'PORT' ) , () => {
  console.log('Node.js listening ...');
});