"use strict";

const memory_cache = require("memory-cache");

class ServiceMemoryCache {

  instance;

  constructor() {
    if (instance == null) {
      instance = new ServiceMemoryCache();
    }
    this.client = memory_cache;
  }

  get(key) {
    return this.client.get(key);
  }

  put(key, value, retention = 600) {
    return this.client.put(key, value, retention * 1000, (key, value));
  }

  del(key) {
    return this.client.del(key);
  }

  static getInstance() {
    return instance;
  }
}

module.exports = ServiceMemoryCache
// module.exports = new ServiceMemoryCache();
