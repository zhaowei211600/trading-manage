var form = null,
    layer = null,
    element = null,
    upload = null;

var success=0;
var fail=0;
var productId = null;
var typeId = '';
var secondTypeId = '';

$(function () {
    layui.use(['form', 'layer', 'upload'], function () {
        $ = layui.jquery;
        form = layui.form, layer = layui.layer, element = layui.element , upload = layui.upload;
        initialPage(form);
        simpleUpload("preview");
        form.on('submit(saveProduct)', function(data){
            var productId = $("#productId").val();
            var id = $("#id").val();
            var budget = $("#budget").val();
            var productName = $("#productName").val();

            var address = $("#address").val();
            //var desc = $("#desc").val();

            var requirementId = $("#requirementId").val();
            var descImg = $("#preview_input").val();

            var firstType = $("#firstType").val();
            var secondType = $("#secondType").val();

            var acceptingSide = $("#acceptingSide").val();
            var tradeDetail = $("#tradeDetail").val();
            var process = $("#process").val();

            var auditStatus = $("#auditStatus").val();


            var params = {'id':id ,'productId': productId, 'name': productName, 'budget': budget,
                'area': address, 'requirementId': requirementId, 'descImg':descImg,
                'firstType':firstType, 'secondType':secondType, 'acceptingSide':acceptingSide,'process':process,
                'tradeDetail':tradeDetail, 'productType':'2', 'auditStatus':auditStatus};
            var loadingIndex = layer.load(1);
            $.ajax({
                url: baseUrl + "/operation/product/save",
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
                        layer.msg(resultData.data, {icon: 5, time:3000});
                    }
                },
                complete: function () {
                    layer.close(loadingIndex);
                }
            });
        });
        form.on('select(firstType)', function(data){
            showSecondType();
        });

        form.on('submit(closeProduct)', function(data){
            var productId = $("#productId").val();
            var id = $("#id").val();
            var params = {'id':id};
            var loadingIndex = layer.load(1);
            $.ajax({
                url: baseUrl + "/operation/product/close",
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
                    }
                },
                complete: function () {
                    layer.close(loadingIndex);
                }
            });
        });
    });

});

function initialPage(form) {
    var page_type = getUrlParam('type');
    var title = '添加';
    if(page_type && page_type == 1) {
        title = '编辑';
        displayProduct(getUrlParam('productId'), form);
    }else {
        $("#id").val('0');
        getProductNumber();
        showFirstType();
        showSecondType()
    }
    $('#submitBtn').text(title);

}
function displayProduct(id, form) {
    if(!id || '' == id) return;
    var loadingIndex = layer.load(1);
    $.ajax({
        url: baseUrl + "/operation/product/find?productId=" + id,
        type: "post",
        crossDomain: true == !(document.all),
        beforeSend: function (request) {
            request.setRequestHeader("OperaAuthorization", TOKEN);
        },
        success: function (resultData) {
            if (resultData.returnCode == 200) {
                var product = resultData.data;
                $("#id").val(product.id);
                $("#productId").val(product.productId);
                $("#budget").val(product.budget);
                $("#productName").val(product.name);

                $("#requirementId").val(product.requirementId);
                $("#preview_image").attr('src',"/images/"+ product.descImg);
                $("#preview_image").show();
                $("#preview_input").val(product.descImg);

                typeId = product.firstType;
                $("#firstType").val(product.firstType);
                secondTypeId = product.secondType;
                $("#secondType").val(product.secondType);
                $("#acceptingSide").val(product.acceptingSide);
                $("#attachmentDesc").val(product.attachmentDesc);
                $("#tradeDetail").val(product.tradeDetail);
                $("#address").val(product.area);
                $("#process").val(product.process);
                $("#auditStatus").val(product.auditStatus);

                //$("#fileNameList").val(product.);
                $("#publisher").val(product.publisher);
                form.render('select');
                showFirstType(typeId);
                showSecondType(typeId, secondTypeId)
            }
        },
        complete: function () {
            layer.close(loadingIndex);
        }
    });
}

function simpleUpload(name){
    var uploadBtn = name + '_btn';
    var inputId = name + "_input";
    var  imageId = name + "_image"
    var textId = name + "_text";
    upload.render({
        elem : ('#' + uploadBtn),
        url :  baseUrl + "/user/file/upload",
        accept : 'file',
        exts : "jpg|png|gif|bmp|jpeg",
        processData: false,
        contentType: false,
        crossDomain: true == !(document.all),
        before : function(obj) {
            obj.preview(function(index, file, result) {
                load_index = layer.load(2, {
                    time : 20 * 1000
                });
            });
        },
        done : function(res) {
            layer.close(load_index);
            if (res.returnCode = '200') { //上传成功回显以及赋值
                $('#' + imageId).attr('src', "data:image/jpeg;base64," + res.data.fileContent);
                $('#' + imageId).show();
                $('#' + inputId).val(res.data.fileName);
            } else { //如果上传失败
                return layer.msg('上传失败');
            }
        },
        error : function() {
            //演示失败状态，并实现重传
            layer.close(load_index);
            layer.msg("文件上传失败！")
        }
    });
}
//
function getProductNumber() {
    $.ajax({
        url: baseUrl + "/operation/product/number",
        type: "get",
        crossDomain: true == !(document.all),
        beforeSend: function (request) {
            request.setRequestHeader("OperaAuthorization", TOKEN);
        },
        success: function (resultData) {
            if (resultData.returnCode == 200) {
                $("#productId").val(resultData.data);
                productId = resultData.data;
            }
        }
    });
}

function showFirstType(typeId) {
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
                    if(content.id == typeId){
                        tbody += "<option selected value=" + content.id + ">" + content.typeName + "</option>";
                    }else{
                        tbody += "<option value=" + content.id + ">" + content.typeName + "</option>";
                    }
                }
                $("#firstType").html(tbody);
                form.render('select');
            }
        }
    });
}

function showSecondType(typeId,secondTypeId) {
    var firstType =  $("#firstType").val();
    if(typeId){
        firstType = typeId
    }
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
            if (resultData.returnCode == 200) {
                var list = resultData.data;
                var tbody = "<option value=\"\">请选择</option>";
                for (var i = 0; i < list.length; i++) {
                    var content = list[i];
                    if(secondTypeId == content.id){
                        tbody += "<option selected value=" + content.id + ">" + content.typeName + "</option>";
                    }else{
                        tbody += "<option value=" + content.id + ">" + content.typeName + "</option>";
                    }
                }
                $("#secondType").html(tbody);
                form.render('select');
            }
        }
    });
}
