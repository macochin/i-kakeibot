window.onload = function (e) {
    fetch('/webapi/send-id').then(function (reqResponse) {
        return reqResponse.json();
    }).then(function (jsonResponse) {
        myLiffId = jsonResponse.id;
        initializeLiff(myLiffId);
    });

    $('#expenceDate').val(formatDate(new Date()));

    // メッセージの送信
    document.getElementById('sendmessagebutton').addEventListener('click', function () {
        let message = "【支出登録】\n";

        message += "日にち:" + $('#expenceDate').val().replace(/-/g, '/') + "\n";
        message += "金額:" + $('#expence').val();

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

/**
 * Initialize LIFF
 * @param {string} myLiffId The LIFF ID of the selected element
 */
function initializeLiff(myLiffId) {
    liff.init({
        liffId: myLiffId
    }).then(() => {
        liff.getProfile().then(profile => {
            let url = `/webapi/categoryList`;
            let method = "POST";
            let obj = {userId: `${profile.userId}`};
            let body = JSON.stringify(obj);
            let headers = {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            };

            fetch(url, {method, headers, body}).then(function (reqResponse) {
                return reqResponse.json();
            }).then(function (jsonResponse) {
                // TODO:fetchでデータを取得し、画面を動的に作成
                jsonResponse.forEach(element => {
                    $("#categorylist").append(`<option value="${element.text}">`);
                });
            });
        });
    });
}

function formatDate(dt) {
    let month = ("0" + (dt.getMonth() + 1)).slice(-2)
    let date = ("0" + dt.getDate()).slice(-2)

    return dt.getFullYear() + "-" + month + "-" + date;
}
