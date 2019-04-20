var form = null,layer = null;
$(function () {
    layui.use(['form', 'layer'], function () {
        $ = layui.jquery;
        form = layui.form, layer = layui.layer;
        initialPage();
        //监听提交
        form.on('submit(saveFirstType)', function (data) {
            var id = $("#id").val();
            var typeName = $("#firstType").val();

            var params = {'id': id, parentId:0, typeName:typeName};
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

function initialPage(form) {
    var page_type = getUrlParam('type');
    var title = '添加';
    if(page_type && page_type == 1) {
        title = '编辑';
        displayType(getUrlParam('id'), form);
    }else {
        $("#id").val('0');
    }
    $('#submitBtn').text(title);

}
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
                $("#firstType").val(type.typeName);
            }
        },
        complete: function () {
            layer.close(loadingIndex);
        }
    });
}

