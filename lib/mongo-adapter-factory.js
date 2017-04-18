'use strict';

const MongoAdapter = require('./mongo-adapter');

class CollectionSet extends Set {

  static setDatabase(db) {
    this.db = db;
    return this;
  }

  static getDatabase() {
    return this.db;
  }

  add(name) {
    const nu = this.has.apply(this, arguments);
    super.add.apply(this, arguments);
    if (!nu) {
      CollectionSet.getDatabase().collection(name).createIndexes([
        { key: { grantId: 1 } },
        { key: { expiresAt: 1 }, expireAfterSeconds: 0 },
      ]).catch(console.error); // eslint-disable-line no-console
    }
  }

}

class MongoDBAdapterFactory {

  static setDatabase(db) {
    MongoAdapter.setDatabase(db);
    CollectionSet.setDatabase(db);
  }

  constructor(name) {
    const collections = new CollectionSet();
    const adapter = new MongoAdapter(name, collections);
    setImmediate(() => adapter.emit('ready'));
    return adapter;
  }

}

module.exports = MongoDBAdapterFactory;
