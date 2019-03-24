var form = null,layer = null,element = null;
$(document).ready(function () {
    layui.use(['form', 'layer','element'], function () {
        layer = layui.layer;
        form = layui.form;
        element = layui.element;
        requirementList(null);
        form.on('submit(sreach)', function (data) {
            requirementList(null);
        });
        $("#searchBtn").click();
    });
});

/**
 * 列表方法
 * @param cur_page
 */
function requirementList(cur_page) {
    var total = 0;
    var param = {};
    cur_page = isInteger(cur_page) ? cur_page : 1;
    param["pageNum"] = cur_page;
    param["pageSize"] = 10;
    param['phone'] = $('#phone').val();
    param['startTime'] = $("#startDate").val();
    param['endTime'] = $("#endDate").val();
    var loadingIndex = layer.load(1);
    $.ajax({
        data: param,
        url: baseUrl + "/operation/require/list",
        type: "post",
        crossDomain: true == !(document.all),
        beforeSend: function (request) {
            request.setRequestHeader("OperaAuthorization", TOKEN);
        },
        success: function (resultData) {
            if (resultData.returnCode == 200) {
                if (resultData.data != null) {
                    var list = resultData.data;
                    total = resultData.total;
                    var tbody = '';
                    for (var i = 0; i < list.length; i++) {
                        var content = list[i];
                        var status = '';
                        var userType = '';
                        var userStatus = '';
                        var createTime = '';
                        if(content.status == '2'){
                            status = '已确认';
                        }else if(content.status == '3'){
                            status = '已发布';
                        }else{
                            status = '待审核'
                        }
                        if(content.userStatus == '1'){
                            userStatus = '正常';
                        }else {
                            userStatus = '停用';
                        }

                        if(content.type == '2'){
                            userType = '会员代理';
                        }else if(content.type == '3'){
                            userType = '分柜';
                        }else if(content.type == '4'){
                            userType = '掌柜';
                        }else{
                            userType = '注册游客';
                        }
                        if(content.createTime != 'null' && content.createTime != null){
                            createTime = content.createTime;
                        }
                        tbody += "<tr>";
                        tbody += "<td>" + (i+1) + "</td>";
                        tbody += "<td>" + content.phone + "</td>";
                        tbody += "<td>" + content.orgName + "</td>";
                        tbody += "<td>" + createTime + "</td>";
                        tbody += "<td>" + status + "</td>";
                        tbody += "<td>" + userType + "</td>";
                        tbody += "<td>" + userStatus + "</td>";
                        if(content.status == '1'){
                            tbody += "<td class=\"td-manage\">" ;
                            tbody += "<a title=\"审核\"  onclick=\"x_admin_show('需求确认','./detail.html?id="+content.id+"',720,550)\" href=\"javascript:;\">\n" +
                                "<i class=\"layui-icon\">&#xe642;</i></a>";
                            tbody += "</td>";
                        }else{
                            tbody += "<td class=\"td-manage\">--" ;
                            tbody += "</td>";
                        }
                        tbody += "</tr>";
                    }
                    $('#requirementList').html(tbody);
                }
            } else {
                $('#requirementList').html("");
            }
            paging('requirementPageDiv', total, cur_page, 'totalNum', 'requirementList');
            return false;
        },
        complete: function () {
            layer.close(loadingIndex);
        }
    });
}

/**
 * 编辑页回调主页面-入口方法
 * @param icon(图标类型)
 * @param msg(信息)
 */
function initPage(icon, msg) {
    layer.msg(msg,{icon:icon,time:2000});
    requirementList(null);
}
