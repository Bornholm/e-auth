'use strict';

const express = require('express');
const OpenIDProvider = require('oidc-provider');
const MongoClient = require('mongodb').MongoClient;
const config = require('./config');
const MongoAdapterFactory = require('./lib/adapter/mongo-adapter-factory');
const EAuthInteractions = require('./lib/e-auth-interactions');
const Account = require('./lib/models/account');
const Logger = require('./lib/util/logger');
const BunyanMiddleware = require('bunyan-middleware');

// Create Express app
const app = express();

MongoClient.connect(config.db.uri)
  .then(db => {

    MongoAdapterFactory.setDatabase(db);

    // Complete configuration with custom adapter/hooks
    config.provider.adapter = MongoAdapterFactory;
    Account.setConfig(config.accounts);
    config.provider.findById = Account.findAccountById.bind(Account);

    const provider = new OpenIDProvider(config.provider.issuer, config.provider);
    // Initialize OpenID provider
    return provider.initialize()
      .then(() => {
        app.use(BunyanMiddleware({ logger: Logger }));
        app.use(new EAuthInteractions(provider));
        app.use(config.http.providerBaseUrl, provider.callback);
      })
    ;

  })
  .then(() => { // Start listening for requests
    return new Promise((resolve, reject) => {
      app.listen(config.http.port, config.http.host, err => {
        if (err) return reject(err);
        Logger.info(`listening on http://${config.http.host}:${config.http.port}${config.http.providerBaseUrl}`);
        return resolve();
      });
    });
  })
  .catch(err => {
    console.error(err); // eslint-disable-line no-console
    process.exit(1);
  })
;
