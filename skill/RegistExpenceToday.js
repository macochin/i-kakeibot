"use strict";

class SkillRegistExpenceToday {
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
              {
                "type": "action",
                "action": {
                  "type": "message",
                  "label": "メッセージ",
                  "text": "ランチ"
                }
              }, 
              {
                "type": "action",
                "action": {
                  "type": "datetimepicker",
                  "label": "日時選択",
                  "data": "datetime",
                  "mode": "datetime"
                }
              }
            ]
          }
        });
      }
    }

    if (this.category == null) {
      return bot.replyMessage(event.replyToken, {
        type: "text",
        text: `以下で登録します。\n${this.money}円\n${this.message_text}`
      });
    }
  }
}

module.exports = new SkillRegistExpenceToday();