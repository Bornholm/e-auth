const express = require('express');
const Account = require('./models/account');
const logger = require('./util/logger');
const bodyParser = require('body-parser');

class EAuthInteractions {

  constructor(provider) {
    this._provider = provider;
    this._app = express();
    this._configureApp();
    this._configureRoutes();
    return this._app;
  }

  _configureApp() {
    this._app.set('view engine', 'ejs');
    this._app.set('views', __dirname + '/../views');
  }

  _configureRoutes() {
    const parser = bodyParser.urlencoded({ extended: false });
    this._app.get('/', this._handleIndexRoute.bind(this));
    this._app.get('/interaction/:grant', this._handleInteractionRoute.bind(this));
    this._app.post('/interaction/:grant/login', parser, this._handleLoginRoute.bind(this));
    this._app.use('/public', express.static(__dirname + '/../public'));
    this._app.use('/debug', this._handleDebugRoute.bind(this));
  }

  _handleIndexRoute(req, res) {
    return res.render('index');
  }

  _handleInteractionRoute(req, res) {

    const interaction = this._provider.interactionDetails(req);

    switch (interaction.interaction.error) {
    case 'login_required':
      return res.render('login', { interaction: interaction, path: req.path });
    default:
      return res.render('interaction', { interaction });
    }

  }

  _handleLoginRoute(req, res, next) {

    const interaction = this._provider.interactionDetails(req);
    const uid = req.body.uid;
    const password = req.body.password;

    Account.authenticate(uid, password)
      .then(account => {

        if (!account) {
          return res.render('login', {
            interaction: interaction,
            path: req.path,
            error: 'unknown_account',
          });
        }

        this._provider.interactionFinished(req, res, {
          login: {
            account: account.accountId,
            acr: '1',
            remember: !!req.body.remember,
            ts: Math.floor(Date.now() / 1000),
          },
          consent: {
            // TODO: remove offline_access from scopes is remember is not checked
          },
        });

      })
      .catch(next)
    ;
  }

  _handleDebugRoute(req, res) {
    return res.render('debug');
  }

}

module.exports = EAuthInteractions;
