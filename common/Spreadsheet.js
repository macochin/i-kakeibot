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

  async getSheet(doc, workSheetName) {
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

  async addRow(sheetId, workSheetName, row) {
    let doc = await this.authDoc(sheetId);
    let sheet = await this.getSheet(doc, workSheetName);
    sheet.addRow(row);
  }

  async updateCell(sheetId, workSheetName, targetCell, value) {
    let doc = await this.authDoc(sheetId);
    let sheet = await this.getSheet(doc, workSheetName);
    await sheet.loadCells(targetCell);
    let cell = sheet.getCellByA1(targetCell);
    cell.value = value;
    await sheet.saveUpdatedCells();
  }

  async searchRow(sheetId, workSheetName, strSearch, searchProperty) {
    let rows = await this.getRows(sheetId, workSheetName);

    return rows.find(function(searchRow, index){
      return (searchRow[`${searchProperty}`] === strSearch);
    });
  }

  async searchRowData(sheetId, workSheetName, searchProperty) {
    let rows = await this.getRows(sheetId, workSheetName);

    let list = new Array();
    rows.forEach(element => {
      list.push(element[`${searchProperty}`]);
    });

    let ret = Array.from(new Set(list))
    return ret;
  }

  async searchCell(sheetId, workSheetName, targetCell) {
    let doc = await this.authDoc(sheetId);
    let sheet = await this.getSheet(doc, workSheetName);
    await sheet.loadCells(targetCell);
    let cell = sheet.getCellByA1(targetCell);
    return cell.value;
  }

  async getRows(sheetId, workSheetName) {
    let doc = await this.authDoc(sheetId);
    let sheet = await this.getSheet(doc, workSheetName);
    let rows = await sheet.getRows();
    return rows;
  }

  async maxRowSize(sheetId, workSheetName) {
    let rows = await this.getRows(sheetId, workSheetName);
    return rows.length;
  }
}

module.exports = new Spreadsheet();