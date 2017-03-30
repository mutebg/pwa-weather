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

const darkSkyApiKey = process.env.DARK_SKY_KEY || '';
const GCMApiKey = process.env.GCM_KEY || '';

mongoose.Promise = global.Promise;
mongoose.connect(dbOptions.host, dbOptions.name, 27017, dbOptions);

const Schema = mongoose.Schema;
const SubscriptionsModel = mongoose.model(
  'subscriptions',
  new Schema({
    id: mongoose.Schema.ObjectId,
    time: { type: String, required: true, default: defaultsValues.time },
    subscription: { type: Object, required: false },
    created_at: { type: Date, default: Date.now },
  })
);

function requestWeather(lat, lng) {
  return new Promise((resolve, reject) => {
    request(
      `https://api.darksky.net/forecast/${darkSkyApiKey}/${lat},${lng}?exclude=minutely,flags&units=si`,
      (error, response, body) => {
        if (!error && response.statusCode === 200) {
          const data = _.pick(JSON.parse(body), [
            'currently.time',
            'currently.summary',
            'currently.icon',
            'currently.temperature',
            'currently.apparentTemperature',
            'currently.windSpeed',
            'currently.windBearing',
            'currently.humidity',
            'currently.precipProbability',
            'hourly.summary',
            'hourly.data',
            'daily.summary',
            'daily.data',
          ]);

          data.hourly.data = data.hourly.data.map(day =>
            _.pick(day, [
              'time',
              'summary',
              'icon',
              'temperature',
              'windSpeed',
              'windBearing',
              'precipProbability',
              'humidity',
            ]));

          data.daily.data = data.daily.data.map(day =>
            _.pick(day, [
              'time',
              'summary',
              'icon',
              'temperatureMin',
              'temperatureMax',
              'sunriseTime',
              'sunsetTime',
            ]));

          resolve(data);
        } else {
          reject(error);
        }
      }
    );
  });
}

function runNotificationLoop() {
  webpush.setGCMAPIKey(GCMApiKey);

  setInterval(
    () => {
      const currentDate = new Date();
      const currentTime = `${_.padStart(currentDate.getHours(), 2, 0)}:${_.padStart(currentDate.getMinutes(), 2, 0)}`;

      const findQuery = { time: currentTime };
      SubscriptionsModel.find(findQuery).exec((err, subs) => {
        subs.forEach(item => webpush.sendNotification(item.subscription));
      });
    },
    1000 * 60
  );
}

app.use((err, req, res, next) => {
  // handle errors TODO
  next();
});

app.get('/weather', (req, res) => {
  const lat = req.query.latitude || defaultsValues.location.latitude;
  const lng = req.query.longitude || defaultsValues.location.longitude;
  requestWeather(lat, lng)
    .then((response) => {
      res.json(response);
    })
    .catch((err) => {
      res.status(400).send(err.message);
    });
});

// SUBSCRIBE FOR PUSH NOTIFICATIONS
app.post('/push/subscribe', (req, res) => {
  SubscriptionsModel.create(
    {
      time: req.body.time || defaultsValues.time,
      subscription: req.body.subscription,
    },
    (err) => {
      if (err) {
        res.status(400).send(err.message);
      } else {
        res.status(200).send({ success: true });
      }
    }
  );
});

// UNSUBSCRIBE FOR PUSH NOTIFICATIONS
app.delete('/push/subscribe', (req, res) => {
  SubscriptionsModel.findOneAndRemove(
    { 'subscription.endpoint': req.body.subscription.endpoint },
    (err) => {
      if (err) {
        res.status(400).send(err.message);
      } else {
        res.status(200).send({ success: true });
      }
    }
  );
});

// UPDATE SUBSCRIBTION ( USEALY NOTIFICATION TIME )
app.patch('/push/subscribe', (req, res) => {
  const update = {
    subscription: req.body.subscription,
    time: req.body.time || defaultsValues.time,
  };
  SubscriptionsModel.findOneAndUpdate(
    { 'subscription.endpoint': update.subscription.endpoint },
    update,
    { upsert: true, new: true, runValidators: true },
    (err) => {
      if (err) {
        res.status(400).send(err.message);
      }
      res.status(200).send({ success: true });
    }
  );
});

const where = require('node-where');

app.use('/geolocation', (req, res) => {
  where.is('173.194.33.104', (err, result) => {
  //where.is(req.ip, (err, result) => {
    // console.log('eeee', result);
    res.send({latitude: result.attributes.lat, longitude: result.attributes.lng });
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
