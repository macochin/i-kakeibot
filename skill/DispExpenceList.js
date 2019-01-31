"use strict";

const db = require("../service/postgres");
const sql_select_useDateYM = "select distinct to_char(usedate, 'yyyy/mm') as usedate_ym from accountBook where sender_id = $1 order by usedate_ym desc";
const sql_select_expence_list = "select to_char(usedate, 'yyyy/mm/dd') as usedate_ymd, category ,money from accountBook where sender_id = $1 and  to_char(usedate, 'yyyy/mm') = $2 order by usedate, update_date";

class SkillDispExpenceList {
  constructor() {
  }

  async run(event, bot) {
    let message_text = event.message.text;

    if (message_text == "支出一覧表示") {
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
            "label": `${element.usedate_ym}`,
            "text": `${element.usedate_ym}`
          }
        });
      });

      return bot.replyMessage(event.replyToken, replyMessage);
    }

    let sqlParam = [event.source.userId, message_text];
    let expnece_list = await db.asyncSelect(sql_select_expence_list, sqlParam);

    let return_message = "";

    expnece_list.rows.forEach(element => {
      return_message += `${element.usedate_ymd} ${element.category} ${element.money}\n`
    });

    return bot.replyMessage(event.replyToken, {
      type: "text",
      text: return_message
    });
  }
}

module.exports = new SkillDispExpenceList();