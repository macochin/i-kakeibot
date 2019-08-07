"use strict";

const GoogleSpreadsheet = require('google-spreadsheet');
var async = require("async");

class SkillSample {
  async run(event, bot) {
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
        function getInfoAndWorksheets(step) {
          doc.getInfo(function(err, info) {
            sheet = info.worksheets[0];
            step();
          });
        },
        function workingWithCells(step) {
          sheet.getCells({
            'min-row': 1,
            'max-row': 5,
            'return-empty': true
          }, function(err, cells) {
            var cell = cells[0];
            console.log('Cell R'+cell.row+'C'+cell.col+' = '+cell.value);

            // cells have a value, numericValue, and formula
            cell.value == '1'
            cell.numericValue == 1;
            cell.formula == '=ROW()';

            // updating `value` is "smart" and generally handles things for you
            cell.value = 123;
            cell.value = '=A1+B2'
            cell.save(); //async

            // bulk updates make it easy to update many cells at once
            cells[0].value = 1;
            cells[1].value = 2;
            cells[2].formula = '=A1+B1';
            sheet.bulkUpdateCells(cells); //async

            step();
          });
        }
      ],
      function(err) {
        if (err) {
          console.log("Error: " + err);
        }
      }
    );

    // TODO:debug
    return bot.replyMessage(event.replyToken, {
      type: "text",
      text: "テスト中..."
    });
  }
}

module.exports = new SkillSample();