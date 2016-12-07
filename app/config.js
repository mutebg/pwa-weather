var config = {};

switch (process.env.NODE_ENV) {

  case 'production':
    config = require('./config.production.js');
    break;

  default:
    config = require('./config.development.js');
    break;
}

module.exports = config;
