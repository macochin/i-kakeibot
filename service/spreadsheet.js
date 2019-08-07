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
        function getInfoAndWorksheets(step) {
          doc.getInfo(function(err, info) {
            // シート名作成
            let targetDate = new Date(`${useDate} 00:00:00`);

            if (targetDate.getDate() < 20) {
              targetDate.setMonth(targetDate.getMonth() - 1);
            }

            let sheetName;
            sheetName = targetDate.getFullYear()
                        + ("00" + (targetDate.getMonth()+1)).slice(-2)
                        + "20-";
            targetDate.setMonth(targetDate.getMonth() + 1);
            sheetName += targetDate.getFullYear()
                        + ("00" + (targetDate.getMonth()+1)).slice(-2)
                        + "19";

            info.worksheets.forEach(element => {
              if (element.title == sheetName) {
                sheet = element;
              }
            });

            if (sheet == undefined) {
              // TODO:シート作成
              options = {
                "title": sheetName
                , "rowCount": 8
                , "colCount": 3
                , "headers": [
                  "日付", "収入", "支出", "概要", "未確定フラグ", "銀行フラグ", "銀行残額", "表示用"
                ]
              };
              doc.addWorksheet(options);
            }

            step();
          });
        },
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