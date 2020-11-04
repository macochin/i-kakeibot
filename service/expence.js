'use strict';

const spreadsheet = require("../common/Spreadsheet");
const utils = require("../common/CommonUtils");
const crypto = require('../common/crypto');

const master_spread_id = process.env.MASTER_SPREAD_ID;

class expence {
  constructor() {
  }

  async asyncSearchUserSheetId(userId) {
    let crypt_userId = await crypto.createCipher(userId);
    let row = await spreadsheet.searchRow(master_spread_id, "マスタ", crypt_userId, "userId");
    return row.sheetId;
  }

  async asyncSearchUserRow(userId) {
    let crypt_userId = await crypto.createCipher(userId);
    let row = await spreadsheet.searchRow(master_spread_id, "マスタ", crypt_userId, "userId");
    return row;
  }

  // シート検索/作成
  async asyncSearchSheet(userId) {
    let sheetId = await this.asyncSearchUserSheetId(userId);
    let sheet = await spreadsheet.getSheet(sheetId, utils.getNowYYYYMM());
    if (sheet == null) {
      let header = ['date', 'expence', 'category'];
      sheet = await spreadsheet.createSheet(sheetId, utils.getNowYYYYMM(), header, 5, 3);
    }

    return sheet;
  }

  // 対象シートへの追記
  async asyncInsertExpence(userId, money, category, useDate) {
    let sheet = await this.asyncSearchSheet(userId);

    let row = new Object();
    row.date = useDate;
    row.expence = money;
    row.category = category;

    sheet.addRow(row);
  }

  async asyncInsertMasterInfo(crypt_userId, sheetId) {
    let row = new Object();
    row.userId = crypt_userId;
    row.sheetId = sheetId;

    spreadsheet.addRow(master_spread_id, "マスタ", row);
  }

  async asyncUpdateMasterInfo(crypt_userId, sheetId) {
    let sheet = await this.asyncSearchSheet(userId);
    let row = await spreadsheet.searchRowBySheet(sheet, crypt_userId, "userId");
    row.sheetId = sheetId;
    sheet.saveUpdatedCells();
  }

  // カテゴリ取得
  async asyncGetCategoryList(userId) {
    let sheet = await this.asyncSearchSheet(userId);
    let list;
    if (sheet != null) {
      let sheetId = await this.asyncSearchUserSheetId(userId);
      list = await spreadsheet.searchRowData(sheetId, utils.getNowYYYYMM(), 'category');
    }
    return list;
  }
}

module.exports = new expence();