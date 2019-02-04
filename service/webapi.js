"use strict";

const express = require('express');
const db = require("./postgres");
const crypto = require("crypto");

const router = express.Router();

const sql_select_expence_list = "select to_char(usedate, 'mm/dd') as usedate, category, money from accountBook where sender_id = $1 and to_char(usedate, 'yyyymm') = $2 order by usedate, update_date";

module.exports = () => {

  router.get('/expenceList/:ym/:senderId', async function(req, res, next) {
    // TODO: start
    let crypt_key = "minority0304";

    let cipher = crypto.createCipher('aes192', crypt_key);
    cipher.update(process.env.SENDER_ID, 'utf8', 'hex');
    let cipheredText = cipher.final('hex');
    console.debug("cipheredText:" + cipheredText);// TODO:

    var decipher = crypto.createDecipher('aes192', crypt_key);
    decipher.update(cipheredText, 'hex', 'utf8');
    var dec = decipher.final('utf8');
    console.debug("dec:" + dec);// TODO:
    // TODO:

    let sqlParam = [process.env.SENDER_ID, req.params.ym];
    let expnece_list = await db.asyncSelect(sql_select_expence_list, sqlParam);

    let ret = {};
    Object.assign(ret, expnece_list.rows);
    res.json(ret);
  });

  return router;
}
