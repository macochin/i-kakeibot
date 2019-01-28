"use strict";

class SkillCreateShoppingList {
  constructor() {
    // TODO:
  }

  async run(event, bot) {
    let message_text = `毎度！ご注文は？`;
    return bot.replyMessage(event.replyToken, {
        type: "text",
        text: message_text
    });
  }
}

module.exports = new SkillCreateShoppingList();
