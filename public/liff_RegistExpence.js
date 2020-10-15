window.onload = function (e) {
    fetch('/webapi/send-id').then(function (reqResponse) {
        return reqResponse.json();
    }).then(function (jsonResponse) {
        myLiffId = jsonResponse.id;
        initializeLiff(myLiffId);
    });

    document.getElementById('expenceDate').value = formatDate(new Date());

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

/**
 * Initialize LIFF
 * @param {string} myLiffId The LIFF ID of the selected element
 */
function initializeLiff(myLiffId) {
    liff.init({
        liffId: myLiffId
    }).then(() => {
        liff.login().then(() => {
            alert(liff.getProfile().userId);// TODO:
            let url = `/webapi/categoryList`;
            let method = "POST";
            let obj = {userId: `${liff.getProfile().userId}`};
            let body = Object.keys(obj).map((key)=>key+"="+encodeURIComponent(obj[key])).join("&");
            let headers = {
                'Accept': 'application/json'
            };

            fetch(url, {method, headers, body}).then(function (reqResponse) {
                return reqResponse.json();
            }).then(function (jsonResponse) {
                // TODO:fetchでデータを取得し、画面を動的に作成
                jsonResponse.forEach(element => {
                    alert(element.type + ":" + element.text);
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
