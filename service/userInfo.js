'use strict';

const spreadsheet = require("../common/Spreadsheet");
const crypto = require('../common/crypto');

const master_spread_id = process.env.MASTER_SPREAD_ID;

var resource = process.env.RESOURCE_USER_INFO;
const resource_spreadsheet = "spread";
const resource_postgres = "postgres";

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
      // TODO:
    }
    return row;
  }

  async asyncSearchUserSheetId(userId) {
    let sheetId;
    if (resource == resource_spreadsheet) {
      let row = await this.asyncSearchUserRow(userId);
      sheetId = row.sheetId;
    } else if (resource == resource_postgres) {
      // TODO:
    }

    return sheetId;
  }

  async asyncInsertMasterInfo(userId, sheetId) {
    let crypt_userId = await crypto.createCipher(userId);
    if (resource == resource_spreadsheet) {
      let row = new Object();
      row.userId = crypt_userId;
      row.sheetId = sheetId;

      spreadsheet.addRow(master_spread_id, "マスタ", row);
    } else if (resource == resource_postgres) {
      // TODO:
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
      // TODO:
    }
  }

}

module.exports = new userInfo();