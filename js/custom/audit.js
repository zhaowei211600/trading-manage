var form = null,layer = null;
$(function () {
    layui.use(['form', 'layer'], function () {
        $ = layui.jquery;
        form = layui.form, layer = layui.layer;
        displayUser(getUrlParam('userId'), form);
        //自定义验证规则
        form.verify({
            score: function (value) {
                if(value == '' ||value == null || isNaN(value) || value < 0){
                    return '请填写正确的积分';
                }
            }
           // , password: [/(.+){6,8}$/, '密码必须为6-8位的字母或数字']
        });

        //监听提交
        form.on('submit(userAuditPass)', function (data) {
            auditUser(1)
        });
        form.on('submit(userAuditFailed)', function (data) {
            auditUser(2)
        });
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

function auditUser(state) {
    var id = $("#id").val();
    var type = $("#type").val();
    var score = $("#score").val();
    var auditDesc = $("#auditDesc").val();

    if (type == '' || type == null) {
        layer.msg('请选择用户类型', {icon: 5, time:3000});
        return;
    }
    //审核拒绝
    if(state == 2){
        if(auditDesc == '' || auditDesc == null){
            layer.msg('请填写审核意见', {icon: 5, time:3000});
            return;
        }
    }

    var params = {id: id, type: type, score: score, authStatus:state, auditDesc: auditDesc};
    var loadingIndex = layer.load(1);
    $.ajax({
        url: baseUrl + "/operation/custom/save",
        type: "post",
        data: params,
        beforeSend: function (request) {
            request.setRequestHeader("OperaAuthorization", TOKEN);
        },
        success: function (resultData) {
            if (resultData.returnCode == 200) {
                x_admin_close();
                parent.initPage(1, resultData.returnMessage);
            } else {
                layer.msg(resultData.returnMessage, {icon: 5, time:3000});
                return;
            }
        },
        complete: function () {
            layer.close(loadingIndex);
        }
    });
    return false;
}