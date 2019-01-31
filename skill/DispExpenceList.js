"use strict";

const db = require("../service/postgres");
const sql_select_useDateYM = "select distinct to_char(usedate, 'yyyy/mm') as usedateYM from accountBook where sender_id = $1 order by usedateYM desc";

class SkillDispExpenceList {
  constructor() {
    this.ym = null;
  }

  async run(event, bot) {
    if (this.ym == null) {
      let sqlParam = [event.source.userId];
      let useDate_list = await db.asyncSelect(sql_select_useDateYM, sqlParam);

      if (useDate_list.rows.length == 0) {
        return bot.replyMessage(event.replyToken, {
          type: "text",
          text: "まだ登録されていません"
        });
      }

      let replyMessage = {
        type: "text",
        text: "いつを見る？",
        quickReply: {
          "items": []
        }
      };

      useDate_list.rows.forEach(element => {
        replyMessage.quickReply.items.push({
          "type": "action",
          "action": {
            "type": "message",
            "label": `${element.usedateYM}`,
            "text": `${element.usedateYM}`
          }
        });
      });

      return bot.replyMessage(event.replyToken, replyMessage);
    }
  }
}

module.exports = new SkillDispExpenceList();