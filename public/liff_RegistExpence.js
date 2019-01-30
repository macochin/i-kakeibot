window.onload = function (e) {
    liff.init();

    document.getElementById('expenceDate').value = formatDate(new Date());

    // メッセージの送信
    document.getElementById('sendmessagebutton').addEventListener('click', function () {
        let message = "【支出登録】\n";

        message += "日にち:" + document.getElementById('expenceDate').value + "\n";
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

function formatDate(dt) {
    let month = ("0" + (dt.getMonth() + 1)).slice(-2)
    let date = ("0" + dt.getDate()).slice(-2)

    return dt.getFullYear() + "-" + month + "-" + date;
}
