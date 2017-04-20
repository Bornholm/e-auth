const express = require('express');
const Strategy = require('openid-client').Strategy;
const Issuer = require('openid-client').Issuer;
const passport = require('passport');
const session = require('express-session');

class Debug {

  constructor(httpConfig, debugConfig) {
    this._httpConfig = httpConfig;
    this._debugConfig = debugConfig;
    this._app = express();
    this._configureApp();
    this._configureRoutes();
    return this._app;
  }

  _configureApp() {

    const issuer = new Issuer(this._debugConfig.issuer);
    const client = new issuer.Client(this._debugConfig.client);

    passport.use('oidc', new Strategy({ client: client }, (tokenSet, userInfo, done) => {
      return done(null, userInfo);
    }));

    passport.serializeUser((user, done) => {
      done(null, JSON.stringify(user));
    });

    passport.deserializeUser((serial, done) => {
      done(null, JSON.parse(serial));
    });

    // Mount middlewares
    this._app.use(session(this._httpConfig.session));
    this._app.use(passport.initialize());
    this._app.use(passport.session());
    this._app.use((req, res, next) => {
      // Expose req to templates
      res.locals.req = req;
      res.locals.client = client;
      return next();
    });

  }

  _configureRoutes() {
    this._app.get('/debug', this._handleDebugRoute.bind(this));
    this._app.get('/debug/cb', passport.authenticate('oidc', { successRedirect: '/debug', failureRedirect: '/debug' }));
    this._app.get('/debug/login', passport.authenticate('oidc'));
    this._app.get('/debug/logout', this._handleDebugLogout.bind(this));
  }

  _handleDebugRoute(req, res) {
    return res.render('debug');
  }

  _handleDebugLogout(req, res) {
    req.session.destroy(() => {
      return res.redirect('/debug');
    });
  }

}

module.exports = Debug;
