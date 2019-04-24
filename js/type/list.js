var form = null,layer = null,element = null;
$(document).ready(function () {
    layui.use(['form', 'layer','element'], function () {
        layer = layui.layer;
        form = layui.form;
        element = layui.element;
        showFirstType();
        form.on('submit(sreach)', function (data) {
            typeList(null);
        });
        form.on('select(firstType)', function(data){
            showSecondType();
        });

        $("#searchBtn").click();
    });
});

/**
 * 列表方法
 * @param cur_page
 */
function typeList(cur_page) {
    var total = 0;
    var param = {};
    cur_page = isInteger(cur_page) ? cur_page : 1;
    param["pageNum"] = cur_page;
    param["pageSize"] = 10;
    param['status'] = $('#status').val();
    param['parentId'] = $("#firstType").val();
    param['id'] = $("#secondType").val();
    param['type'] = '2';
    var loadingIndex = layer.load(1);
    $.ajax({
        data: param,
        url: baseUrl + "/operation/type/list",
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
                        var createTime = '';
                        var typeName = '';

                        if(content.status == '1'){
                            status = '已发布';
                        }else{
                            status = '已下架'
                        }
                        var type = '';
                        if(content.parentId == '0'){
                            type = '一级';
                            typeName =  content.typeName;
                        }else{
                            type = '二级';
                            typeName = content.parentTypeName + '/' + content.typeName;
                        }

                        if(content.createTime != 'null' && content.createTime != null){
                            createTime = content.createTime;
                        }
                        tbody += "<tr>";
                        tbody += "<td>" + (i+1) + "</td>";
                        tbody += "<td>" + typeName + "</td>";
                        tbody += "<td>" + type + "</td>";
                        tbody += "<td>" + content.typeDesc + "</td>";
                        tbody += "<td>" + content.process + "</td>";
                        tbody += "<td>" + content.rules + "</td>";
                        tbody += "<td>" + status + "</td>";
                        tbody += "<td>" + createTime + "</td>";
                        tbody += "<td class=\"td-manage\">" ;
                        tbody += "<a title=\"编辑\"  onclick=\"x_admin_show('编辑','./detail.html?id="+content.id+"&type=1',720,550)\" href=\"javascript:;\">编辑</a>";
                        tbody += "|";
                        tbody += "<a title=\"删除\" onclick=\"deleteType("+content.id+")\" href=\"javascript:;\">删除</a>" ;
                        tbody += "</td>";
                        tbody += "</tr>";
                    }
                    $('#typeList').html(tbody);
                }
            } else {
                $('#typeList').html("");
            }
            paging('typePageDiv', total, cur_page, 'totalNum', 'typeList');
            return false;
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

function showSecondType() {
    var firstType = $("#firstType").val();
    var tbody = "<option value=\"\">请选择</option>";
    if(firstType == '' || firstType == null || firstType < 1){
        $("#secondType").html(tbody);
        form.render('select');
        return;
    }
    $.ajax({
        url: baseUrl + "/operation/type/second?parentId="+ firstType,
        type: "get",
        crossDomain: true == !(document.all),
        beforeSend: function (request) {
            request.setRequestHeader("OperaAuthorization", TOKEN);
        },
        success: function (resultData) {
            var tbody = "<option value=\"\">请选择</option>";
            if (resultData.returnCode == 200) {
                var list = resultData.data;
                for (var i = 0; i < list.length; i++) {
                    var content = list[i];
                    tbody += "<option value=" + content.id + ">" + content.typeName + "</option>";
                }
            }
            $("#secondType").html(tbody);
            form.render('select');
        }
    });
}

function deleteType(typeId) {
    layer.confirm('确认要删除该类型吗？', {skin: 'layui-layer-molv'}, function(index){
        $.ajax({
            url: baseUrl + "/operation/type/delete?typeId=" + typeId,
            type: "get",
            crossDomain: true == !(document.all),
            beforeSend: function (request) {
                request.setRequestHeader("OperaAuthorization", TOKEN);
            },
            success: function (resultData) {
                if (resultData.returnCode == 200) {
                    layer.msg('类型已删除!',{icon:1,time:1000});
                    typeList(null);
                }else {
                    layer.msg(resultData.returnMessage,{icon:2,time:1000});
                }
            }
        });
    });
}

/**
 * 编辑页回调主页面-入口方法
 * @param icon(图标类型)
 * @param msg(信息)
 */
function initPage(icon, msg) {
    layer.msg(msg,{icon:icon,time:2000});
    typeList(null);
}


