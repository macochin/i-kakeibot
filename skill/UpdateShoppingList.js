"use strict";

const db = require("../service/postgres");

class SkillUpdateShoppingList {
  constructor() {
  }

  async run(event, bot) {
    let message_text = event.message.text;
    let registValue = [];
    let str = message_text.split("\n");
    str.forEach(element => {
      registValue.push(element.split(":")[1]);
    });
    registValue.shift();

    console.debug("registValue:" + registValue);// TODO:
    return bot.replyMessage(event.replyToken, {
      type: "text",
      text: "テスト中..."
    });
}
}

module.exports = new SkillUpdateShoppingList();