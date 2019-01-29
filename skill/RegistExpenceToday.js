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
          text: "カテゴリは？"
        });
      }
    }
  }
}

module.exports = new SkillRegistExpenceToday();