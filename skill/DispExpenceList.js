"use strict";

const db = require("../service/postgres");
const sql_select_useDateYM = "select distinct to_char(usedate, 'yyyy/mm') as usedate_ym from accountBook where sender_id = $1 and to_char(usedate, 'yyyy/mm') != $2 order by usedate_ym desc";
const sql_select_expence_list = "select account_book_id, to_char(usedate, 'mm/dd') as usedate_md, category, money from accountBook where sender_id = $1 and to_char(usedate, 'yyyy/mm') = $2 order by usedate, update_date";
const sql_delete_expence = "delete from accountBook where sender_id = $1 and account_book_id = $2";

class SkillDispExpenceList {
  constructor() {
    this.target_ym = null;
    this.delete_flg = false;
  }

  async run(event, bot) {
    let message_text = event.message.text;
    if (message_text == "終了" || message_text == "キャンセル") {
      this.target_ym = null;
      this.delete_flg = false;
      return bot.replyMessage(event.replyToken, {
        type: "text",
        text: "終了します"
      });
    }

    if (this.target_ym != null && message_text == "支出削除") {
      this.delete_flg = true;
      let replyMessage = {
        type: "text",
        text: "どれを削除する？",
        quickReply: {
          "items": [
            {
              "type": "action",
              "action": {
                "type": "message",
                "label": `キャンセル`,
                "text": `キャンセル`
              }
            }
          ]
        }
      };

      let sqlParam = [event.source.userId, this.target_ym];
      let expnece_list = await db.asyncSelect(sql_select_expence_list, sqlParam);

      expnece_list.rows.forEach(element => {
        replyMessage.quickReply.items.push({
          "type": "action",
          "action": {
            "type": "message",
            "label": `${element.account_book_id}) ${element.usedate_md}\n${element.category}\n${element.money.toString().replace( /(\d)(?=(\d\d\d)+(?!\d))/g, '$1,')}円`,
            "text": `${element.account_book_id}) ${element.usedate_md}\n${element.category}\n${element.money.toString().replace( /(\d)(?=(\d\d\d)+(?!\d))/g, '$1,')}円`
          }
        });
      });

      return bot.replyMessage(event.replyToken, replyMessage);
    }

    if (this.delete_flg && message_text != "") {
      let str = message_text.split(") ");
      let sqlParam = [event.source.userId, str[0]];
      await db.asyncUpdate(sql_delete_expence, sqlParam);

      this.target_ym = null;
      this.delete_flg = false;
      return bot.replyMessage(event.replyToken, {
        type: "text",
        text: "削除しました。\n終了します"
      });
    }

    var regex = /^\d{4}\/\d{1,2}$/;
    if (message_text == "支出一覧表示") {
      this.target_ym = db.getNowYYYYMM();
    } else if (regex.test(message_text)) {
      this.target_ym = message_text;
    }

    let sqlParam = [event.source.userId, this.target_ym];
    let expnece_list = await db.asyncSelect(sql_select_expence_list, sqlParam);

    let replyMessage = {
      type: "text",
      text: "【支出一覧】",
      quickReply: {
        "items": [
          {
            "type": "action",
            "action": {
              "type": "message",
              "label": `終了`,
              "text": `終了`
            }
          }
        ]
      }
    };

    if (expnece_list.rows.length == 0) {
      replyMessage.text += `\n${this.target_ym}はまだ登録されていません。`
    } else {
      replyMessage.quickReply.items.push({
        "type": "action",
        "action": {
          "type": "message",
          "label": `支出削除`,
          "text": `支出削除`
        }
      });
    }

    expnece_list.rows.forEach(element => {
      replyMessage.text += `\n${element.usedate_md} ${element.category} ${element.money.toString().replace( /(\d)(?=(\d\d\d)+(?!\d))/g, '$1,')}円`
    });

    let useDate_list = await db.asyncSelect(sql_select_useDateYM, sqlParam);
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
}

module.exports = new SkillDispExpenceList();