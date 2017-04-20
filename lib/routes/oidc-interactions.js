const express = require('express');
const Account = require('../models/account');
const bodyParser = require('body-parser');
const flash = require('connect-flash');
const session = require('express-session');

class OpenIDConnectInteractions {

  constructor(httpConfig, provider) {
    this._httpConfig = httpConfig;
    this._provider = provider;
    this._app = express();
    this._configureApp();
    this._configureRoutes();
    return this._app;
  }

  _configureApp() {

    // Mount middlewares
    this._app.use((req, res, next) => {
      // Expose req to templates
      res.locals.req = req;
      return next();
    });
    this._app.use(session(this._httpConfig.session));
    this._app.use(flash());

  }

  _configureRoutes() {
    const parser = bodyParser.urlencoded({ extended: false });
    this._app.get('/', this._handleIndexRoute.bind(this));
    this._app.get('/interaction/:grant', this._handleInteractionRoute.bind(this));
    this._app.post('/interaction/:grant/login', parser, this._handleLoginRoute.bind(this));
  }

  _handleIndexRoute(req, res) {
    return res.render('index');
  }

  _handleInteractionRoute(req, res) {

    const interaction = this._provider.interactionDetails(req);

    switch (interaction.interaction.error) {
    case 'login_required':
      return res.render('login', { interaction: interaction });
    default:
      return res.render('interaction', { interaction });
    }

  }

  _handleLoginRoute(req, res, next) {

    const interaction = this._provider.interactionDetails(req);
    const uid = req.body.uid;
    const password = req.body.password;
    const rememberMe = req.body.rememberMe;

    Account.authenticate(uid, password)
      .then(account => {

        // TODO check login process/redirect
        if (!account) {
          req.flash('error', 'invalid_credentials');
          const baseUrl = `${req.baseUrl}${this._httpConfig.providerBaseUrl}/auth`;
          const params = interaction.params;
          const urlParams = `client_id=${params.client_id}&response_type=${params.response_type}&scope=${params.scope}`;
          return res.redirect(`${baseUrl}?${urlParams}`);
        }

        // TODO check parameters
        this._provider.interactionFinished(req, res, {
          login: {
            account: account.accountId,
            acr: '1',
            remember: !!rememberMe,
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

}

module.exports = OpenIDConnectInteractions;
