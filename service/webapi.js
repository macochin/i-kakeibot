"use strict";

const express = require('express');
const db = require("./postgres");
const crypto = require("crypto");

const router = express.Router();

const sql_select_expence_list = "select to_char(usedate, 'mm/dd') as usedate, category, money from accountBook where sender_id = $1 and to_char(usedate, 'yyyymm') = $2 order by usedate, update_date";

module.exports = () => {

  router.get('/expenceList/:ym/:senderId', async function(req, res, next) {
    let decipher = crypto.createDecipher('aes192', process.env.CRYPT_KEY);
    let sender_id = decipher.update(req.params.senderId, 'hex', 'utf8');
    sender_id += decipher.final('utf8');

    let sqlParam = [sender_id, req.params.ym];
    let expnece_list = await db.asyncSelect(sql_select_expence_list, sqlParam);

    let ret = {};
    Object.assign(ret, expnece_list.rows);
    res.json(ret);
  });

  return router;
}
