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
            // TODO:シート名作成
            let targetDate = new Date(`${useDate} 00:00:00`);

            if (targetDate.getDate() < 20) {
              targetDate.setMonth(targetDate.getMonth - 1);
            }

            console.debug("targetDate.getFullYear():" + targetDate.getFullYear());// TODO:
            console.debug("targetDate.getMonth:" + ("00" + (targetDate.getMonth())).slice(-2));// TODO:

            let sheetName;
            sheetName = targetDate.getFullYear()
                        + ("00" + (targetDate.getMonth())).slice(-2)
                        + "20-";
            targetDate.setMonth(targetDate.getMonth() + 1);
            sheetName += targetDate.getFullYear()
                        + ("00" + (targetDate.getMonth())).slice(-2)
                        + "19";

            console.debug("sheetName:" + sheetName);// TODO:

            info.worksheets.forEach(element => {
              if (element.title == sheetName) {
                sheet = element;
                console.debug("sheet:" + sheet.title);// TODO:
              }
            });
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