'use strict';

const express = require('express');
const OpenIDProvider = require('oidc-provider');
const MongoClient = require('mongodb').MongoClient;
const config = require('./config');
const MongoAdapterFactory = require('./lib/mongo-adapter-factory');
const AccountsFinderFactory = require('./lib/accounts-finder-factory');

// Create Express app
const app = express();

MongoClient.connect(config.db.uri)
  .then(db => {

    MongoAdapterFactory.setDatabase(db);

    // Complete configuration with custom adapter/hooks
    config.provider.adapter = MongoAdapterFactory;
    config.provider.findById = AccountsFinderFactory(db);

    const provider = new OpenIDProvider(config.provider.issuer, config.provider);
    // Initialize OpenID provider
    return provider.initialize()
      .then(() => {
        app.use(provider.callback);
      })
    ;
  })
  .then(() => { // Start listening for requests
    return new Promise((resolve, reject) => {
      app.listen(config.http.port, config.http.host, err => {
        if (err) return reject(err);
        console.log(`listening on http://${config.http.host}:${config.http.port}/`); // eslint-disable-line no-console
        return resolve();
      });
    });
  })
  .catch(err => {
    console.error(err); // eslint-disable-line no-console
    process.exit(1);
  })
;
