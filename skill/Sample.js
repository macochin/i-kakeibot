"use strict";

const GoogleSpreadsheet = require('google-spreadsheet');
var async = require("async");

class SkillSample {
  async run(event, bot) {
    let doc = new GoogleSpreadsheet(process.env.SPREDSHEET_ID);
    let creds = {
     client_email: process.env.GOOGLE_SPREAD_CLIENT_EMAIL
     , private_key: `${process.env.GOOGLE_SPREAD_PRIVATE_KEY}` // TODO:うまく読み込めていない。。。
//     , private_key: "-----BEGIN PRIVATE KEY-----\nMIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQCjYvazHYKeQEBp\nAjnXamV8Zz8C28a3ZIBKYz3t8NZCxOY9MZ69r/tbTyCC03nFvRhud7CbjDSUzOCW\nJ/s2Y8kZskZSEUGC7kLCwb3ki0bOygafg5k1OJ/7Dj/+eWOJCReu7VeTvPApnW8w\noVI6K/WTdwn2wFt7LCO3+onq87VvRys7T9YC1Ph4dwCNHUSnfywFLUyNO3NZk3LW\nuctBd7U0iw23ruBuIQH3uIo+oqYExJkSjSODa4ClboAnYK9wFHF8xLnYP9ZFACVt\nnzW/wJgH7YXrqgigVM6NPXg8WJC6SoI2yfzTMeuHgmoR1I4FYtDoFrSzJoClxk1v\ncI4l9/rZAgMBAAECgf9fGDp+Ba8AbGUQuTrxJfvrbCxAfaorE1OX+CsTUhliwzc+\nZqL9xG+HtYY2nt9BN84AfalM3027TYNp4dtUzL8/NYO4QFLg4cv5jsn3Oxj7QpqY\nPP/u+gYjGSgl9ID6QVCHf5x5YH5nujn9E+fH8837Bk3GUC7ugcJIUonzNeVj3hkT\nON7vjszi8cyq8XIXBxpH1Msm46iq5IaaSxQop5SUWHt1ITSDawJKeWUdljUJ9/5p\nBRZFJNXesdAIWnZo9SkUaHnfXf06H9zmpfy5OJQiXoGNRatTDA3pmZ0lqKoxFpS1\nyeT0tjVW/rZFFgxsZ1AGw/wo2sQuGY7z8S4mohECgYEA4aCSGhkji/vyC7RKUVpj\nlD+8mjvLT86hTyOeqVkigdDkdLt43x46PWMOkk4uXe/4Si9heKXOzedXg5XQyWzw\ntR6b5u/plfByLC7mWEslQnHZuVs+9rdRwDzgUiW+Yz85QGkRdc6H7Rg0loq4uHno\noo6qTGQHzH3kykhttnkpm90CgYEAuWF+QaerATMUGZf6RbbRYfrQyK7C7wrbeMEp\nbLpm1H2MuD/iZZOOPxFBs+tUzQUIYtqOdtLoHT4JyX5gqJEFjDI6xK4wsLSS+TOI\n8ybvAMm166BDLGAMtsJahrzKm7J4vCL97otarZgwh3m16wFAN+tUVYnPzCZkie8r\n2Tu7GS0CgYEAn4Xnxov/lfmMKLpP0TUXMrndny6nkMWHR2znwNREkYQgAmiKDTZR\n9xUSOF8OaVxBMDJPt/2DOhFWzrId7EwZ4/TARYdan6hhENwYAFUhAtl8FpFs8wKp\nykFAWNRWx9TrpZ6juadMc1Wp2MY71DJdSJGV1mzjFrHsERkkeN8xjAECgYEApHf6\nrAU1kjre+lX7lR49ZdBAq8tg5vObA+db+TrnQF6jGlSTZ8shyJJm2FlRQxPT/OAq\nxQEZLdh8lmepGeSQJ3Ho8dYZHK0YOD+goRlJsklDPWlSL2yH2x1Tc3bLypbsxv3E\njH7WVG1RoOA6peTWNMZ0a+94jIcDa9zl6jU0KYECgYBag+CyKrMpzS00Zy8SGS+2\nB8HvjUleL0LlN2tPgoUhKPgX9yLxm1ykToAcHE8QBjK3S+ifWdHqYHrOEmMAzVlp\nbUBm/mRG7RWoPh4iD7Lk0MM8feRPPgAdtr3XwzCJJLuutXdsGFDJAvegrXzJxjV6\nphKCwVfDD5L0ukqQVjlrSQ==\n-----END PRIVATE KEY-----\n"
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