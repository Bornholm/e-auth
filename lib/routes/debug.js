const express = require('express');
const Strategy = require('openid-client').Strategy;
const Issuer = require('openid-client').Issuer;
const passport = require('passport');

class Debug {

  constructor(httpConfig, debugConfig) {
    this._httpConfig = httpConfig;
    this._debugConfig = debugConfig;
    this._app = express();
    this._configureApp().then(() => {
      this._configureRoutes();
    });
    return this._app;
  }

  _configureApp() {

    return Issuer.discover(this._debugConfig.issuer)
      .then(issuer => {

        const client = new issuer.Client(this._debugConfig.client);

        passport.use('oidc', new Strategy({
          client: client,
          params: {
            scope: this._debugConfig.scope,
            prompt: this._debugConfig.prompt,
          },
        }, (tokenSet, userInfo, done) => {
          return done(null, {
            attrs: userInfo,
            tokens: {
              accessToken: tokenSet.access_token,
              idToken: tokenSet.id_token,
            },
          });
        }));

        passport.serializeUser((user, done) => {
          done(null, JSON.stringify(user));
        });

        passport.deserializeUser((serial, done) => {
          done(null, JSON.parse(serial));
        });

        // Mount middlewares
        this._app.use(passport.initialize());
        this._app.use(passport.session());

        this._app.use((req, res, next) => {
          // Expose req to templates
          res.locals.req = req;
          res.locals.client = client;
          res.locals.issuer = issuer;
          req.appBaseUrl = `${req.protocol}://${req.get('Host')}` + req.app.mountpath;
          return next();
        });

      })
      .catch(err => {
        console.error(err); // eslint-disable-line no-console
        process.exit(1);
      })
    ;

  }

  _configureRoutes() {
    this._app.get('/debug', this._handleIndexRoute.bind(this));
    this._app.get('/debug/cb', passport.authenticate('oidc', { successRedirect: '/debug?success', failureRedirect: '/debug?failure' }));
    this._app.get('/debug/login', passport.authenticate('oidc'));
    this._app.get('/debug/logout', this._handleLogoutRoute.bind(this));
    this._app.get('/debug/logout/cb', this._handleLogoutCallBackRoute.bind(this));
  }

  _handleIndexRoute(req, res) {
    return res.render('debug');
  }

  _handleLogoutRoute(req, res) {
    const user = req.user;
    const redirectUrl = encodeURIComponent(req.appBaseUrl+'debug/logout/cb');
    const params = 'post_logout_redirect_uri='+redirectUrl+(user && user.tokens ? ('&id_token_hint='+user.tokens.idToken) : '');
    return res.redirect(res.locals.issuer.end_session_endpoint+'?'+params);
  }

  _handleLogoutCallBackRoute(req, res) {
    req.logout();
    req.session.destroy(() => {
      res.clearCookie(this._httpConfig.session.name);
      res.clearCookie('_session');
      return res.redirect(req.appBaseUrl+'debug');
    });
  }

}

module.exports = Debug;
