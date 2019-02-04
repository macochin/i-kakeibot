"use strict";

const express = require('express');
const db = require("./postgres");
const router = express.Router();

const sql_select_expence_list = "select to_char(usedate, 'mm/dd') as usedate, category, money from accountBook where sender_id = $1 and to_char(usedate, 'yyyymm') = $2 order by usedate, update_date";

module.exports = () => {

  router.get('/expenceList/:ym/:senderId', async function(req, res, next) {
    let sqlParam = [process.env.SENDER_ID, req.params.ym];
    let expnece_list = await db.asyncSelect(sql_select_expence_list, sqlParam);

    let ret = {};
    Object.assign(ret, expnece_list.rows);
    res.json(ret);
  });

  return router;
}
