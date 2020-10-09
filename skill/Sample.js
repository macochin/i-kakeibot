"use strict";

const expence = require("../service/expence")

class SkillSample {
  constructor() {
  }

  async run(event, bot) {
    let sheet = await expence.asyncSearchSheet(process.env.SENDER_ID);
    return bot.replyMessage(event.replyToken, {
      type: "text",
      text: "sample成功:" + sheet.title
    });
  }
}

module.exports = new SkillSample();