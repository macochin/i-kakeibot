// -----------------------------------------------------------------------------
// モジュールのインポート
const express = require("express")();
const server = require("./service/server")

// -----------------------------------------------------------------------------
// Webサーバー設定
express.listen(process.env.PORT || 3000);
express.use("/webhook", server());
