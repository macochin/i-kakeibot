'use strict';

const spreadsheet = require("../common/Spreadsheet");
const crypto = require('../common/crypto');
const pg = require("../common/postgres");

const master_spread_id = process.env.MASTER_SPREAD_ID;

var resource = process.env.RESOURCE_USER_INFO;
const resource_spreadsheet = "spread";
const resource_postgres = "postgres";

const sql_select_userInfo = "select user_id, sheet_id from user_info where user_id = $1";
const sql_insert_userInfo = "insert into user_info (user_id, sheet_id) VALUES ($1, $2)";
const sql_update_sheetId = "update user_info set sheet_id = $1 where user_id = $2";

class userInfo {
  constructor() {
    if (resource == null || resource == undefined) {
      resource = resource_spreadsheet;
    }
  }

  async asyncSearchUserRow(userId) {
    let crypt_userId = await crypto.createCipher(userId);

    let row;
    if (resource == resource_spreadsheet) {
      let rows = await spreadsheet.getRows(master_spread_id, "マスタ");
      row = await spreadsheet.searchRow(rows, crypt_userId, "userId");
    } else if (resource == resource_postgres) {
      let sqlParam = [crypt_userId];
      let ret = await pg.asyncSelect(sql_select_userInfo, sqlParam);
      if (ret.rows.length == 1) {
        row = new Object();
        row.userId = ret.rows[0].user_id;
        row.sheetId = ret.rows[0].sheet_id;
      }
    }
    return row;
  }

  async asyncSearchUserSheetId(userId) {
    let row = await this.asyncSearchUserRow(userId);
    if (row.hasOwnProperty('sheetId')) {
      return row.sheetId;
    } else {
      return null;
    }
  }

  async asyncInsertMasterInfo(userId, sheetId) {
    let crypt_userId = await crypto.createCipher(userId);
    if (resource == resource_spreadsheet) {
      let row = new Object();
      row.userId = crypt_userId;
      row.sheetId = sheetId;

      spreadsheet.addRow(master_spread_id, "マスタ", row);
    } else if (resource == resource_postgres) {
      let sqlParam = [crypt_userId, sheetId];
      await pg.asyncUpdate(sql_insert_userInfo, sqlParam);
    }
  }

  async asyncUpdateMasterInfo(userId, sheetId) {
    let crypt_userId = await crypto.createCipher(userId);
    if (resource == resource_spreadsheet) {
      let rows = await spreadsheet.getRows(master_spread_id, "マスタ");
      let row = await spreadsheet.searchRow(rows, crypt_userId, "userId");
      row.sheetId = sheetId;
      await row.save();
    } else if (resource == resource_postgres) {
      let sqlParam = [sheetId, crypt_userId];
      await pg.asyncUpdate(sql_update_sheetId, sqlParam);
    }
  }

}

module.exports = new userInfo();