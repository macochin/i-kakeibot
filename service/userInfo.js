'use strict';

const spreadsheet = require("../common/Spreadsheet");
const crypto = require('../common/crypto');
const pg = require("../common/postgres");

const master_spread_id = process.env.MASTER_SPREAD_ID;

var resource = process.env.RESOURCE_USER_INFO;
const resource_spreadsheet = "spread";
const resource_postgres = "postgres";

const sql_select_userInfo = "select userId, sheetId from userInfo where userId = $1";
const sql_insert_userInfo = "insert into userInfo (userId, sheetId) VALUES ($1, $2)";
const sql_update_sheetId = "update userInfo set sheetId = $1 where userId = $2";

class userInfo {
  constructor() {
    if (resource == null || resource == undefined) {
      resource = resource_spreadsheet;
    }
  }

  async asyncSearchUserRow(userId) {
    let crypt_userId = await crypto.createCipher(userId);

    let row = new Object();
    if (resource == resource_spreadsheet) {
      let rows = await spreadsheet.getRows(master_spread_id, "マスタ");
      row = await spreadsheet.searchRow(rows, crypt_userId, "userId");
    } else if (resource == resource_postgres) {
      // TODO:
      let sqlParam = [crypt_userId];
      let ret = await pg.asyncSelect(sql_select_userInfo, sqlParam);
      console.debug("Object.getOwnPropertyNames(ret.rows):" + Object.getOwnPropertyNames(ret.rows));// TODO:
      console.debug("Object.getOwnPropertyNames(ret.rows):" + Object.getOwnPropertyNames(ret.rows[0]));// TODO:
      if (ret.rows.length == 1) {
        row.userId = ret.rows[0].userId;
        row.sheetId = ret.rows[0].sheetId;
      }
    }
    return row;
  }

  async asyncSearchUserSheetId(userId) {
    let row = await this.asyncSearchUserRow(userId);
    return row.sheetId;
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