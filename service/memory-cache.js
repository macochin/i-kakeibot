"use strict";

const memory_cache = require("memory-cache");

class MemoryMemoryCache {
  constructor(options) {
    this.client = memory_cache;
  }

  async get(key) {
    return this.client.get(key);
  }

  async put(key, value, retention = 600) {
    return this.client.put(key, value, retention * 1000, (key, value));
  }

  async del(key) {
    return this.client.del(key);
  }
}

module.exports = MemoryMemoryCache;
