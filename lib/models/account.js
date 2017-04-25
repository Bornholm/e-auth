const MongoClient = require('mongodb').MongoClient;
const crypto = require('crypto');

class Account {

  static setConfig(config) {
    this._config = config;
    return this;
  }

  static getConfig() {
    return this._config;
  }

  static findAccountById(accountId) {
    return MongoClient.connect(this._config.uri)
      .then(db => {
        const coll = db.collection(this._config.collection);
        return coll.findOne({ [this._config.uidField]: accountId })
          .then(result => {
            db.close();
            if (!result) return false;
            return new Account(result);
          })
          .catch(err => {
            db.close();
            return err;
          })
        ;
      })
    ;
  }

  static authenticate(accountId, password) {
    return this.findAccountById(accountId)
      .then(account => {
        if (!account) return false;
        return this._encryptPassword(password, account.get(this._config.saltField))
          .then(encryptedPassword => {
            if (encryptedPassword === account.get(this._config.passwordField)) {
              return account;
            }
            return false;
          })
        ;
      })
    ;
  }

  static _encryptPassword(password, salt) {

    const iterations = this._config.hashingOptions.iterations;
    const keyLength = this._config.hashingOptions.keyLength;
    const saltBuffer = new Buffer(salt, 'base64');

    return new Promise((resolve, reject) => {
      crypto.pbkdf2(password, saltBuffer, iterations, keyLength, (err, key) => {
        if (err) return reject(err);
        return resolve(key.toString('base64'));
      });
    });

  }

  constructor(data) {
    this._data = data;
    this.accountId = this._getUnderlyingAccountID();
  }

  get(key) {
    return this._data[key];
  }

  claims() {
    const claims = Object.assign({}, this._data, {
      sub: this.accountId,
    });
    return claims;
  }

  _getUnderlyingAccountID() {
    const config = this.constructor.getConfig();
    return this._data[config.uidField];
  }

}

module.exports = Account;
