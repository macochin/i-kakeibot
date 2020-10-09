'use strict';

const spreadsheet = require("../common/Spreadsheet");
const utils = require("../common/CommonUtils");

const expence_spread_id = process.env.EXPENCE_SPREAD_ID;// TODO:一旦固定でコーディング

class expence {
  constructor() {
  }

  // シート検索/作成
  async asyncSearchSheet(userId) {
    let sheet = await spreadsheet.getSheet(expence_spread_id, utils.getNowYYYYMM());// TODO:debug
    if (sheet == null) {
      let header = ['date', 'expence', 'category'];
      sheet = await spreadsheet.createSheet(expence_spread_id, utils.getNowYYYYMM(), header);
    }

    return sheet;
  }

  // TODO:対象シートへの追記
  async asyncInsertExpence(userId, money, category) {
    let sheet = await this.asyncSearchSheet(userId);

    let row = new Object();
    row.date = utils.getNowYYYYMMDDFormat();
    row.expence = money;
    row.category = category;

    await await sheet.addRow(row);

    return row;
  }

  // TODO:delete
  // async asyncSelectOwner(userId) {
  //   if (resource == 'spread') {
  //     return await spreadsheet.searchRow(master_spread_id, 'ユーザマスタ', userId, "sender_id");
  //   } else {
  //     let ownerInfo = await postgres.asyncSelectOwner(userId);
  //     if (ownerInfo.rows.length == 0) {
  //       return undefined;
  //     }
  //     return ownerInfo.rows[0];
  //   }
  // }

  // async asyncInsertOwner(userId) {
  //   if (resource == 'spread') {
  //     let rowSize = await spreadsheet.maxRowSize(master_spread_id, 'ユーザマスタ');
  //     if (rowSize == undefined) {
  //       rowSize = 1;
  //     }

  //     let row = new Object();
  //     row.owner_id = rowSize + 1;
  //     row.sender_id = userId;
  //     row.insert_date = utils.getNowDate();
  //     row.update_date = utils.getNowDate();

  //     await spreadsheet.addRow(master_spread_id, 'ユーザマスタ', row);

  //     return row;
  //   } else {
  //     await postgres.asyncInsertOwner(userId);
  //     return await postgres.asyncSelectOwner(userId);
  //   }
  // }
}

module.exports = new expence();