"use strict";

const db = require("../service/postgres");

class SkillRegistExpence {
  constructor() {
    this.money = null;
    this.category = null;
  }

  async run(event, bot) {
    let message_text = event.message.text;

    if (this.money == null) {
      var regex = new RegExp(/^[0-9]+$/);
      if (!regex.test(message_text)) {
        return bot.replyMessage(event.replyToken, {
          type: "text",
          text: "金額を入力してください。"
        });
      } else {
        this.money = message_text;
        return bot.replyMessage(event.replyToken, {
          type: "text",
          text: "カテゴリは？",
          quickReply: {
            "items": [
              // TODO:DBから取得したカテゴリをセットs
              {
                "type": "action",
                "action": {
                  "type": "message",
                  "label": "ランチ",
                  "text": "ランチ"
                }
              },
              {
                "type": "action",
                "action": {
                  "type": "message",
                  "label": "漫画",
                  "text": "漫画"
                }
              }
            ]
          }
        });
      }
    }

    if (this.category == null && message_text != "") {
      this.category = message_text;
    }

    if (this.money != null && this.category != null) {
      let return_message = `以下で登録します。\n${db.getNowYMD()}\n${this.money}円\n${message_text}`;
      this.money = null;
      this.category = null;
      // TODO:DBに登録

      return bot.replyMessage(event.replyToken, {
        type: "text",
        text: return_message
      });
    }
  }
}

module.exports = new SkillRegistExpence();