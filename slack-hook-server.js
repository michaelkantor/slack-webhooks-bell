var https = require('https');
var express = require('express');
var app = express();
var bodyParser = require('body-parser').urlencoded({extended: false});
var request = require('request');
var BELL_REQUEST = 'http://96.86.160.145:2355/?move_count=';

app.use(bodyParser);

app.get('/', function(req, res) {
  var value = Number(req.query.move_value);
  console.log("GET REQUEST IGNORED");
  res.status(200).send('OK')
});

app.post('/', function(req, res) {
  console.log("RECEIVED POST");
  var matches = req.body.text.match(/:bell:/g) || [];
  var count = matches.length;
  if (count) {
    console.log("Message received; count: " + count);
    request(BELL_REQUEST + count)
  }
  res.status(200).send('OK')
});


var fs = require('fs');
try {
  key = fs.readFileSync('./ssl2/key.pem');
  cert= fs.readFileSync('./ssl2/server.crt');
  ca= fs.readFileSync('./ssl2/csr.pem');

  var secureServer = https.createServer({
    key: key,
    cert: cert,
    ca: ca,
    requestCert: true,
    rejectUnauthorized: false
  }, app);
} catch(e) {
  console.error('FAILED: ', e);
}
if (secureServer) app = secureServer;

var PORT = 3009;
// Listen on port 8080, IP defaults to 192.168.1.101. Also accessible through [tessel-name].local
app.listen(PORT);

console.log("Server running on port " + PORT);
