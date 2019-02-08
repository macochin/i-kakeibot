window.onload = function (e) {
    let url = "/webapi/shoppingList/";
    liff.init(
        data => {
            url += data.context.userId;
        }
    );

    let ret = $.ajax({
        "url" : url,
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
