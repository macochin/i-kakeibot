'use strict';

const db = require('../common/postgres');

const sql_select_category = "select category, max(update_date) as max_update_date from accountBook where sender_id = $1 group by category order by max_update_date desc";
const sql_select_useDateYM = "select distinct to_char(usedate, 'yyyy/mm') as usedate_ym from accountBook where sender_id = $1 and to_char(usedate, 'yyyy/mm') != $2 order by usedate_ym desc";
const sql_select_expence_list = "select account_book_id, to_char(usedate, 'mm/dd') as usedate_md, category, money from accountBook where sender_id = $1 and to_char(usedate, 'yyyy/mm') = $2 order by usedate desc, update_date";
const sql_select_expence_list_webapi = "select to_char(usedate, 'mm/dd') as usedate, category, money from accountBook where sender_id = $1 and to_char(usedate, 'yyyymm') = $2 order by usedate, update_date";
const sql_insert_expence = "INSERT INTO accountBook (sender_id, useDate, money, category, insert_date, update_date) VALUES ($1, $2, $3, $4, $5, $6)";
const sql_delete_expence = "delete from accountBook where sender_id = $1 and account_book_id = $2";

class ServicePostgres {

  async asyncSelectCategory(sqlParam) {
    return await db.asyncSelect(sql_select_category, sqlParam);
  }

  async asyncInsertExpence(sqlParam) {
    await db.asyncUpdate(sql_insert_expence, sqlParam);
  }

  async asyncSelectUseDateYM(sqlParam) {
    return await db.asyncSelect(sql_select_useDateYM, sqlParam);
  }

  async asyncSelectExpenceList(sqlParam) {
    return await db.asyncSelect(sql_select_expence_list, sqlParam);
  }

  async asyncDeleteExpence(sqlParam) {
    await db.asyncUpdate(sql_delete_expence, sqlParam);
  }

  async asyncSelectExpenceListWebAPI(sqlParam) {
    return await db.asyncSelect(sql_select_expence_list_webapi, sqlParam);
  }
}

module.exports = new ServicePostgres();