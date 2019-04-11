var form = null,layer = null;
$(function () {
    layui.use(['form', 'layer'], function () {
        $ = layui.jquery;
        form = layui.form, layer = layui.layer;
        displayRequirement(getUrlParam('id'), form);
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
