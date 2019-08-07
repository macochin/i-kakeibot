'use strict';

const GoogleSpreadsheet = require('google-spreadsheet');
var async = require("async");

class ServiceSpreadsheet {
  async asyncInsertExpence(sqlParam, userId, useDate) {
    // TODO:スプレッドシートIDはDBから取得するようにする
    let doc = new GoogleSpreadsheet(process.env.SPREDSHEET_ID);
    let creds = {
      client_email: process.env.GOOGLE_SPREAD_CLIENT_EMAIL
      , private_key: process.env.GOOGLE_SPREAD_PRIVATE_KEY // \nは改行して登録
    };

    var sheet; //スプレッドシート

    async.series(
      [
        function setAuth(step) {
          doc.useServiceAccountAuth(creds, step);
        },
        // TODO:シートチェック
        // TODO:無ければ作成(フォーマットコピー)

        // TODO:行追加

        // let sqlParam = [event.source.userId, this.date.replace(/\//g, '-'), this.money, this.category, db.getNowDate(), db.getNowDate()];
        // TODO:値登録
      ],
      function(err) {
        if (err) {
          console.log("Error: " + err);
        }
      }
    );
  }
}

module.exports = new ServiceSpreadsheet();