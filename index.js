// -----------------------------------------------------------------------------
// モジュールのインポート
const express = require("express");
const server = express();
const serviceServer = require("./service/server")

// -----------------------------------------------------------------------------
// Webサーバー設定
server.listen(process.env.PORT || 3000);
server.use(express.static('public'));
server.use("/webhook", serviceServer());
