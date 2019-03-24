var form = null,layer = null;
$(function () {
    layui.use(['form', 'layer'], function () {
        $ = layui.jquery;
        form = layui.form, layer = layui.layer;
        displayRequirement(getUrlParam('id'), form);
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
        form.on('submit(saveAudit)', function (data) {
            var id = $("#id").val();
            var status = $("#status").val();
            var score = $("#score").val();

            if (status == '' || status == null || status == '1') {
                layer.msg('请选择正确的需求状态', {icon: 5, time:3000});
                return;
            }
            var params = {requirementId: id, status: status, score: score};
            var loadingIndex = layer.load(1);
            $.ajax({
                url: baseUrl + "/operation/require/confirm",
                type: "get",
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
        });
    });

});

/**
 * 编辑前回显
 * @param id
 */
function displayRequirement(id, form) {
    if(!id || '' == id) return;
    var requirement;
    var loadingIndex = layer.load(1);
    $.ajax({
        url: baseUrl + "/operation/require/detail?requirementId=" + id,
        type: "get",
        crossDomain: true == !(document.all),
        beforeSend: function (request) {
            request.setRequestHeader("OperaAuthorization", TOKEN);
        },
        success: function (resultData) {
            if (resultData.returnCode == 200) {
                requirement = resultData.data;
                $("#id").val(requirement.id);
                $("#phone").val(requirement.phone);
                $("#requirementId").val(requirement.requirementId);
                $("#orgName").val(requirement.orgName);
                $("#desc").val(requirement.desc);
                $("#createTime").val(requirement.createTime);
                $("#status").val(requirement.status);
                if(requirement.type != null){
                    $("#type").val(requirement.type);
                }
                form.render('select');
            }
        },
        complete: function () {
            layer.close(loadingIndex);
        }
    });
}
