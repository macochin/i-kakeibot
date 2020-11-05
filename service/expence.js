'use strict';

const spreadsheet = require("../common/Spreadsheet");
const utils = require("../common/CommonUtils");
const userInfo = require("../service/userInfo");

const key_date = "日付";
const key_expence = "支出";
const key_category = "概要";

class expence {
  constructor() {
  }

  // シート検索/作成
  async asyncSearchSheet(userId) {
    let sheetId = await userInfo.asyncSearchUserSheetId(userId);
    let sheet = await spreadsheet.getSheet(sheetId, utils.getNowYYYYMM());
    if (sheet == null) {
      let header = ['日付', '支出', '概要', '⇐※この行は変更しないでください'];
      sheet = await spreadsheet.createSheet(sheetId, utils.getNowYYYYMM(), header, 5, 4);

      let cell_date = await spreadsheet.searchCell(sheet, "A1");
      cell_date.backgroundColor = "gray";

      let cell_expence = await spreadsheet.searchCell(sheet, "A1");
      cell_expence.backgroundColor = "gray";

      let cell_category = await spreadsheet.searchCell(sheet, "A1");
      cell_category.backgroundColor = "gray";

      sheet.saveUpdatedCells();
    }

    return sheet;
  }

  // 対象シートへの追記
  async asyncInsertExpence(userId, money, category, useDate) {
    let sheet = await this.asyncSearchSheet(userId);

    let row = new Object();
    row[key_date] = useDate;
    row[key_expence] = money;
    row[key_category] = category;

    sheet.addRow(row);
  }

  // カテゴリ取得
  async asyncGetCategoryList(userId) {
    let sheet = await this.asyncSearchSheet(userId);
    let list;
    if (sheet != null) {
      let sheetId = await userInfo.asyncSearchUserSheetId(userId);
      let rows = await spreadsheet.getRows(sheetId, utils.getNowYYYYMM());
      list = await spreadsheet.searchRowData(rows, key_category);
    }
    return list;
  }
}

module.exports = new expence();