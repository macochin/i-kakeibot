'use strict';

const pg = require('pg');
const conString = process.env.DATABASE_URL;

class Postgres {
  async select(sql, param) {
    let client = new pg.Client(conString);
    client.connect();
    let result = await this.querySelect(client, sql, param);
    client.end();

    return result;
  }

  async asyncSelect(sql, param) {
    let client = new pg.Client(conString);
    client.connect();
    let list = await this.querySelect(client, sql, param);
    client.end();
    return list;
  }

  querySelect(client, sql, param) {
    return new Promise((resolve, reject) => {
      client.query(sql, param, function (err, result) {
        if (err) {
          console.error('error running query', err)
          return reject();
        }

        let list = {};
        Object.assign(list, result);

        return resolve(list);
      });
    })
  }

  async asyncUpdate(sql, param) {
    let client = new pg.Client(conString);
    client.connect();
    await this.queryUpdate(client, sql, param);
    client.end();
  }

  queryUpdate(client, sql, param) {
    return new Promise((resolve, reject) => {
      client.query(sql, param, function (err, result) {
        if (err) {
          console.error('error running query', err)
          return reject();
        }

        return resolve();
      });
    })
  }

  getNowDate() {
    let dt = new Date();
    dt.setHours(dt.getHours() + 9);
    return dt;
  }

  getNowYYYYMM() {
    let dt = this.getNowDate();
    return dt.getFullYear() + "/" + ("00" + (dt.getMonth()+1)).slice(-2);
  }

  getYYYYMM(dt) {
    return dt.getFullYear() + "/" + ("00" + (dt.getMonth()+1)).slice(-2);
  }
}

module.exports = new Postgres();