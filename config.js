module.exports = require('rc')('e-auth', {

  http: {
    host: '0.0.0.0',
    port: 3000,
  },

  provider: {
    issuer: 'http://localhost:3000',
  },

  db: {
    uri: 'mongodb://localhost:27017/e-auth',
  },


});
