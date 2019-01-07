'use strict';

const pg = require('pg');
const conString = process.env.DATABASE_URL;

class ServicePostgres {
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
    return new Promise((resolve) => {
      client.query(sql, sqlParam, function (err, result) {
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
    return new Promise((resolve) => {
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

module.exports = new ServicePostgres();
