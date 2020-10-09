"use strict";

const expence = require("../service/expence")

class SkillSample {
  constructor() {
  }

  async run(event, bot) {
    expence.asyncSearchSheet(process.env.SENDER_ID);
    return bot.replyMessage(event.replyToken, "sample成功");
  }
}

module.exports = new SkillSample();