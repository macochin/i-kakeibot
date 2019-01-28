"use strict";

class Memory {
  constructor() {
    let Store = require("./memory-cache");
    this.store = new Store();
  }

  get(key) {
    return this.store.get(key);
  }

  put(key, content) {
    this.store.put(key, content);
  }

  del(key) {
    this.store.del(key);
  }
}

module.exports = Memory;
