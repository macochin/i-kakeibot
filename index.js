// -----------------------------------------------------------------------------
// モジュールのインポート
const server = require("express")();
const line = require("@line/bot-sdk"); // Messaging APIのSDKをインポート

// -----------------------------------------------------------------------------
// パラメータ設定
const line_config = {
    channelAccessToken: process.env.LINE_ACCESS_TOKEN, // 環境変数からアクセストークンをセットしています
    channelSecret: process.env.LINE_CHANNEL_SECRET // 環境変数からChannel Secretをセットしています
};

// -----------------------------------------------------------------------------
// Webサーバー設定
server.listen(process.env.PORT || 3000);

// APIコールのためのクライアントインスタンスを作成
const bot = new line.Client(line_config);

// -----------------------------------------------------------------------------
// ルーター設定
server.post('/webhook', line.middleware(line_config), (req, res, next) => {
    // 先行してLINE側にステータスコード200でレスポンスする。
    res.sendStatus(200);

    // すべてのイベント処理のプロミスを格納する配列。
    let events_processed = [];

    // イベントオブジェクトを順次処理。
    console.debug("req:" + Object.getOwnPropertyNames(req)); // TODO:

    req.body.events.forEach((event) => {
        // この処理の対象をイベントタイプがメッセージで、かつ、テキストタイプだった場合に限定。
        if (event.type == "message" && event.message.type == "text"){
            events_processed.push(function (event, bot) {
                // console.debug("event:" + Object.getOwnPropertyNames(event)); // TODO:
                console.debug("event.replyToken:" + event.replyToken); // TODO:
                console.debug("event.type:" + event.type); // TODO:
                // console.debug("event.timestamp:" + event.timestamp); // TODO:

                console.debug("event.source:" + Object.getOwnPropertyNames(event.source)); // TODO:
                console.debug("event.message:" + Object.getOwnPropertyNames(event.message)); // TODO:

                message_text = `毎度！ご注文は？`;
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
