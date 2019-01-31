"use strict";

const db = require("../service/postgres");
const sql_select_category = "select distinct category accountBook where sender_id = $1 order by update_date desc";
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

      let replyMessage = {
        type: "text",
        text: "カテゴリは？",
        quickReply: {
          "items": []
        }
      };

      // TODO:DBから取得したカテゴリをセット(最近使用したもの順にソート)
      let sqlParam = [event.source.userId];
      let category_list = await db.asyncSelect(sql_select_category, sqlParam);
      category_list.rows.forEach(element => {
        replyMessage.quickReply.items.push({
          "type": "action",
          "action": {
            "type": "message",
            "label": `${element.category}`,
            "text": `${element.category}`
          }
        });
      });

      // TODO:DBから取得できない場有はデフォルト値をセット

      return bot.replyMessage(event.replyToken, replyMessage);
    }

    if (this.category == null && message_text != "") {
      this.category = message_text;
    }

    if (this.date != null && this.money != null && this.category != null) {
      let sqlParam = [event.source.userId, this.date, this.money, this.category, db.getNowDate(), db.getNowDate()];
      db.asyncUpdate(sql_insert_expence, sqlParam);

      let return_message = `以下で登録します。\n${this.date}\n${this.money}円\n${this.category}`;
      this.date = null;
      this.money = null;
      this.category = null;

      return bot.replyMessage(event.replyToken, {
        type: "text",
        text: return_message
      });
    }
  }
}

module.exports = new SkillRegistExpence();