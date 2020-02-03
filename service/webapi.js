"use strict";

const express = require('express');
const crypto = require("crypto");
const db = require("./postgres");

const myLiffId = process.env.MY_LIFF_ID;

const router = express.Router();

module.exports = () => {

  router.get('/expenceList/:ym/:senderId', async function(req, res, next) {
    // TODO:リクエストパラメータで暗号化フラグをもらう
    let decipher = crypto.createDecipher('aes192', process.env.CRYPT_KEY);
    let sender_id = decipher.update(req.params.senderId, 'hex', 'utf8');
    sender_id += decipher.final('utf8');

    let sqlParam = [sender_id, req.params.ym];
    let expnece_list = await db.asyncSelectExpenceListWebAPI(sqlParam);

    let ret = {};
    Object.assign(ret, expnece_list.rows);
    res.json(ret);
  });

  router.get('/send-id', function(req, res) {
    res.json({id: myLiffId});
  });

  return router;
}
