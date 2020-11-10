"use strict";

const expence = require("../service/expence");

class SkillRegistExpence {
  constructor() {
    this.date = null;
    this.money = null;
    this.category = null;
    this.other = null;
  }

  async run(event, bot) {
    let message_text = event.message.text;

    let registValue = [];
    let str = message_text.split("\n");
    str.forEach(element => {
      registValue.push(element.split(":")[1]);
    });
    this.date = registValue[1];
    this.money = registValue[2];
    this.category = registValue[3];
    this.other = registValue[4];

    expence.asyncInsertExpence(event.source.userId, this.money, this.category, this.date, this.other);

    let return_message = `以下で登録します。\n${this.date}\n${this.money.replace( /(\d)(?=(\d\d\d)+(?!\d))/g, '$1,')}円\n${this.category}`;
    this.date = null;
    this.money = null;
    this.category = null;

    return bot.replyMessage(event.replyToken, {
      type: "text",
      text: return_message
    });
  }
}

module.exports = new SkillRegistExpence();