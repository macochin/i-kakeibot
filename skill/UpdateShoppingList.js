"use strict";

const db = require("../service/postgres");
const sql_update_shoppingList_true = "update shoppingList set plan_to_buy_flg = true, update_date = $1 where sender_id = $2 and shopping_id in ($3)";
const sql_update_shoppingList_false = "update shoppingList set plan_to_buy_flg = false, update_date = $1 where sender_id = $2 and shopping_id not in ($3)";

class SkillUpdateShoppingList {
  constructor() {
  }

  async run(event, bot) {
    let message_text = event.message.text;
    let registValue = [];
    let str = message_text.split("\n");
    str.forEach(element => {
      registValue.push(Number(element.split(":")[1]));
    });
    registValue.shift();
    // registValue.map(str => parseInt(str, 10));

    let sqlParam_update = [db.getNowDate(), event.source.userId, registValue];
    await db.asyncUpdate(sql_update_shoppingList_true, sqlParam_update);
    await db.asyncUpdate(sql_update_shoppingList_false, sqlParam_update);

    console.debug("registValue:" + registValue);// TODO:
    return bot.replyMessage(event.replyToken, {
      type: "text",
      text: "更新しました"
    });
}
}

module.exports = new SkillUpdateShoppingList();