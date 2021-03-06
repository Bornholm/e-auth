module.exports = require('rc')('e-auth', {

  // Web server configuration
  http: {

    host: '0.0.0.0', // The host to listen to, 0.0.0.0 to listen on all interfaces
    port: 3333, // The port
    providerBaseUrl: '/oidc', // The path prefix of the OIDC provider

    // Express settings, see http://expressjs.com/en/4x/api.html#app.set
    settings: {
      views: 'views',
      'view engine': 'ejs',
    },

    // Express session configuration
    session: {
      name: 'e-auth',
      secret: 'NotSoSecret', // Change this to something unique to your instance
      saveUninitialized: false,
      resave: false,
      cookie: {
        maxAge: 60000,
      },
    },

  },

  // OpenID Connect provider configuration
  provider: {

    // The public base URL of your OIC provider
    issuer: 'http://localhost:3333/oidc',

    options: {

      // You should not need to modifiy this
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

  // Database configuration (for storing sessions, tokens, etc)
  db: {
    uri: 'mongodb://localhost:27017/e-auth',
  },

  // Acounts database configuration
  // For now, only "e-users" backend is available
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

  // Debug endpoint configuration (/debug)
  // Disable by default, use NODE_ENV=development env variable to enable
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
