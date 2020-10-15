"use strict";

const expence = require("../service/expence");

class SkillDispExpenceList {
  constructor() {
  }

  async run(event, bot) {
    let sheetId = await expence.asyncSearchUserSheetId(event.source.userId);
    // TODO:スプレッドシートのURLを返す(テンプレートorFlex)
    let spread_url = "https://docs.google.com/spreadsheets/d/" + sheetId;
    let replyMessage = {
      type: "template",
      "altText": "支出一覧表示",
      "template": {
        "type": "buttons",
        "text": "支出一覧表示",
        "actions": [
            {
              "type": "uri",
              "label": "開く",
              "uri": spread_url
            }
        ]
      }
    };

    return bot.replyMessage(event.replyToken, replyMessage);
  }
}

module.exports = new SkillDispExpenceList();