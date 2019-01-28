"use strict";

class Memory {
  constructor() {
    let Store = require("./memory-cache");
    this.store = new Store();
  }

  async get(key) {
    return this.store.get(key);
  }

  async put(key, content) {
    this.store.put(key, content);
  }

  async del(key) {
    this.store.del(key);
  }
}

module.exports = Memory;
