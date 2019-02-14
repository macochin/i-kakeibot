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
                    let strTag = "<li><input type='checkbox' value='" + ret[count].shopping_name + ":" + ret[count].shopping_id + "'";
                    if (ret[count].plan_to_buy_flg == true) {
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

        document.getElementById('btn_update').addEventListener('click', function () {
            // TODO:未実装
            let message = "【買い物リスト更新】\n";
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

        document.getElementById('btn_addList').addEventListener('click', function () {
            let message = "買い物リスト追加";

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
