"use strict";

const express = require("express");
const line = require("@line/bot-sdk");
const Memory = require("../service/memory");

const router = express.Router();

const line_config = {
    channelAccessToken: process.env.LINE_ACCESS_TOKEN,
    channelSecret: process.env.LINE_CHANNEL_SECRET
};

module.exports = () => {
    const memory = new Memory();
    const bot = new line.Client(line_config);

    router.post('/', line.middleware(line_config), async (req, res, next) => {

        // 先行してLINE側にステータスコード200でレスポンスする。
        res.sendStatus(200);

        let events_processed = [];

        // TODO:削除予定
        req.body.events.forEach(async (event) => {
            if (event.type == "message" && event.message.type == "text") {
                let message_text = event.message.text;

                if (message_text == "準備中...") {
                    return bot.replyMessage(event.replyToken, {
                        type: "text",
                        text: "準備中です..."
                    });
                }

                let exec_client = await memory.get(event.source.userId);
                let skill_name = "";

                if (message_text.startsWith("【支出登録】")) skill_name = "RegistExpence";
                if (message_text == "支出一覧表示") skill_name = "DispExpenceList";

                let class_name = `Skill${skill_name}`;
                if (exec_client == null
                    || (skill_name != "" && exec_client.constructor.name != class_name)) {
                    exec_client = require(`../skill/${skill_name}`);
                    memory.put(event.source.userId, exec_client);
                }

                events_processed.push(exec_client.run(event, bot));
            }
        });

        // すべてのイベント処理が終了したら何個のイベントが処理されたか出力。
        Promise.all(events_processed).then(
            (response) => {
                console.log(`${response.length} event(s) processed.`);
            }
        ).catch(async function(error) {
            memory.del(error.message);
        });
    });

    return router;
}
