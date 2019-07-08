"use strict";
class SkillSample {
  async run(event, bot) {
    return bot.replyMessage(event.replyToken, {
      type: "text",
      text: "テスト中..."
    });
  }
}

module.exports = new SkillSample();