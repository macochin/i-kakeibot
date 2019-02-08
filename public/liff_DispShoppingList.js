window.onload = function (e) {
    liff.init(
        data => {
            $.ajax({
                url : "/webapi/shoppingList/" + data.context.userId,
                cache : false,
                method : "GET",
                async : false,
                success: function(data){
                    let json = JSON.parse(data);
                    var count = 0;
                    while(json[count] != undefined) {
                        $("#shopping_list").append("<label class='btn btn-secondary active'><input type='checkbox' checked autocomplete='off'>"+ json[count].shopping_name + "</label>");
                        count++;
                    }

                }
            });
        }
    );

    // メッセージの送信
    document.getElementById('sendmessagebutton').addEventListener('click', function () {
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
};
