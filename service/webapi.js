"use strict";

const express = require('express');
const expence = require("../service/expence");

const myLiffId = process.env.MY_LIFF_ID;

const router = express.Router();

module.exports = () => {

  router.get('/send-id', function(req, res) {
    res.json({id: myLiffId});
  });

  router.POST('/categoryList', async function(req, res) {
    let userId = req.params.userId;
    console.debug("userId:" + userId);// TODO:
    // DBから取得したカテゴリをセット(最近使用したもの順にソート)
    let category_list = await expence.asyncGetCategoryList(userId);
    let retJson = [];

    for (let index = 0; index < category_list.length; index++) {
      retJson.push({
        type:"radio"
        , text:`${category_list[index]}`
      })
    }

    res.json(retJson);
    return;
  });

  return router;
}
