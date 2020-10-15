'use strict';

const crypto_base = require('crypto');

const crypto_key = process.env.CRYPTO_KEY;
const crypto_alg = 'aes256';
const crypto_encoding = 'hex'
const randomBytes_encoding = 'base64';
const str_encoding = 'utf8';
const N = 10;
const S="abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"

class crypto {
  async createCipher(str) {
    return new Promise((resolve, reject) => {
      let cipher = crypto_base.createCipher(crypto_alg, crypto_key);
      let crypt_str = cipher.update(str, str_encoding, crypto_encoding);
      crypt_str += cipher.final(crypto_encoding);
      return resolve(crypt_str);
    });
  }

  async createDecipher(str) {
    return new Promise((resolve, reject) => {
      let decipher = crypto_base.createDecipher(crypto_alg, crypto_key);
      dec = decipher.update(str, crypto_encoding, str_encoding);
      dec += decipher.final(str_encoding);
      return resolve(dec);
    });
  }

  async getRandomBytes() {
    return new Promise((resolve, reject) => {
      // let ret = crypto_base.randomBytes(N).toString(randomBytes_encoding).substring(0, N);
      let ret = Array.from(crypto_base.randomFillSync(new Uint8Array(N))).map((n)=>S[n%S.length]).join('');
      return resolve(ret);
    });
  }
}
module.exports = new crypto();
