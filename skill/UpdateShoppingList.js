"use strict";

const db = require("../service/postgres");
const sql_update_shoppingList_true = "update shoppingList set plan_to_buy_flg = true, update_date = $1 where sender_id = $2 and shopping_id in (";
const sql_update_shoppingList_false = "update shoppingList set plan_to_buy_flg = false, update_date = $1 where sender_id = $2 and shopping_id not in (";

class SkillUpdateShoppingList {
  constructor() {
  }

  async run(event, bot) {
    let message_text = event.message.text;
    let str = message_text.split("\n");
    str.shift();
    // TODO:trueゼロ対応

    // TODO:配列をSQLに渡すと文字列に見なされてしまったため、下記の通り暫定対応
    let str_shopping_id = "";
    let count = 0;
    str.forEach(element => {
      if (count > 0) {
        str_shopping_id += ",";
      }
      str_shopping_id += Number(element.split(":")[1]);
      count++;
    });
    str_shopping_id += ")"

    let sqlParam_update = [db.getNowDate(), event.source.userId];
    await db.asyncUpdate(sql_update_shoppingList_true + str_shopping_id, sqlParam_update);
    await db.asyncUpdate(sql_update_shoppingList_false + str_shopping_id, sqlParam_update);

    return bot.replyMessage(event.replyToken, {
      type: "text",
      text: "更新しました"
    });
}
}

module.exports = new SkillUpdateShoppingList();