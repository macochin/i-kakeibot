"use strict";

const db = require("../service/postgres");

const sql_select_shopping_name_list = "select shopping_name, max(update_date) as max_update_date from shoppingList where sender_id = $1 and plan_to_buy_flg = false group by shopping_name order by max_update_date desc";
const sql_exit_shopping_name = "select shopping_name from shoppingList where sender_id = $1 and shopping_name = $2";
const sql_insert_shoppingList = "INSERT INTO shoppingList (sender_id, shopping_name, plan_to_buy_flg, insert_date, update_date) VALUES ($1, $2, true, $3, $4)";
const sql_update_shoppingList = "update shoppingList set plan_to_buy_flg = true, update_date = $1 where sender_id = $2 and shopping_name = $3";

class SkillAddShoppingList {
  constructor() {
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

    if (message_text == "買い物リスト追加") {
      let replyMessage = {
        type: "text",
        text: "買い物予定は？",
        quickReply: {
          "items": []
        }
      };

      // DBから取得したカテゴリをセット(最近使用したもの順にソート)
      let sqlParam = [event.source.userId];
      let shopping_name_list = await db.asyncSelect(sql_select_shopping_name_list, sqlParam);
      if (shopping_name_list.rows.length == 0) {
        // DBから取得できない場有はデフォルト値をセット
        replyMessage.quickReply.items.push({
          "type": "action",
          "action": {
            "type": "message",
            "label": `キャンセル`,
            "text": `キャンセル`
          }
        });
        replyMessage.quickReply.items.push({
          "type": "action",
          "action": {
            "type": "message",
            "label": `お米`,
            "text": `お米`
          }
        });
        replyMessage.quickReply.items.push({
          "type": "action",
          "action": {
            "type": "message",
            "label": `食パン`,
            "text": `食パン`
          }
        });
        replyMessage.quickReply.items.push({
          "type": "action",
          "action": {
            "type": "message",
            "label": `野菜ジュース`,
            "text": `野菜ジュース`
          }
        });
      }

      shopping_name_list.rows.forEach(element => {
        replyMessage.quickReply.items.push({
          "type": "action",
          "action": {
            "type": "message",
            "label": `${element.shopping_name}`,
            "text": `${element.shopping_name}`
          }
        });
      });

      return bot.replyMessage(event.replyToken, replyMessage);
    }

    if (message_text != "") {
      let sqlParam_exit = [event.source.userId, message_text];
      let retExit = await db.asyncSelect(sql_exit_shopping_name, sqlParam_exit);
      if (retExit.rows.length == 0) {
        let sqlParam_insert = [event.source.userId, message_text, db.getNowDate(), db.getNowDate()];
        await db.asyncUpdate(sql_insert_shoppingList, sqlParam_insert);
      } else {
        let sqlParam_update = [db.getNowDate(), event.source.userId, message_text];
        await db.asyncUpdate(sql_update_shoppingList, sqlParam_update);
      }

      let return_message = `${message_text}\nを買い物リストに追加しました`;
      return bot.replyMessage(event.replyToken, {
        type: "text",
        text: return_message
      });
    }
  }
}

module.exports = new SkillAddShoppingList();