module.exports = require('rc')('e-auth', {

  http: {

    host: '0.0.0.0',
    port: 3333,
    providerBaseUrl: '/oidc',

    settings: {
      views: 'views',
      'view engine': 'ejs',
    },

    session: {
      name: 'e-auth',
      secret: 'NotSoSecret',
      saveUninitialized: false,
      resave: false,
      cookie: {
        maxAge: 60000,
      },
    },

  },

  provider: {

    issuer: 'http://localhost:3333/oidc',

    options: {

      features: {
        // See https://github.com/panva/node-oidc-provider/blob/master/docs/configuration.md#enabledisable-optional-oidc-provider-features
        devInteractions: false,
        sessionManagement: true,
        discovery: true,
      },

      // See https://github.com/panva/node-oidc-provider/blob/master/docs/configuration.md#configuring-available-claims
      claims: {
        address: [ 'address' ],
        email: [ 'email', 'email_verified' ],
        phone: [ 'phone_number', 'phone_number_verified' ],
        profile: [ 'birthdate', 'family_name', 'gender', 'given_name', 'locale', 'middle_name', 'name',
          'nickname', 'picture', 'preferred_username', 'profile', 'updated_at', 'website', 'zoneinfo' ],
      },

      // Extended with claims referenced scopes
      scopes: [],

    },

  },

  db: {
    uri: 'mongodb://localhost:27017/e-auth',
  },

  accounts: {
    uri: 'mongodb://localhost:27017/e-users',
    collection: 'users',
    uidField: 'uid',
    passwordField: 'password',
    saltField: 'salt',
    hashingOptions: {
      iterations: 10000,
      keyLength: 64,
    },
  },

  debug: {
    issuer: 'http://localhost:3333/oidc/',
    client: {
      client_id: 'e-auth-debug',
      redirect_uris: [ 'http://localhost:3333/debug/cb' ],
      client_secret: 'AbsolutlyNotSecret',
    },
    scope: 'openid profile email',
    prompt: '',
  },


});
