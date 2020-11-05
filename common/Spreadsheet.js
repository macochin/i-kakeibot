'use strict';
const { timingSafeEqual } = require('crypto');
// GCPでサービスキーを発行すること
// Google SperadSheet のAPIを有効化すること

const {GoogleSpreadsheet} = require('google-spreadsheet');

// TODO:methodの整理が必要(認証アリ、シートありき)
class Spreadsheet {

  async authDoc(sheetId) {
    let doc = new GoogleSpreadsheet(sheetId);
    let creds = {
      client_email: process.env.GOOGLE_AUTH_EMAIL,
      private_key: process.env.GOOGLE_AUTH_PRIVATE_KEY // \nは改行して登録
    };

    await doc.useServiceAccountAuth(creds);
    await doc.loadInfo();
    return doc;
  }

  async getSheet(sheetId, workSheetName) {
    let doc = await this.authDoc(sheetId);
    let sheet = null;
    for (let index = 0; index < doc.sheetsByIndex.length; index++) {
      if (doc.sheetsByIndex[index].title == workSheetName) {
        sheet = doc.sheetsByIndex[index];
      }
    }

    return sheet;
  }

  async createSheet(sheetId, sheetName, header, rowSize, columnSize) {
    let doc = await this.authDoc(sheetId);
    let sheet = await doc.addSheet({title: sheetName});
    await sheet.resize({ rowCount: rowSize, columnCount: columnSize });
    await sheet.setHeaderRow(header);
    return sheet;
  }

  async getRows(sheetId, workSheetName) {
    let sheet = await this.getSheet(sheetId, workSheetName);
    let rows = await sheet.getRows();
    return rows;
  }

  async addRow(sheetId, workSheetName, row) {
    let sheet = await this.getSheet(sheetId, workSheetName);
    sheet.addRow(row);
  }

  async maxRowSize(sheetId, workSheetName) {
    let rows = await this.getRows(sheetId, workSheetName);
    return rows.length;
  }

  // 以降の処理は、getSheet,getRows,(authDoc)が既に呼ばれている前提
  async searchRow(rows, strSearch, searchProperty) {
    return rows.find(function(searchRow, index){
      return (searchRow[`${searchProperty}`] === strSearch);
    });
  }

  async searchRowData(rows, searchProperty) {
    let list = new Array();
    rows.forEach(element => {
      list.push(element[`${searchProperty}`]);
    });

    let ret = Array.from(new Set(list))
    return ret;
  }

  async updateCell(sheet, targetCell, value) {
    await sheet.loadCells(targetCell);
    let cell = sheet.getCellByA1(targetCell);
    cell.value = value;
    await sheet.saveUpdatedCells();
  }

  async searchCell(sheet, targetCell) {
    await sheet.loadCells(targetCell);
    let cell = sheet.getCellByA1(targetCell);
    return cell.value;
  }
}

module.exports = new Spreadsheet();