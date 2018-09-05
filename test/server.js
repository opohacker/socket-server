// Import needed modules
const express = require('express');
const bodyParser = require('body-parser');

// Create default port
const PORT = process.env.PORT || 8888;

// Create a new server
const server = express();

// Configure server
server.use(bodyParser.json());
server.use(bodyParser.urlencoded({extended: false}));


server.use("/", express.static(__dirname + '/static'));

// Start the server
server.listen(PORT, function(){
    console.log('------------------------------  The API is listening on port '+PORT+' -----------------------------');
})
;
