"use strict";

const postgres = require("../service/postgres");// TODO:delete
const expence = require("../service/expence");

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

      // DBから取得したカテゴリをセット(最近使用したもの順にソート)
      let sqlParam = [event.source.userId];
      let category_list = await postgres.asyncSelectCategory(sqlParam);// TODO:delete
      if (category_list.rows.length == 0) {
        // DBから取得できない場有はデフォルト値をセット
        replyMessage.quickReply.items.push({
          "type": "action",
          "action": {
            "type": "message",
            "label": `ランチ`,
            "text": `ランチ`
          }
        });
        replyMessage.quickReply.items.push({
          "type": "action",
          "action": {
            "type": "message",
            "label": `マンガ`,
            "text": `マンガ`
          }
        });
        replyMessage.quickReply.items.push({
          "type": "action",
          "action": {
            "type": "message",
            "label": `日用品`,
            "text": `日用品`
          }
        });
      }

      // TODO:Quick Replyの数に制限あり？
      for (let index = 0; index < category_list.rows.length; index++) {
        replyMessage.quickReply.items.push({
          "type": "action",
          "action": {
            "type": "message",
            "label": `${category_list.rows[index].category}`,
            "text": `${category_list.rows[index].category}`
          }
        });

        if (index > 10) break;
      }

      // category_list.rows.forEach(element => {
      //   replyMessage.quickReply.items.push({
      //     "type": "action",
      //     "action": {
      //       "type": "message",
      //       "label": `${element.category}`,
      //       "text": `${element.category}`
      //     }
      //   });
      // });

      // TODO:14
      return bot.replyMessage(event.replyToken, replyMessage);
    }

    if (this.category == null && message_text != "") {
      this.category = message_text;
    }

    if (this.date != null && this.money != null && this.category != null) {
      let useDate = this.date.replace(/\//g, '-');

      // let sqlParam = [event.source.userId, useDate, this.money, this.category, postgres.getNowDate(), postgres.getNowDate()];
      // await postgres.asyncInsertExpence(sqlParam);// TODO:delete
      await expence.asyncInsertExpence(event.source.userId, this.money, this.category, useDate);

      let return_message = `以下で登録します。\n${useDate}\n${this.money.replace( /(\d)(?=(\d\d\d)+(?!\d))/g, '$1,')}円\n${this.category}`;
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