'use strict';

const express = require('express');
const OpenIDProvider = require('oidc-provider');
const MongoClient = require('mongodb').MongoClient;
const config = require('./config');
const MongoAdapterFactory = require('./lib/adapter/mongo-adapter-factory');
const OpenIDConnectInteractionsRoutes = require('./lib/routes/oidc-interactions');
const DebugRoutes = require('./lib/routes/debug');
const Account = require('./lib/models/account');
const morgan = require('morgan');

// Create Express app
const app = express();

MongoClient.connect(config.db.uri)
  .then(db => configure(db))
  .then(() => listen())
  .catch(err => {
    console.error(err); // eslint-disable-line no-console
    process.exit(1);
  })
;

function configure(db) {

  MongoAdapterFactory.setDatabase(db);

  // Complete configuration with custom adapter/hooks
  config.provider.adapter = MongoAdapterFactory;
  Account.setConfig(config.accounts);
  config.provider.findById = Account.findAccountById.bind(Account);

  const provider = new OpenIDProvider(config.provider.issuer, config.provider);

  // Initialize OpenID provider
  return provider.initialize()
    .then(() => {

      // Load Express settings
      loadSettings(config.http.settings);

      // Mount express endpoints
      app.use(morgan('combined'));
      app.use(new OpenIDConnectInteractionsRoutes(config.http, provider));
      if (app.get('env') === 'development') app.use(new DebugRoutes(config.http));
      app.use(config.http.providerBaseUrl, provider.callback);
      app.use('/public', express.static(__dirname + '/public'));

    })
  ;

}

function loadSettings(settings) {
  Object.keys(settings).forEach(key => {
    app.set(key, settings[key]);
  });
}

function listen() {
  return new Promise((resolve, reject) => {
    app.listen(config.http.port, config.http.host, err => {
      if (err) return reject(err);
      console.log(`listening on http://${config.http.host}:${config.http.port}${config.http.providerBaseUrl}`); // eslint-disable-line no-console
      return resolve();
    });
  });
}
