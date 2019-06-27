'use strict';

const db = require('../common/postgres');
const sql_select_category = "select category, max(update_date) as max_update_date from accountBook where sender_id = $1 group by category order by max_update_date desc";
const sql_insert_expence = "INSERT INTO accountBook (sender_id, useDate, money, category, insert_date, update_date) VALUES ($1, $2, $3, $4, $5, $6)";

const pg = require('pg');
const conString = process.env.DATABASE_URL;

class ServicePostgres {

  async asyncSelectCategory(sqlParam) {
    return await db.asyncSelect(sql_select_category, sqlParam);
  }

  async asyncInsertExpence(sqlParam) {
    await db.asyncUpdate(sql_insert_expence, sqlParam);
  }

  // TODO:以下削除予定
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

module.exports = new ServicePostgres();