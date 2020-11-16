"use strict";

const userInfo = require("../service/userInfo");

class SkillDispExpenceList {
  constructor() {
    this.userId = null;
  }

  async run(event, bot) {
    try {
      this.userId = event.source.userId;

      let sheetId = await userInfo.asyncSearchUserSheetId(event.source.userId);
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
    } catch (error) {
      console.error(error);
      throw new Error(this.userId);
    }
  }
}

module.exports = new SkillDispExpenceList();