const express = require('express');
const flash = require('connect-flash');
const session = require('express-session');

class Debug {

  constructor(provider, httpConfig) {
    this._provider = provider;
    this._httpConfig = httpConfig;
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
  }

  _configureRoutes() {
    this._app.use('/debug', this._handleDebugRoute.bind(this));
  }

  _handleDebugRoute(req, res) {
    if (this._app.get('env') !== 'development') {
      return res.status(404).end();
    }
    return res.render('debug');
  }

}

module.exports = Debug;
