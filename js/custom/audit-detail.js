var form = null,layer = null;
$(function () {
    layui.use(['form', 'layer'], function () {
        $ = layui.jquery;
        form = layui.form, layer = layui.layer;
        displayUser(getUrlParam('userId'), form);
    });

});

/**
 * 编辑前回显
 * @param id
 */
function displayUser(id, form) {
    if(!id || '' == id) return;
    var user;
    var loadingIndex = layer.load(1);
    $.ajax({
        url: baseUrl + "/operation/custom/detail?userId=" + id,
        type: "post",
        crossDomain: true == !(document.all),
        beforeSend: function (request) {
            request.setRequestHeader("OperaAuthorization", TOKEN);
        },
        success: function (resultData) {
            if (resultData.returnCode == 200) {
                user = resultData.data;
                $("#id").val(user.id);
                $("#phone").val(user.phone);
                $("#registerTime").val(user.registerTime);
                $("#orgName").val(user.orgName);
                $("#position").val(user.position);
                $("#address").val(user.address);
                $("#email").val(user.email);
                $("#contactPhone").val(user.contactPhone);
                $("#score").val(user.score);

                if(user.status != null){
                    $("#status").val(user.status);
                }
                if(user.authStatus != null){
                    $("#authStatus").val(user.authStatus);
                }
                if(user.type != null){
                    $("#type").val(user.type);
                }
                form.render('select');
            }
        },
        complete: function () {
            layer.close(loadingIndex);
        }
    });
}