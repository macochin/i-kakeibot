"use strict";

const express = require('express');
const db = require("./postgres");
const router = express.Router();

const sql_select_expence_list = "select to_char(usedate, 'mm/dd') as usedate_md, category, money from accountBook where sender_id = $1 and to_char(usedate, 'yyyy/mm') = $2 order by usedate, update_date";

module.exports = () => {

  router.get('/expenceList', function(req, res, next) {
    let target_ym = req.params.ym;

    let sqlParam = [process.env.SENDER_ID, target_ym];
    let expnece_list = await db.asyncSelect(sql_select_expence_list, sqlParam);

    var ret = {};
    expnece_list.rows.forEach(element => {
      ret.push({
        "usedate_md" : element.usedate_md,
        "category" : element.category,
        "money" : element.money
      });
    });

    res.header('Content-Type', 'application/json; charset=utf-8')
    res.send(param);
  });

  return ret;
}
