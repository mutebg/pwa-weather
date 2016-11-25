var express = require('express');
var app = express();
var bodyParser     	= require("body-parser");
var cors = require('cors');
var request = require('request');
var webpush = require('web-push');
var mongoose = require('mongoose');
var _ = require('lodash');
var cookieParser = require('cookie-parser')


app.set('strict routing', true);
app.use( express.static(__dirname + '/public') );
app.use( express.static(__dirname + '/build') );
app.use( cors());
app.use( bodyParser.urlencoded({ extended: false }) );
app.use( bodyParser.json() );


const defaultsValues = {
  time: '08:00',
  location: {
    latitude: 52.379473,
    longitude: 5.215532,
  },
};


mongoose.Promise = global.Promise;
mongoose.connect('localhost', 'weather', 27017, {});


var Schema = mongoose.Schema;
var SubscriptionsModel = mongoose.model('subscriptions', new Schema({
	id: mongoose.Schema.ObjectId,
	time: { type: String, required: true, default: defaultsValues.time},
	subscription: { type: Object, required: false},
	created_at: { type: Date, default: Date.now }
}));


app.use(function (err, req, res, next) {
 	// handle error
 	console.log(err);
});


app.get('/weather', (req, res) => {
  var lat = req.query['latitude'] || 52.379473;
  var lng = req.query['longitude'] || 5.215532;
  requestWeather(lat, lng).then(response => {
    res.json( response );
  }).catch( error => {
    res.status(400).send(err.message);
  });

});


//SUBSCRIBE FOR PUSH NOTIFICATIONS
app.get('/push/subscribe', (req, res) => {
  SubscriptionsModel.create({
    time: req.query.time || defaultsValues.time,
    subscription: JSON.parse( req.query.subscription ),
  }, (err, data) => {
    if (err) {
      res.status(400).send(err.message);
    } else {
      res.status(200).send({success: true});
    }
  });
});


//UNSUBSCRIBE FOR PUSH NOTIFICATIONS
app.get('/push/unsubscribe', (req, res) => {
  SubscriptionsModel.findOneAndRemove({'subscription.endpoint': JSON.parse(req.query.subscription).endpoint}, (err, data) => {
    if (err) {
      res.status(400).send(err.message);
    } else {
      res.status(200).send({success: true});
    }
  });
});


//UPDATE SUBSCRIBTION, USEALY TIME
app.get('/push/update', (req, res) => {
  var update = {
    subscription: req.query.subscription,
    time: req.query.time  || defaultsValues.time,
  };
  SubscriptionsModel.findOneAndUpdate({'subscription.endpoint': JSON.parse(req.query.subscription).endpoint},
    update, {upsert: true, new: true, runValidators: true}, (err, data) => {
    if (err) {
      res.status(400).send(err.message);
    }
    res.status(200).send({success: true});
  });
});


app.get('/run', (req,res) => {
  webpush.setGCMAPIKey('AAAAlYY_UVo:APA91bHLItfywkjlRCuttvY78ly0Z-0_xtVgvV1WeOKdPLv79JxhRH0nxCu7-rdrFlJXfsa_W8R27CAfKiN2_z2cobQNpfkvRyNiKyxmASt9Rzx5rwOjIMTJuYSjsF3Dl9Ep-F6BSqI5vI1nI0bXKatkQurm_Ovd1w');

  setInterval( () => {
    var currentDate = new Date();
    var currentTime = _.padStart(currentDate.getHours(), 2, 0) + ':' + _.padStart(currentDate.getMinutes(), 2, 0);
    console.log('loop over time:', currentTime);

    var findQuery = {time: currentTime};
    SubscriptionsModel.find()
  		.exec( (err, subs ) => {
  			subs.forEach( item => {
          return webpush.sendNotification(item.subscription);
        });
      });
  }, 1000 * 60);

  res.status(200).send({success: 'process is running...'});
});


var server = app.listen(5000, function() {
	var host = server.address().address
	var port = server.address().port
	console.log('Example app listening at http://%s:%s', host, port)
});


function requestWeather(lat, lng) {
  return new Promise( (resolve, reject) => {
    request(`https://api.darksky.net/forecast/81ce376a0c64563f03a4c92cc3268a92/${lat},${lng}?exclude=minutely,flags&units=si`, (error, response, body) => {
      if (!error && response.statusCode == 200) {
        resolve( JSON.parse(body) )
      } else {
        reject(error);
      }
    });
  });
}
