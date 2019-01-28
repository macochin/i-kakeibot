"use strict";

// -----------------------------------------------------------------------------
// モジュールのインポート
const express = require("express");
const line = require("@line/bot-sdk"); // Messaging APIのSDKをインポート
const Memory = require("../service/memory");

const router = express.Router();

// -----------------------------------------------------------------------------
// パラメータ設定
const line_config = {
    channelAccessToken: process.env.LINE_ACCESS_TOKEN, // 環境変数からアクセストークンをセットしています
    channelSecret: process.env.LINE_CHANNEL_SECRET // 環境変数からChannel Secretをセットしています
};

module.exports = () => {
  const memory = new Memory();

  // APIコールのためのクライアントインスタンスを作成
  const bot = new line.Client(line_config);

  // -----------------------------------------------------------------------------
  // ルーター設定
  router.post('/', line.middleware(line_config), async (req, res, next) => {
      // 先行してLINE側にステータスコード200でレスポンスする。
      res.sendStatus(200);

      // すべてのイベント処理のプロミスを格納する配列。
      let events_processed = [];

      // イベントオブジェクトを順次処理。
      req.body.events.forEach(async (event) => {
          // この処理の対象をイベントタイプがメッセージで、かつ、テキストタイプだった場合に限定。
          if (event.type == "message" && event.message.type == "text"){
              let exec_client = await memory.get(event.source.userId);

              if (event.message.text == "買い物リスト") {
                console.log("exec_client:" + exec_client);// TODO:

                if (exec_client == null || exec_client.constructor.name != "CreateShoppingList") {
                    exec_client = require("../skill/CreateShoppingList");
                    memory.put(event.source.userId, exec_client);
                    console.log("exec_client3:" + exec_client);// TODO:
                }
              }

              if (exec_client != null) {
                console.log("exec_client2:" + exec_client.constructor.name);// TODO:
              }

              events_processed.push(function (event, bot) {
                  let message_text = `毎度！ご注文は？`;
                  return bot.replyMessage(event.replyToken, {
                      type: "text",
                      text: message_text
                  });
              }(event, bot));
          }
      });

      // すべてのイベント処理が終了したら何個のイベントが処理されたか出力。
      Promise.all(events_processed).then(
          (response) => {
              console.log(`${response.length} event(s) processed.`);
          }
      );
  });

  return router;
}