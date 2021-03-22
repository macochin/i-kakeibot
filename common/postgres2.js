'use strict';

// const pg = require('pg');
const { Pool } = require('pg');
const conString = process.env.DATABASE_URL;
const pg = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: true
  // ssl: { rejectUnauthorized: false }
});

class Postgres {
  async select(sql, param) {
    // let client = new pg.Client(conString);
    // client.connect();
    let client = await pg.connect()
    let result = await this.querySelect(client, sql, param);
    // client.end();
    client.release();

    return result;
  }

  async asyncSelect(sql, param) {
    // let client = new pg.Client(conString);
    // client.connect();
    let client = await pg.connect()
    let list = await this.querySelect(client, sql, param);
    // client.end();
    client.release();
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
    // let client = new pg.Client(conString);
    // client.connect();
    let client = await pg.connect()
    await this.queryUpdate(client, sql, param);
    // client.end();
    client.release();
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
}

module.exports = new Postgres();