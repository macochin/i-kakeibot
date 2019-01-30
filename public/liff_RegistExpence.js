window.onload = function (e) {
    liff.init();

    let dt = new Date();
    dt.setFullYear(dt.getFullYear() - 6);
    document.getElementById('birthday').value = formatDate(dt);

    // メッセージの送信
    document.getElementById('sendmessagebutton').addEventListener('click', function () {
        let message = "";

        message += "名前:" + document.getElementById('childname').value + "\n";
        message += "誕生日:" + document.getElementById('birthday').value;

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
