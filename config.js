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
      secret: 'NotSoSecret',
      saveUninitialized: true,
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
        backchannelLogout: true,
        sessionManagement: true,
      },
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
    // See http://<e-auth-domain>:<port>/<providerBaseUrl>/.well-known/openid-configuration
    issuer: {
      issuer: 'http://localhost:3333/oidc',
      authorization_endpoint: 'http://localhost:3333/oidc/auth',
      token_endpoint: 'http://localhost:3333/oidc/token',
      userinfo_endpoint: 'http://localhost:3333/oidc/me',
      jwks_uri: 'http://localhost:3333/oidc/certs',
    },
    client: {
      client_id: 'e-auth-debug',
      redirect_uris: [ 'http://localhost:3333/debug/cb' ],
      client_secret: 'AbsolutlyNotSecret',
      scope: 'openid profile',
    },
  },


});
