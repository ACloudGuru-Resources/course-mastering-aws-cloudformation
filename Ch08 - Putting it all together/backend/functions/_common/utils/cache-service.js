const NodeCache = require('node-cache');

class Cache {
  constructor(ttlSeconds) {
    this.cache = new NodeCache({
      stdTTL: ttlSeconds,
      checkperiod: ttlSeconds * 0.2,
      useClones: false,
    });

    this.ttl = ttlSeconds;
  }

  get(key, storeFunction) {
    if (this.ttl > 0) {
      const value = this.cache.get(key);
      if (value) {
        return Promise.resolve(value);
      }
    }
    return storeFunction().then(result => {
      this.ttl > 0 && this.cache.set(key, result, this.ttl);
      return result;
    });
  }

  del(keys) {
    this.cache.del(keys);
  }

  setDefaultTtl(ttl) {
    this.ttl = ttl;
    this.ttl === 0 && this.flush();
  }

  delStartWith(startStr = '') {
    if (!startStr) {
      return;
    }

    const keys = this.cache.keys();
    for (const key of keys) {
      if (key.indexOf(startStr) === 0) {
        this.del(key);
      }
    }
  }

  flush() {
    this.cache.flushAll();
  }
}

module.exports = Cache;
