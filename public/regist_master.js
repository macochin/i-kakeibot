window.onload = function (e) {
    fetch('/auth/send-id').then(function (reqResponse) {
        return reqResponse.json();
    }).then(function (jsonResponse) {
        myLiffId = jsonResponse.id;
        initializeLiff(myLiffId);
    });

    fetch('/views/copy_master_file_url').then(function (reqResponse) {
        return reqResponse.json();
    }).then(function (jsonResponse) {
        $('#copy_master_file_url').attr('href', jsonResponse.url);
    });

    $('#cilp_this_url').on('click', function() {
        // コピーする文章の取得
        let text = location.protocol + '//' + location.hostname + '/views/regist_master';
        // テキストエリアの作成
        let $textarea = $('<textarea></textarea>');
        // テキストエリアに文章を挿入
        $textarea.text(text);
        //　テキストエリアを挿入
        $(this).append($textarea);
        //　テキストエリアを選択
        $textarea.select();
        // コピー
        document.execCommand('copy');
        // テキストエリアの削除
        $textarea.remove();
    });

    $('#sendmessagebutton').on('click', function() {
        let sheetId = $('#sheet_url').val().split('/');
        // 必須チェック
        if (sheetId == '' || sheetId == null || typeof sheetId === 'undefined') {
            alert("マスタファイルURLを入力してください");
            return;
        }

        if (!liff.isLoggedIn()) {
            alert("LINEアカウントにログイン後、再度、登録ボタンをクリックしてください。");
            liff.login();
        } else {
            liff.getProfile().then(function(profile) {
                window.location.href = '/auth/spreadSheets/' + sheetId[5] + '/' + profile.userId;
            }).catch(function(error) {
                // window.alert('Error getting profile: ' + error);
            });
        }
    });
};

/**
 * Initialize LIFF
 * @param {string} myLiffId The LIFF ID of the selected element
 */
function initializeLiff(myLiffId) {
    liff.init({
        liffId: myLiffId
    }).catch((err) => {
        alert(err.code, err.message);
    });
}
