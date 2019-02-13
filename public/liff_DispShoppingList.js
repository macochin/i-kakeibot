window.onload = function (e) {
    liff.init(function (data) {
        $.ajax({
            url : "https://i-kakeibot.herokuapp.com/webapi/shoppingList/" + data.context.userId,
            cache : false,
            type: "GET",
            async : false,
            success: function(ret){
                var count = 0;
                while(ret[count] != undefined) {
                    $("#shopping_list").append("<li><input type='checkbox'");
                    $("#shopping_list").append(" checked");
                    if (ret[count].plan_to_buy_flg == false) {
                        $("#shopping_list").append("><label>");
                    }
                    $("#shopping_list").append(ret[count].shopping_name);
                    $("#shopping_list").append("</label></li>");
                    count++;
                }
            }
        });

        // メッセージの送信
        document.getElementById('sendmessagebutton').addEventListener('click', function () {
            // TODO:未実装
            let message = "【支出登録】\n";

            message += "日にち:" + document.getElementById('expenceDate').value.replace(/-/g, '/') + "\n";
            message += "金額:" + document.getElementById('expence').value;

            liff.sendMessages([{
                type: 'text',
                text: message
            }]).then(function () {
                liff.closeWindow();
            }).catch(function (error) {
                window.alert("Error sending message: " + error);
            });
        });
    });
};
