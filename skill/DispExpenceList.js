"use strict";

const expence_spread_id = process.env.EXPENCE_SPREAD_ID;// TODO:一旦固定でコーディング

class SkillDispExpenceList {
  constructor() {
  }

  async run(event, bot) {
    // TODO:スプレッドシートのURLを返す(テンプレートorFlex)
    let spread_url = "https://docs.google.com/spreadsheets/d/" + expence_spread_id;
    let replyMessage = {
      type: "template",
      "altText": "支出一覧表示",
      "template": {
        "type": "buttons",
        "title": "支出一覧表示",
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