window.onload = function (e) {
    liff.init(
        data => {
            // $.ajax({
            //     url : "https://i-kakeibot.herokuapp.com/webapi/shoppingList/" + data.context.userId,
            //     cache : false,
            //     type: "GET",
            //     async : false,
            //     success: function(data){
            //         let json = JSON.parse(data);
            //         var count = 0;
            //         while(json[count] != undefined) {
            //             $("#shopping_list").append("<label class='btn btn-secondary active'><input type='checkbox' checked autocomplete='off'>"+ json[count].shopping_name + "</label>");
            //             count++;
            //         }
            //     }
            // });
        }
    );

    $.ajax({
        url : "https://i-kakeibot.herokuapp.com/webapi/shoppingList/U0550a86daff0d2d7b9bbdd11f7c0297d",
        cache : false,
        type: "GET",
        async : false,
        success: function(data){
            // let json = JSON.parse(data);
            var count = 0;
            while(data[count] != undefined) {
                $("#shopping_list").append("<label class='btn btn-secondary active'><input type='checkbox' checked autocomplete='off'>"+ data[count].shopping_name + "</label>");
                count++;
            }
        }
    });

    // メッセージの送信
    document.getElementById('sendmessagebutton').addEventListener('click', function () {
        // TODO:未実装
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
