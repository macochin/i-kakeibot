window.onload = function (e) {
    liff.init();

    var ret = $.ajax({
        "url" : "/webapi/shoppingList/" + liff.init().context.userId,
        "method" : "POST",
    });
    ret.then(function(data){
        alert(data);
    },function(err){});

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
