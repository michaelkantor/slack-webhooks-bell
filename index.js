var https = require('https');
var express = require('express');
var app = express();
var bodyParser = require('body-parser').urlencoded({extended: false});


var tessel = require('tessel');
var servolib = require('servo-pca9685');
var servo = servolib.use(tessel.port['A']);
var servo1 = 1; // We have a servo plugged in at position 1
var servoStopValue = 0.385;

app.use(bodyParser);

servo.on('ready', function () {
    console.log("SERVO READY");
    var position = 0;  //  Target position of the servo between 0 (min) and 1 (max).


	// respond with "hello world" when a GET request is made to the homepage
    app.get('/', function(req, res) {
	var value = Number(req.query.move_value);
	console.log("RECEIVED GET: " + value);
	if (!isNaN(value)) {
	    try {
		servo.move(servo1, value);
	    } catch(e) {
		console.error(e);
	    }
	}
	console.log("OK");
	res.status(200).send('OK2')
    });

    function ding() {
	try {
	    console.log("FULL FORWARD");
	    servo.move(servo1, 1);
	    setTimeout(function() {
		console.log("STOP");
		servo.move(servo1, servoStopValue);
	    }, 220);
	} catch(e) {
	    console.error(e);
	}
    }

    app.post('/', function(req, res) {
	console.log("RECEIVED POST");
	    var matches = req.body.text.match(/:bell:/g) || [];
	    var count = Math.min(4, matches.length);
	    console.log("Message received; count: " + count);
	    for (var i = 0; i < count; i++ ) {
		setTimeout(function() {
		    ding();
		}, 500 * i);
	    }
	    res.status(200).send('OK')
	});
});

var fs = require('fs');
try {
  var secureServer = https.createServer({
    key: key,
    cert: cert,
    requestCert: false,
    rejectUnauthorized: false
  }, app);
} catch(e) {
  console.error('FAILED: ', e);
}
if (secureServer) app = secureServer;


// Listen on port 8080, IP defaults to 192.168.1.101. Also accessible through [tessel-name].local
app.listen(8080);

console.log("Server running at http://192.168.1.101:8080/");
