// -----------------------------------------------------------------------------
// モジュールのインポート
const express = require("express");
const server = express();
const session = require("express-session");
const bodyParser = require("body-parser");
const serviceServer = require("./service/server")
const webapi = require("./service/webapi");
const auth = require("./service/googleOauth2");

// -----------------------------------------------------------------------------
// Webサーバー設定
server.listen(process.env.PORT || 3000);
server.use(express.static('public'));
server.use(session({
  secret: 'secret',
  resave: false,
  saveUninitialized: false,
  cookie:{
  httpOnly: true,
  secure: false,
  maxage: 1000 * 60 * 5
  }
}));
server.set("view engine", "ejs");
server.use("/webhook", serviceServer());
server.use(bodyParser.json());
server.use(bodyParser.urlencoded({extended: false}));
server.use("/webapi", webapi());
server.use("/auth", auth());
