'use strict';

const spreadsheet = require("../common/Spreadsheet");
const crypto = require('../common/crypto');

const master_spread_id = process.env.MASTER_SPREAD_ID;

class userInfo {
  constructor() {
  }

  async asyncSearchUserRow(userId) {
    let crypt_userId = await crypto.createCipher(userId);
    let rows = await spreadsheet.getRows(master_spread_id, "マスタ");
    let row = await spreadsheet.searchRow(rows, crypt_userId, "userId");
    return row;
  }

  async asyncSearchUserSheetId(userId) {
    let row = await this.asyncSearchUserRow(userId);
    return row.sheetId;
  }

  async asyncInsertMasterInfo(userId, sheetId) {
    let crypt_userId = await crypto.createCipher(userId);

    let row = new Object();
    row.userId = crypt_userId;
    row.sheetId = sheetId;

    spreadsheet.addRow(master_spread_id, "マスタ", row);
  }

  async asyncUpdateMasterInfo(userId, sheetId) {
    let crypt_userId = await crypto.createCipher(userId);
    let rows = await spreadsheet.getRows(master_spread_id, "マスタ");
    let row = await spreadsheet.searchRow(rows, crypt_userId, "userId");
    row.sheetId = sheetId;
    await row.save();
  }

}

module.exports = new userInfo();