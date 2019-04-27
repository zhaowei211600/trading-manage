var form = null,layer = null,element = null;
$(document).ready(function () {
    layui.use(['form', 'layer','element'], function () {
        layer = layui.layer;
        form = layui.form;
        element = layui.element;
        statList(null);
        form.on('submit(sreach)', function (data) {
            statList(null);
        });
        $("#searchBtn").click();
    });
});

/**
 * 列表方法
 * @param cur_page
 */
function statList(cur_page) {
    var total = 0;
    var param = {};
    cur_page = isInteger(cur_page) ? cur_page : 1;
    param["pageNum"] = cur_page;
    param["pageSize"] = 10;
    param['phone'] = $('#phone').val();
    var loadingIndex = layer.load(1);
    $.ajax({
        data: param,
        url: baseUrl + "/operation/stat/list",
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
                        var corpType = '';
                        if(content.corpType == '1'){
                            corpType = '有限合伙企业';
                        }else if(content.corpType == '2'){
                            corpType = '有限责任公司';
                        }
                        tbody += "<tr>";
                        tbody += "<td>" + (i+1) + "</td>";
                        tbody += "<td>" + content.phone + "</td>";
                        tbody += "<td>" + corpType + "</td>";
                        tbody += "<td>" + content.investAmount + "</td>";
                        tbody += "<td>" + content.investDate + "</td>";
                        tbody += "<td>" + content.listDate + "</td>";
                        tbody += "<td>" + content.listUnitPrice + "</td>";
                        tbody += "<td>" + content.reductionQuantity + "</td>";
                        tbody += "<td>" + content.reductionUnitPrice + "</td>";
                        tbody += "</tr>";
                    }
                    $('#statList').html(tbody);
                }
            } else {
                $('#statList').html("");
            }
            paging('statPageDiv', total, cur_page, 'totalNum', 'statList');
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
    statList(null);
}
