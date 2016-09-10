// External IP Address is `96.86.160.145`; Internal IP Address is 10.0.17.73; external port `2355` internal port is 8080
var https = require('https');
var express = require('express');
var app = express();
var bodyParser = require('body-parser').urlencoded({extended: false});


var tessel = require('tessel');
var servolib = require('servo-pca9685');
var servo = servolib.use(tessel.port['A']);
var servo1 = 1; // We have a servo plugged in at position 1
var servoStopValue = 0.383;

servo.on('ready', function () {
    console.log("SERVO READY");


	// respond with "hello world" when a GET request is made to the homepage
    app.get('/', function(req, res) {
	if (req.query.move_speed) {
	    var value = Number(req.query.move_speed);
	    console.log("RECEIVED GET: " + value);
	    if (!isNaN(value)) {		
		try {
		    servo.move(servo1, value);
		} catch(e) {
		    console.error(e);
		}
	    }
	} else if (req.query.move_count) {
	    var count = Math.max(4, Number(req.query.move_count));
	    console.log("Message received; count: " + count);
	    for (var i = 0; i < count; i++ ) {
		setTimeout(function() {
		    ding();
		}, 500 * i);
	    }
	    res.status(200).send('OK')
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
});

app.listen(8080);

console.log("Server running at http://xxx.xxxx.xxx.xxx:9019/ - use t2 wifi");
