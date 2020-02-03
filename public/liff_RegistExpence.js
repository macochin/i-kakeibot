window.onload = function (e) {
    fetch('/webapi/send-id').then(function (reqResponse) {
        return reqResponse.json();
    }).then(function (jsonResponse) {
        myLiffId = jsonResponse.id;
        initializeLiff(myLiffId);
        // }).catch(function(error) {
        //     document.getElementById("liffAppContent").classList.add('hidden');
        //     document.getElementById("nodeLiffIdErrorMessage").classList.remove('hidden');
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
        // }).then(() => {
        //         // start to use LIFF's api
        //         initializeApp();
    // }).catch((err) => {
    //     document.getElementById("liffAppContent").classList.add('hidden');
    //     document.getElementById("liffInitErrorMessage").classList.remove('hidden');
    });
}

function formatDate(dt) {
    let month = ("0" + (dt.getMonth() + 1)).slice(-2)
    let date = ("0" + dt.getDate()).slice(-2)

    return dt.getFullYear() + "-" + month + "-" + date;
}
