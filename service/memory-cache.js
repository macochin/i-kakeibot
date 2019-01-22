"use strict";

const memory_cache = require("memory-cache");

class ServiceMemoryCache {
  constructor() {
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
}

export default new ServiceMemoryCache();
// module.exports = new ServiceMemoryCache();
