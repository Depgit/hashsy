const admin = require('firebase-admin');
const firebaseService = require('../config.json').firebaseService;

let file = "[singletons/db.js]"

class Database {
  constructor() {
    if (Database.instance) {
      return Database.instance;
    }

    admin.initializeApp({
      credential: admin.credential.cert(firebaseService),
      databaseURL: `https://${firebaseService.default_database_url}.firebasedatabase.app`
    });

    this.db = admin.database();
    Database.instance = this;
  }
  async create(path, data) {
    let key= null, Error= null;
    try {
      key = this.db.ref(path).push(data);
    } catch (err) {
      logger.log(file,err)
      Error = err
    }
    return [key, Error]
  }
  
  async get(path,lvalue,rvalue) {
    let key= null, Error= null;
    try {
      const snapshot = await this.db.ref(path)
        .orderByChild(lvalue)
        .equalTo(rvalue)
        .once('value');
      key =  snapshot.val();
    } catch (err) {
      logger.log(file,err);
      Error = err;
    }
    return [key, Error]
  }
  
  async update(path, data) {
    let key= null, Error= null;
    try {
      key = await this.db.ref(path).update(data);
    } catch (err) {
      logger.log(file,err);
      Error = err;
    }
    return [key, Error]
  }

  async set(path, data) {
    let key=null,Error = null;
    try {
      key = this.db.ref(path).set(data);
    } catch (err) {
      logger.log(file,err)
      Error =  err
    }
    return [key,Error]
  }
  async remove(path) {
    return this.db.ref(path).remove();
  }
}

module.exports = new Database();
