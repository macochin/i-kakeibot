'use strict';

const spreadsheet = require("../common/Spreadsheet");
const utils = require("../common/CommonUtils");
const userInfo = require("../service/userInfo");

const key_date = "日付";
const key_expence = "支出";
const key_category = "買ったもの";
const key_other = "補足";
const key_caution = "⇐※変更禁止!!";
const key_sum_category = "";
const key_sum_expence = "";
const key_sum_expence_graph = "";

const column_date = "A";
const column_expence = "C";
const column_category = "B";
const column_other = "D";
const column_caution = "E";
const column_sum_category = "F";
const column_sum_expence = "G";
const column_sum_expence_graph = "H";

class expence {
  constructor() {
  }

  // シート検索/作成
  async asyncSearchSheet(sheetId) {
    let sheet = await spreadsheet.getSheet(sheetId, utils.getNowYYYYMM());
    if (sheet == null) {
      let header = [key_date, key_category, key_expence, key_other, key_caution, key_sum_category, key_sum_expence, key_sum_expence_graph];
      sheet = await spreadsheet.createSheet(sheetId, utils.getNowYYYYMM(), header, 5, 8);

      let cell_date = await spreadsheet.searchCell(sheet, `${column_date}1`);
      cell_date.backgroundColor = {"red": 0.2, "green": 0.4, "blue": 0.1};
      cell_date.textFormat = {
        "foregroundColor": {"red": 1.0, "green": 1.0, "blue": 1.0}, "bold": true
      };

      let cell_category = await spreadsheet.searchCell(sheet, `${column_category}1`);
      cell_category.backgroundColor = {"red": 0.2, "green": 0.4, "blue": 0.1};
      cell_category.textFormat = {
        "foregroundColor": {"red": 1.0, "green": 1.0, "blue": 1.0}, "bold": true
      };

      let cell_expence = await spreadsheet.searchCell(sheet, `${column_expence}1`);
      cell_expence.backgroundColor = {"red": 0.2, "green": 0.4, "blue": 0.1};
      cell_expence.textFormat = {
        "foregroundColor": {"red": 1.0, "green": 1.0, "blue": 1.0}, "bold": true
      };

      let cell_other = await spreadsheet.searchCell(sheet, `${column_other}1`);
      cell_other.backgroundColor = {"red": 0.2, "green": 0.4, "blue": 0.1};
      cell_other.textFormat = {
        "foregroundColor": {"red": 1.0, "green": 1.0, "blue": 1.0}, "bold": true
      };

      let cell_caution = await spreadsheet.searchCell(sheet, `${column_caution}1`);
      cell_caution.textFormat = {
        "foregroundColor": {"red": 1.0, "green": 0.0, "blue": 0.0}, "bold": true
      };

      // F列
      let cell_sum_category = await spreadsheet.searchCell(sheet, `${column_sum_category}1`);
      cell_sum_category.backgroundColor = {"red": 0.1, "green": 0.1, "blue": 0.4};
      cell_sum_category.textFormat = {
        "foregroundColor": {"red": 1.0, "green": 1.0, "blue": 1.0}, "bold": true
      };

      // G列
      let cell_sum_expence = await spreadsheet.searchCell(sheet, `${column_sum_expence}1`);
      cell_sum_expence.backgroundColor = {"red": 0.1, "green": 0.1, "blue": 0.4};
      cell_sum_expence.textFormat = {
        "foregroundColor": {"red": 1.0, "green": 1.0, "blue": 1.0}, "bold": true
      };

      // H列
      let cell_sum_expence_graph = await spreadsheet.searchCell(sheet, `${column_sum_expence_graph}1`);
      cell_sum_expence_graph.numberFormat = {"type": "NUMBER", "pattern": "#,###"};

      sheet.saveUpdatedCells();
    }

    return sheet;
  }

  // 対象シートへの追記
  async asyncInsertExpence(userId, money, category, useDate, other) {
    let sheetId = await userInfo.asyncSearchUserSheetId(userId);
    let sheet = await this.asyncSearchSheet(sheetId);

    let row = new Object();
    row[key_date] = useDate;
    row[key_expence] = money;
    row[key_category] = category;
    row[key_other] = other;

    await sheet.addRow(row);

    let index = (await sheet.getRows()).length + 1;

    let cell_expence = await spreadsheet.searchCell(sheet, `${column_expence}${index}`);
    cell_expence.numberFormat = {"type": "NUMBER", "pattern": "#,###"};

    await spreadsheet.updateCellFormula(sheet, 'F1', `=query(A:C,"select B,sum(C) where B is not null group by B label B 'sum買ったもの'",1)`);
    await spreadsheet.updateCellFormula(sheet, 'H1', '=SUM(G:G)');
    for (let i = 2; i < index; i++) {
      let cell_sum_expence = await spreadsheet.searchCell(sheet, `${column_sum_expence}${i}`);
      console.debug(`cell_sum_expence${i}:` + cell_sum_expence);// TODO:

      if (cell_sum_expence == null || cell_sum_expence == undefined || cell_sum_expence == '') {
        continue;
      }
      // TODO:セルフォーマット変更(G列数値フォーマット)
      cell_sum_expence.numberFormat = {"type": "NUMBER", "pattern": "#,###"};
      // TODO:グラフが無ければ追加(G列) =SPARKLINE(G2, {"charttype","bar";"max",MAX(G:G)})
      await spreadsheet.updateCellFormula(sheet, `${column_sum_expence_graph}${i}`, `=SPARKLINE(${column_sum_expence}${i}, {"charttype","bar";"max",MAX(G:G)})`);
    }

    sheet.saveUpdatedCells();
  }

  // カテゴリ取得
  async asyncGetCategoryList(userId) {
    let list = new Array();
    let sheetId = await userInfo.asyncSearchUserSheetId(userId);
    if(sheetId == undefined || sheetId == null) {
      return list;
    }

    let sheet = await this.asyncSearchSheet(sheetId);
    if (sheet != null) {
      let sheetId = await userInfo.asyncSearchUserSheetId(userId);
      let rows = await spreadsheet.getRows(sheetId, utils.getNowYYYYMM());
      list = await spreadsheet.searchRowData(rows, key_category);
    }
    return list;
  }
}

module.exports = new expence();