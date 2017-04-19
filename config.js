module.exports = require('rc')('e-auth', {

  http: {
    host: '0.0.0.0',
    port: 3333,
    providerBaseUrl: '/oidc',
  },

  provider: {
    issuer: 'http://localhost:3333',
    features: {
      // See https://github.com/panva/node-oidc-provider/blob/master/docs/configuration.md#enabledisable-optional-oidc-provider-features
      devInteractions: false,
    },
  },

  db: {
    uri: 'mongodb://localhost:27017/e-auth',
  },

  accounts: {
    uri: 'mongodb://localhost:27017/e-users',
    collection: 'users',
    uidAttribute: 'uid',
    passwordAttribute: 'password',
  },


});
