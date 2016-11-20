var express = require('express');
var app = express();
var bodyParser     	= require("body-parser");
var cors = require('cors');
var request = require('request');
var webpush = require('web-push');


app.set('strict routing', true);
app.use( express.static(__dirname + '/public') );
app.use( express.static(__dirname + '/build') );

app.use( cors() );
app.use( bodyParser.urlencoded({ extended: false }) );
app.use( bodyParser.json() );

var pushSubscription = null;


app.use(function (err, req, res, next) {
 	// handle error
 	console.log(err);
})

app.get('/weather', (req, res) => {
  request('https://api.darksky.net/forecast/81ce376a0c64563f03a4c92cc3268a92/52.379473,5.215532?exclude=minutely,flags&units=si', (error, response, body) => {
    if (!error && response.statusCode == 200) {
      res.json( JSON.parse(body) );
    }
  });
});

//SUBSCRIBE FOR PUSH NOTIFICATIONS
app.get('/push/subscribe', (req, res) => {

  pushSubscription = JSON.parse( req.param('subscription') );
  res.json({
    subscription: pushSubscription
  });
});

//UNSUBSCRIBE FOR PUSH NOTIFICATIONS
app.get('/push/unsubscribe', (req, res) => {
  pushSubscription = JSON.parse( req.param('subscription') );
  res.json({
    ok: 1
  });
});

//UPDATE SUBSCRIBTION, USEALY TIME
app.get('/push/update', (req, res) => {
  pushSubscription = JSON.parse( req.param('subscription') );
  res.json({
    subscription: pushSubscription
  });
});

//SEND PUSH NOTIFICATION
app.get('/push/send', (req, res) => {
  //var vapidKeys = webpush.generateVAPIDKeys();
  var vapidKeys = {
    publicKey: 'BMxGQ2HnBS1e8tiVsi-5-zRbKW8wlheQtcSK_n0P9bgEXeLoqS9dXdcsAo8MhIsPfoej-snuKYrVgxdR-KRpI5A',
    privateKey: 'Cgyon7ZJ57K7HbgSV8M4UUOYi3k06jItQdYOcwjR8jk'
  };

  //webpush.setGCMAPIKey('AIzaSyA_gnR_0TogzfT0Rzpwd9eUMCKOvIs8l9g');
  webpush.setGCMAPIKey('AAAAlYY_UVo:APA91bHLItfywkjlRCuttvY78ly0Z-0_xtVgvV1WeOKdPLv79JxhRH0nxCu7-rdrFlJXfsa_W8R27CAfKiN2_z2cobQNpfkvRyNiKyxmASt9Rzx5rwOjIMTJuYSjsF3Dl9Ep-F6BSqI5vI1nI0bXKatkQurm_Ovd1w');
  // webpush.setVapidDetails(
  //   'mailto:mutebg@gmail.com',
  //   vapidKeys.publicKey,
  //   vapidKeys.privateKey
  // );

  // This is the same output of calling JSON.stringify on a PushSubscription
  console.log(pushSubscription);

  webpush.sendNotification(pushSubscription, "demo").then(() => {
      res.status(200).send({success: true});
  })
  .catch((err) => {
    console.log('error', err);
    if (err.statusCode) {
      res.status(err.statusCode).send(err.body);
    } else {
      res.status(400).send(err.message);
    }
  });
});


var server = app.listen(5000, function() {
	var host = server.address().address
	var port = server.address().port
	console.log('Example app listening at http://%s:%s', host, port)
})
