const MongoClient = require('mongodb').MongoClient;

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
        return coll.findOne({ [this._config.uidAttribute]: accountId })
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
        return account;
      })
    ;
  }

  constructor(data) {
    this._data = data;
    this.accountId = this._getUnderlyingAccountID();
  }

  claims() {
    return Object.assign({}, this._data, {
      sub: this.accountId,
    });
  }

  _getUnderlyingAccountID() {
    const config = this.constructor.getConfig();
    return this._data[config.uidAttribute];
  }

}

module.exports = Account;
