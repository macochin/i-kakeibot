'use strict';

const spreadsheet = require("../common/Spreadsheet");
const utils = require("../common/CommonUtils");
const userInfo = require("../service/userInfo");

class expence {
  constructor() {
  }

  // シート検索/作成
  async asyncSearchSheet(userId) {
    let sheetId = await userInfo.asyncSearchUserSheetId(userId);
    let sheet = await spreadsheet.getSheet(sheetId, utils.getNowYYYYMM());
    if (sheet == null) {
      let header = ['date', 'expence', 'category', '⇐ ※この行は変更しないでください'];
      sheet = await spreadsheet.createSheet(sheetId, utils.getNowYYYYMM(), header, 5, 4);

      let row = new Object();
      row.date = "日付";
      row.expence = "支出";
      row.category = "概要";
      sheet.addRow(row);
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

  // カテゴリ取得
  async asyncGetCategoryList(userId) {
    let sheet = await this.asyncSearchSheet(userId);
    let list;
    if (sheet != null) {
      let sheetId = await userInfo.asyncSearchUserSheetId(userId);
      let rows = await spreadsheet.getRows(sheetId, utils.getNowYYYYMM());
      list = await spreadsheet.searchRowData(rows, 'category');
    }
    return list;
  }
}

module.exports = new expence();