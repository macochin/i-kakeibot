"use strict";

const express = require('express');
const crypto = require("crypto");
const db = require("./postgres");

const router = express.Router();

const sql_select_expence_list = "select to_char(usedate, 'mm/dd') as usedate, category, money from accountBook where sender_id = $1 and to_char(usedate, 'yyyymm') = $2 order by usedate, update_date";
const sql_select_shopping_list = "select shopping_id, shopping_name, plan_to_buy_flg, max(update_date) as max_update_date from shoppingList where sender_id = $1 group by shopping_id, shopping_name, plan_to_buy_flg order by max_update_date desc";

module.exports = () => {

  router.get('/expenceList/:ym/:senderId', async function(req, res, next) {
    // TODO:リクエストパラメータで暗号化フラグをもらう
    let decipher = crypto.createDecipher('aes192', process.env.CRYPT_KEY);
    let sender_id = decipher.update(req.params.senderId, 'hex', 'utf8');
    sender_id += decipher.final('utf8');

    let sqlParam = [sender_id, req.params.ym];
    let expnece_list = await db.asyncSelect(sql_select_expence_list, sqlParam);

    let ret = {};
    Object.assign(ret, expnece_list.rows);
    res.json(ret);
  });

  router.get('/shoppingList/:senderId', async function(req, res, next) {
    // TODO:リクエストパラメータで暗号化フラグをもらう
    console.debug("shoppingList:" + req.params.senderId);
    let sqlParam = [req.params.senderId];
    let shopping_list = await db.asyncSelect(sql_select_shopping_list, sqlParam);

    let ret = {};
    Object.assign(ret, shopping_list.rows);
    res.json(ret);
  });

  return router;
}
