var form = null,layer = null;
$(function () {
    layui.use(['form', 'layer'], function () {
        $ = layui.jquery;
        form = layui.form, layer = layui.layer;
        //监听提交
        form.on('submit(saveFirstType)', function (data) {
            var parentId = '0';
            var patentTypeName = '';
            var typeName = $("#firstType").val();
            var typeDesc = $("#typeDesc").val();
            var process = $("#process").val();
            var rules = $("#rules").val();

            if (typeDesc == '' || typeDesc == null) {
                layer.msg('请填写类型介绍', {icon: 5, time:3000});
                return;
            }
            if (process == '' || process == null) {
                layer.msg('请填写办理流程', {icon: 5, time:3000});
                return;
            }
            if (rules == '' || rules == null) {
                layer.msg('请填写分润规则', {icon: 5, time:3000});
                return;
            }
            var params = {parentId: parentId, parentTypeName:patentTypeName, typeName:typeName, typeDesc: typeDesc, process: process, rules:rules};
            var loadingIndex = layer.load(1);
            $.ajax({
                url: baseUrl + "/operation/type/save",
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
        });
    });

});

