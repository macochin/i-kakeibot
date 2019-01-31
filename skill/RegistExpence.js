"use strict";

const db = require("../service/postgres");
const sql_insert_expence = "INSERT INTO accountBook (sender_id, useDate, money, category, insert_date, update_date) VALUES ($1, $2, $3, $4, $5, $6)";

class SkillRegistExpence {
  constructor() {
    this.date = null;
    this.money = null;
    this.category = null;
  }

  async run(event, bot) {
    let message_text = event.message.text;

    if (this.date == null && this.money == null) {
      let registValue = [];
      let str = message_text.split("\n");
      str.forEach(element => {
        registValue.push(element.split(":")[1]);
      });
      this.date = registValue[1];
      this.money = registValue[2];

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

    if (this.category == null && message_text != "") {
      this.category = message_text;
    }

    if (this.date != null && this.money != null && this.category != null) {
      let return_message = `以下で登録します。\n${this.date}\n${this.money}円\n${message_text}`;
      this.date = null;
      this.money = null;
      this.category = null;
      // TODO:DBに登録
      let sqlParam = [event.source.userId, this.date, this.money, this.category, db.getNowDate, db.getNowDate];
      db.asyncUpdate(sql_insert_expence, sqlParam);

      return bot.replyMessage(event.replyToken, {
        type: "text",
        text: return_message
      });
    }
  }
}

module.exports = new SkillRegistExpence();