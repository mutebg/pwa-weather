const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const request = require('request');
const webpush = require('web-push');
const mongoose = require('mongoose');
const _ = require('lodash');
const path = require('path');

const app = express();


app.set('strict routing', true);
app.use(express.static(path.join(__dirname, '/public')));
app.use(express.static(path.join(__dirname, '/build')));
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


const defaultsValues = {
  time: '08:00',
  location: {
    latitude: 52.379473,
    longitude: 5.215532,
  },
};

const dbOptions = {
  host: process.env.DB_HOST || '',
  name: process.env.DB_NAME || '',
  user: process.env.DB_USER || '',
  pass: process.env.DB_PASS || '',
};

mongoose.Promise = global.Promise;
mongoose.connect(dbOptions.host, dbOptions.name, 27017, dbOptions);


const Schema = mongoose.Schema;
const SubscriptionsModel = mongoose.model('subscriptions', new Schema({
  id: mongoose.Schema.ObjectId,
  time: { type: String, required: true, default: defaultsValues.time },
  subscription: { type: Object, required: false },
  created_at: { type: Date, default: Date.now },
}));

function requestWeather(lat, lng) {
  return new Promise((resolve, reject) => {
    request(`https://api.darksky.net/forecast/81ce376a0c64563f03a4c92cc3268a92/${lat},${lng}?exclude=minutely,flags&units=si`, (error, response, body) => {
      if (!error && response.statusCode === 200) {
        resolve(JSON.parse(body));
      } else {
        reject(error);
      }
    });
  });
}

function runNotificationLoop() {
  webpush.setGCMAPIKey('AAAAlYY_UVo:APA91bHLItfywkjlRCuttvY78ly0Z-0_xtVgvV1WeOKdPLv79JxhRH0nxCu7-rdrFlJXfsa_W8R27CAfKiN2_z2cobQNpfkvRyNiKyxmASt9Rzx5rwOjIMTJuYSjsF3Dl9Ep-F6BSqI5vI1nI0bXKatkQurm_Ovd1w');

  setInterval(() => {
    const currentDate = new Date();
    const currentTime = `${_.padStart(currentDate.getHours(), 2, 0)}:${_.padStart(currentDate.getMinutes(), 2, 0)}`;
    console.log('loop over time:', currentTime);

    const findQuery = { time: currentTime };
    SubscriptionsModel.find(findQuery)
      .exec((err, subs) => {
        subs.forEach(item => webpush.sendNotification(item.subscription));
      });
  }, 1000 * 60);
}


app.use((err, req, res, next) => {
  // handle errors TODO
  console.log(err);
  next();
});


app.get('/weather', (req, res) => {
  const lat = req.query.latitude || defaultsValues.location.latitude;
  const lng = req.query.longitude || defaultsValues.location.longitude;
  requestWeather(lat, lng).then((response) => {
    res.json(response);
  }).catch((err) => {
    res.status(400).send(err.message);
  });
});


// SUBSCRIBE FOR PUSH NOTIFICATIONS
app.get('/push/subscribe', (req, res) => {
  SubscriptionsModel.create({
    time: req.query.time || defaultsValues.time,
    subscription: JSON.parse(req.query.subscription),
  }, (err) => {
    if (err) {
      res.status(400).send(err.message);
    } else {
      res.status(200).send({ success: true });
    }
  });
});


// UNSUBSCRIBE FOR PUSH NOTIFICATIONS
app.get('/push/unsubscribe', (req, res) => {
  SubscriptionsModel.findOneAndRemove({ 'subscription.endpoint': JSON.parse(req.query.subscription).endpoint }, (err) => {
    if (err) {
      res.status(400).send(err.message);
    } else {
      res.status(200).send({ success: true });
    }
  });
});


// UPDATE SUBSCRIBTION ( USEALY NOTIFICATION TIME )
app.get('/push/update', (req, res) => {
  const update = {
    subscription: JSON.parse(req.query.subscription),
    time: req.query.time || defaultsValues.time,
  };
  SubscriptionsModel.findOneAndUpdate({ 'subscription.endpoint': update.subscription.endpoint },
    update, { upsert: true, new: true, runValidators: true }, (err) => {
      if (err) {
        res.status(400).send(err.message);
      }
      res.status(200).send({ success: true });
    });
});


// redirect app urls to index html
app.get(['/', '/hourly', '/daily', '/settings'], (req, res) => {
  res.sendFile(path.join(__dirname, '/build/index.html'));
});

// run notifiation loop that check db every 1 min and send notification
runNotificationLoop();


const server = app.listen(5000, () => {
  const host = server.address().address;
  const port = server.address().port;
  console.log('Example app listening at http://%s:%s', host, port);
});
