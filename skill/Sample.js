"use strict";

const GoogleSpreadsheet = require('google-spreadsheet');

class SkillSample {
  async run(event, bot) {
    let book = new GoogleSpreadsheet(process.env.SPREDSHEET_ID);
    let creds = {
      client_email: process.env.GOOGLE_SPREAD_CLIENT_EMAIL
      , private_key: process.env.GOOGLE_SPREAD_PRIVATE_KEY
      // TODO:
      , private_key_id:"7ed976e499d9455003598b3308500c0077717f29"
      , client_id:"110505104562289193348"
    };
    // let creds = require('../creds.json');

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