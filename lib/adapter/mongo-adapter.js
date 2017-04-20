'use strict';

const EventEmitter = require('events').EventEmitter;
const snakeCase = require('lodash.snakecase');

class MongoAdapter extends EventEmitter {

  static setDatabase(db) {
    this.db = db;
    return this;
  }

  static getDatabase() {
    return this.db;
  }

  constructor(name, collections) {
    super();
    this.name = snakeCase(name);
    this.collections = collections;
    this.collections.add(this.name);
  }

  coll(name) {
    return this.constructor.coll(name || this.name);
  }

  static coll(name) {
    return this.getDatabase().collection(name);
  }

  destroy(id) {
    return this.coll().findOneAndDelete({ _id: id })
      .then((found) => {
        if (found.value && found.value.grantId) {
          const promises = [];
          this.collections.forEach((name) => {
            promises.push(this.coll(name).deleteMany({ grantId: found.value.grantId }));
          });
          return Promise.all(promises);
        }
        return undefined;
      });
  }

  consume(id) {
    return this.coll().findOneAndUpdate({ _id: id }, { $currentDate: { consumed: true } });
  }

  find(id) {
    console.log(id);
    return this.coll().find({ _id: id }).limit(1).next();
  }

  upsert(_id, payload, expiresIn) {
    let expiresAt;

    if (expiresIn) {
      expiresAt = new Date(Date.now() + (expiresIn * 1000));
    }

    const document = Object.assign(payload, { expiresAt });
    if (!document.expiresAt) {
      delete document.expiresAt;
    }
    return this.coll().updateOne({ _id }, document, { upsert: true });
  }

}

module.exports = MongoAdapter;
