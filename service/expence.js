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
  async asyncSearchSheet(sheetId) {
    let sheet = await spreadsheet.getSheet(sheetId, utils.getNowYYYYMM());
    if (sheet == null) {
      let header = ['日付', '支出', '概要', '⇐※この行は変更しないでください'];
      sheet = await spreadsheet.createSheet(sheetId, utils.getNowYYYYMM(), header, 5, 4);
      // sheet.updateDimensionProperties("COLUMNS", {"pixelSize":300}, {"startIndex":3, "endIndex":3});

      let cell_date = await spreadsheet.searchCell(sheet, "A1");
      cell_date.backgroundColor = {"red": 0.2, "green": 0.4, "blue": 0.1};
      cell_date.textFormat = {
        "foregroundColor": {"red": 1.0, "green": 1.0, "blue": 1.0}, "bold": true
      };

      let cell_expence = await spreadsheet.searchCell(sheet, "B1");
      cell_expence.backgroundColor = {"red": 0.2, "green": 0.4, "blue": 0.1};
      cell_expence.textFormat = {
        "foregroundColor": {"red": 1.0, "green": 1.0, "blue": 1.0}, "bold": true
      };

      let cell_category = await spreadsheet.searchCell(sheet, "C1");
      cell_category.backgroundColor = {"red": 0.2, "green": 0.4, "blue": 0.1};
      cell_category.textFormat = {
        "foregroundColor": {"red": 1.0, "green": 1.0, "blue": 1.0}, "bold": true
      };

      let cell_other = await spreadsheet.searchCell(sheet, "D1");
      cell_other.textFormat = {
        "foregroundColor": {"red": 1.0, "green": 0.0, "blue": 0.0}, "bold": true
      };
      sheet.saveUpdatedCells();
    }

    return sheet;
  }

  // 対象シートへの追記
  async asyncInsertExpence(userId, money, category, useDate) {
    let sheetId = await userInfo.asyncSearchUserSheetId(userId);
    let sheet = await this.asyncSearchSheet(sheetId);

    let row = new Object();
    row[key_date] = useDate;
    row[key_expence] = money;
    row[key_category] = category;

    await sheet.addRow(row);

    let index = (await sheet.getRows()).length + 1;

    let cell_expence = await spreadsheet.searchCell(sheet, `B${index}`);
    cell_expence.numberFormat = {"type": "NUMBER", "pattern": "#,###"};

    sheet.saveUpdatedCells();
  }

  // カテゴリ取得
  async asyncGetCategoryList(userId) {
    let sheetId = await userInfo.asyncSearchUserSheetId(userId);
    let sheet = await this.asyncSearchSheet(sheetId);
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