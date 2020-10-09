'use strict';

const spreadsheet = require("../common/Spreadsheet");
const utils = require("../common/CommonUtils");

const expence_spread_id = process.env.EXPENCE_SPREAD_ID;// TODO:一旦固定でコーディング

class expence {
  constructor() {
  }

  // シート検索/作成
  async asyncSearchSheet(userId) {
    let sheet = await spreadsheet.getSheet(expence_spread_id, utils.getNowYYYYMM());
    if (sheet == null) {
      let header = ['date', 'expence', 'category'];
      sheet = await spreadsheet.createSheet(expence_spread_id, utils.getNowYYYYMM(), header, 5, 3);
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

    await sheet.addRow(row);
  }

  // カテゴリ取得
  async asyncGetCategoryList(userId) {
    let sheet = await this.asyncSearchSheet(userId);
    let list;
    if (sheet != null) {
      list = await spreadsheet.searchRowData(expence_spread_id, utils.getNowYYYYMM(), 'category');
    }
    return list;
  }
}

module.exports = new expence();