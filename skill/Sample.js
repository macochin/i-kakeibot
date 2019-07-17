"use strict";

const GoogleSpreadsheet = require('google-spreadsheet');

class SkillSample {
  async run(event, bot) {
    let book = new GoogleSpreadsheet(process.env.SPREDSHEET_ID);
    let creds = {
     client_email: process.env.GOOGLE_SPREAD_CLIENT_EMAIL
//     , private_key: process.env.GOOGLE_SPREAD_PRIVATE_KEY
      // TODO:
      , "type": "service_account",
      "project_id": "i-kakeibot-245510",
      "private_key_id": "7ed976e499d9455003598b3308500c0077717f29",
      "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQCjYvazHYKeQEBp\nAjnXamV8Zz8C28a3ZIBKYz3t8NZCxOY9MZ69r/tbTyCC03nFvRhud7CbjDSUzOCW\nJ/s2Y8kZskZSEUGC7kLCwb3ki0bOygafg5k1OJ/7Dj/+eWOJCReu7VeTvPApnW8w\noVI6K/WTdwn2wFt7LCO3+onq87VvRys7T9YC1Ph4dwCNHUSnfywFLUyNO3NZk3LW\nuctBd7U0iw23ruBuIQH3uIo+oqYExJkSjSODa4ClboAnYK9wFHF8xLnYP9ZFACVt\nnzW/wJgH7YXrqgigVM6NPXg8WJC6SoI2yfzTMeuHgmoR1I4FYtDoFrSzJoClxk1v\ncI4l9/rZAgMBAAECgf9fGDp+Ba8AbGUQuTrxJfvrbCxAfaorE1OX+CsTUhliwzc+\nZqL9xG+HtYY2nt9BN84AfalM3027TYNp4dtUzL8/NYO4QFLg4cv5jsn3Oxj7QpqY\nPP/u+gYjGSgl9ID6QVCHf5x5YH5nujn9E+fH8837Bk3GUC7ugcJIUonzNeVj3hkT\nON7vjszi8cyq8XIXBxpH1Msm46iq5IaaSxQop5SUWHt1ITSDawJKeWUdljUJ9/5p\nBRZFJNXesdAIWnZo9SkUaHnfXf06H9zmpfy5OJQiXoGNRatTDA3pmZ0lqKoxFpS1\nyeT0tjVW/rZFFgxsZ1AGw/wo2sQuGY7z8S4mohECgYEA4aCSGhkji/vyC7RKUVpj\nlD+8mjvLT86hTyOeqVkigdDkdLt43x46PWMOkk4uXe/4Si9heKXOzedXg5XQyWzw\ntR6b5u/plfByLC7mWEslQnHZuVs+9rdRwDzgUiW+Yz85QGkRdc6H7Rg0loq4uHno\noo6qTGQHzH3kykhttnkpm90CgYEAuWF+QaerATMUGZf6RbbRYfrQyK7C7wrbeMEp\nbLpm1H2MuD/iZZOOPxFBs+tUzQUIYtqOdtLoHT4JyX5gqJEFjDI6xK4wsLSS+TOI\n8ybvAMm166BDLGAMtsJahrzKm7J4vCL97otarZgwh3m16wFAN+tUVYnPzCZkie8r\n2Tu7GS0CgYEAn4Xnxov/lfmMKLpP0TUXMrndny6nkMWHR2znwNREkYQgAmiKDTZR\n9xUSOF8OaVxBMDJPt/2DOhFWzrId7EwZ4/TARYdan6hhENwYAFUhAtl8FpFs8wKp\nykFAWNRWx9TrpZ6juadMc1Wp2MY71DJdSJGV1mzjFrHsERkkeN8xjAECgYEApHf6\nrAU1kjre+lX7lR49ZdBAq8tg5vObA+db+TrnQF6jGlSTZ8shyJJm2FlRQxPT/OAq\nxQEZLdh8lmepGeSQJ3Ho8dYZHK0YOD+goRlJsklDPWlSL2yH2x1Tc3bLypbsxv3E\njH7WVG1RoOA6peTWNMZ0a+94jIcDa9zl6jU0KYECgYBag+CyKrMpzS00Zy8SGS+2\nB8HvjUleL0LlN2tPgoUhKPgX9yLxm1ykToAcHE8QBjK3S+ifWdHqYHrOEmMAzVlp\nbUBm/mRG7RWoPh4iD7Lk0MM8feRPPgAdtr3XwzCJJLuutXdsGFDJAvegrXzJxjV6\nphKCwVfDD5L0ukqQVjlrSQ==\n-----END PRIVATE KEY-----\n",
//      "client_email": "i-kakeibot-admin@i-kakeibot-245510.iam.gserviceaccount.com",
      "client_id": "110505104562289193348",
      "auth_uri": "https://accounts.google.com/o/oauth2/auth",
      "token_uri": "https://oauth2.googleapis.com/token",
      "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
      "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/i-kakeibot-admin%40i-kakeibot-245510.iam.gserviceaccount.com"
    };
    // let creds = require('../creds.json');// TODO:

    var spreadsheet; //スプレッドシート

    //認証を通しスプレッドシートの情報取得して外部スコープの変数に保存
    book.useServiceAccountAuth(creds, function(error) {
      if (error !== null) {
        throw new Error(error);
      }
      book.getInfo(function(error, data) {
        if (error !== null) {
          console.error("error:" + error);// TODO:
          throw new Error(error);
        }
        spreadsheet = data;
      });
    });

    for (let rcnt1 in spreadsheet.worksheets) {
      spreadsheet.worksheets[rcnt1].getRows({
        offset: 1, //何も指定しなければ2行目から読み込むので1を指定すると3行目から読み込む
        limit: 20, //途中で空白行が現れれば20行以下でも読み込み中止
      }, function(error, rows) {
        if (error !== null) {
          console.error("error:" + error);// TODO:
          throw new Error(error);
        }
        // TODO:書き込み
        rows[0].colname = 'new val';
        rows[0].save();
      });
    }

    // TODO:debug
    return bot.replyMessage(event.replyToken, {
      type: "text",
      text: "テスト中..."
    });
  }
}

module.exports = new SkillSample();