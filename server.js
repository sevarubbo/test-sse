// server.js
// where your node app starts


// init project
var express = require('express');
var request = require('request');
var bodyParser = require('body-parser')
const SSE = require('express-sse');
const cors = require('cors');

const app = express();
const sse = new SSE();

app.use(bodyParser.urlencoded({ extended: true }));

app.use(cors());

// we've started you off with Express, 
// but feel free to use whatever libs or frameworks you'd like through `package.json`.

// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'));

// http://expressjs.com/en/starter/basic-routing.html
app.get('/', function(request, response) {
  response.sendFile(__dirname + '/views/index.html');
});


const beaconNames = {
  "00000000-0000-0000-0000-000000000000": "Seva’s iPhone",
  "00000000-0000-0000-0000-000000000001": "Seva’s MacBook",
  "b0702880-a295-a8ab-f734-031a98a512de": "Shaunna’s laptop",
  "00000000-0000-0000-0000-000000000003": "Beacon 3",
  "00000000-0000-0000-0000-000000000004": "Cedric’s laptop"
};

app.get('/beacons', function(request, response) {
  response.json({data: beaconNames});
});



app.post('/sendAlert', function(req, res) {
  const data = JSON.parse(Object.keys(req.body)[0]);
  
  console.log(321231, data);
  
  sse.send({
    text: data.text
  }, 'alert', '001');
  
  request.post(
    'https://hooks.slack.com/services/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',
    {
      json: {
        text: data.text,
        mrkdwn: true
      }
    },
    function (error, response, body) {
        if (!error && response.statusCode == 200) {
          res.json({});
        } else {
          throw new Error("Request error");
        }
    }
);
  
});

/**
 * Streaming
 */
app.get('/stream', sse.init);


// listen for requests :)
var listener = app.listen(process.env.PORT, function() {
  console.log('Your app is listening on port ' + listener.address().port);
});
