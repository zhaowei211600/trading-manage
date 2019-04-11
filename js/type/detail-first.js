var form = null,layer = null;
$(function () {
    layui.use(['form', 'layer'], function () {
        $ = layui.jquery;
        form = layui.form, layer = layui.layer;
        showFirstType();
        displayType(getUrlParam('id'), form);

        //监听提交
        form.on('submit(saveType)', function (data) {
            var id = $("#id").val();
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
            var params = {id: id, typeDesc: typeDesc, process: process, rules:rules};
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

/**
 * 编辑前回显
 * @param id
 */
function displayType(id, form) {
    if(!id || '' == id) return;
    var type;
    var loadingIndex = layer.load(1);
    $.ajax({
        url: baseUrl + "/operation/type/detail?typeId=" + id,
        type: "get",
        crossDomain: true == !(document.all),
        beforeSend: function (request) {
            request.setRequestHeader("OperaAuthorization", TOKEN);
        },
        success: function (resultData) {
            if (resultData.returnCode == 200) {
                type = resultData.data;
                $("#id").val(type.id);
                $("#firstType").val(type.id);
                $("#typeDesc").val(type.typeDesc);
                $("#process").val(type.process);
                $("#rules").val(type.rules);
                $("#firstType").attr("disabled","disabled");
                form.render('select');
            }
        },
        complete: function () {
            layer.close(loadingIndex);
        }
    });
}

function showFirstType() {
    $.ajax({
        url: baseUrl + "/operation/type/first" ,
        type: "get",
        crossDomain: true == !(document.all),
        beforeSend: function (request) {
            request.setRequestHeader("OperaAuthorization", TOKEN);
        },
        success: function (resultData) {
            if (resultData.returnCode == 200) {
                var list = resultData.data;
                var tbody = "<option value=\"\">请选择</option>";
                for (var i = 0; i < list.length; i++) {
                    var content = list[i];
                    tbody += "<option value=" + content.id + ">" + content.typeName + "</option>";
                }
                $("#firstType").html(tbody);
                form.render('select');
            }
        }
    });
}
