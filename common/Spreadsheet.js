'use strict';
// GCPでサービスキーを発行すること
// Google SperadSheet のAPIを有効化すること

const {GoogleSpreadsheet} = require('google-spreadsheet');

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

  async createSheet(sheetId, sheetName, header) {
    let doc = await this.authDoc(sheetId);
    let sheet = await doc.addSheet({title: sheetName});
    // ヘッダ追加
    await sheet.setHeaderRow(header);
    return sheet;
  }

  async addRow(sheetId, workSheetName, row) {
    let sheet = await this.getSheet(sheetId, workSheetName);
    await sheet.addRow(row);
  }

  async updateCell(sheetId, workSheetName, targetCell, value) {
    let sheet = await this.getSheet(sheetId, workSheetName);
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
    console.debug("rows:" + rows);// TODO:
    console.debug("rows.length:" + rows.length);// TODO:

    let list = new Array();
    for (let index = 0; index < rows.length; index++) {
      list.push(rows[index][`${searchProperty}`]);
    }
    return Array.from(new Set(list))
  }

  async searchCell(sheetId, workSheetName, targetCell) {
    let sheet = await this.getSheet(sheetId, workSheetName);
    await sheet.loadCells(targetCell);
    let cell = sheet.getCellByA1(targetCell);
    return cell.value;
  }

  async getRows(sheetId, workSheetName) {
    let sheet = await this.getSheet(sheetId, workSheetName);
    let rows = await sheet.getRows();
    return rows;
  }

  async maxRowSize(sheetId, workSheetName) {
    let rows = await this.getRows(sheetId, workSheetName);
    return rows.length;
  }
}

module.exports = new Spreadsheet();