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
                    let strTag = "<li><input type='checkbox'";
                    if (ret[count].plan_to_buy_flg == false) {
                        strTag += " checked";
                    }
                    strTag += "><label>";
                    strTag += ret[count].shopping_name;
                    strTag += "</label></li>";
                    $("#shopping_list").append(strTag);
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
