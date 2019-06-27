"use strict";

const db = require("../service/db");

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
      let expnece_list = await db.asyncSelectExpenceList(sqlParam);

      let pre_md = "";
      let count = 1;
      for (let index = 0; index < expnece_list.rows.length; index++) {
        let element = expnece_list.rows[index];
        let label = element.usedate_md;
        if (element.usedate_md == pre_md) {
          count++;
          label += `\(${count}\)`
        } else {
          count = 1;
        }

        replyMessage.quickReply.items.push({
          "type": "action",
          "action": {
            "type": "message",
            "label": `${label}`,
            "text": `${element.account_book_id}) ${element.usedate_md}\n${element.category} ${element.money.toString().replace( /(\d)(?=(\d\d\d)+(?!\d))/g, '$1,')}円`
          }
        });
        pre_md = element.usedate_md;

        if (index > 10) break;
      }

      return bot.replyMessage(event.replyToken, replyMessage);
    }

    if (this.delete_flg && message_text != "") {
      let str = message_text.split(") ");
      let sqlParam = [event.source.userId, str[0]];
      await db.asyncDeleteExpence(sqlParam);

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
    let expnece_list = await db.asyncSelectExpenceList(sqlParam);

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

    let pre_md = "";
    let count = 1;
    expnece_list.rows.forEach(element => {
      replyMessage.text += `\n${element.usedate_md}`;
      if (element.usedate_md == pre_md) {
        count++;
        replyMessage.text += `\(${count}\)`
      } else {
        count = 1;
      }
      replyMessage.text += ` ${element.category} ${element.money.toString().replace( /(\d)(?=(\d\d\d)+(?!\d))/g, '$1,')}円`
      pre_md = element.usedate_md;
    });

    let useDate_list = await db.asyncSelectUseDateYM(sqlParam);

    for (let index = 0; index < useDate_list.rows.length; index++) {
      let element = useDate_list.rows[index];
      replyMessage.quickReply.items.push({
        "type": "action",
        "action": {
          "type": "message",
          "label": `${element.usedate_ym}`,
          "text": `${element.usedate_ym}`
        }
      });

      if (index > 10) break;
    }

    return bot.replyMessage(event.replyToken, replyMessage);
  }
}

module.exports = new SkillDispExpenceList();