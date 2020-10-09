"use strict";

const express = require('express');

const myLiffId = process.env.MY_LIFF_ID;

const router = express.Router();

module.exports = () => {

  router.get('/send-id', function(req, res) {
    res.json({id: myLiffId});
  });

  return router;
}
