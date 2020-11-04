"use strict";

const express = require('express');
const expence = require("../service/expence");

const myLiffId = process.env.MY_LIFF_ID;

const router = express.Router();

module.exports = () => {
  router.get('/send-id', function(req, res) {
    res.json({id: myLiffId});
  });

  router.post('/categoryList', async function(req, res) {
    let userId = req.body.userId;
    // DBから取得したカテゴリをセット(最近使用したもの順にソート)
    let category_list = await expence.asyncGetCategoryList(userId);
    let retJson = [];

    if (category_list.length == 0) {
      retJson.push({text: "ランチ"});
      retJson.push({text: "マンガ"});
      retJson.push({text: "日用品"});
    } else {
      for (let index = 0; index < category_list.length; index++) {
        retJson.push({
          text:`${category_list[index]}`
        })
        if (index > 5) break;
      }
    }

    res.json(retJson);
    return;
  });

  return router;
}
