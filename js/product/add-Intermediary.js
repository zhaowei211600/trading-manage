var form = null,
    layer = null,
    element = null,
    upload = null;

var fileNameList = '';
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
            var desc = $("#desc").val();

            var requirementId = $("#requirementId").val();
            var descImg = $("#preview_input").val();

            var firstType = $("#firstType").val();
            var secondType = $("#secondType").val();

            var acceptingSide = $("#acceptingSide").val();

            var attachmentDesc = $("#attachmentDesc").val();
            var tradeDetail = $("#tradeDetail").val();
            var fileNameList = $("#fileNameList").val();
            var publisher = $("#publisher").val();
            var params = {'id':id,'productId': productId, 'name': productName, 'budget': budget,
                'desc':desc,
                'area': address, 'requirementId': requirementId, 'descImg':descImg,
                'firstType':firstType, 'secondType':secondType, 'acceptingSide':acceptingSide,
                'attachmentDesc':attachmentDesc, 'tradeDetail':tradeDetail, 'productType':'1',
                'fileNameList':fileNameList, 'publisher':publisher};
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
        upload.render({
            elem : ('#uploadAttachment'),
            url :  baseUrl + "/user/file/attachment?",
            accept : 'file',
            multiple: true,
            processData: false,
            contentType: false,
            crossDomain: true == !(document.all),
            number:20,
//			MultipartFile file 对应，layui默认就是file,要改动则相应改动
            field:'file',
            bindAction: '#test9',
            before: function(obj) {
                var productId = $("#productId").val();
                this.data={'productId':productId};//关键代码
                //预读本地文件示例，不支持ie8
                obj.preview(function(index, file, result) {
                    //$('#fileList').append('<tr><td>'+file.name+'</td><td onclick="deleteAttachment('+file.name+')">删除</td></tr>')
                });
            },
            done: function(res, index, upload) {
                //每个图片上传结束的回调，成功的话，就把新图片的名字保存起来，作为数据提交
                if(res.returnCode != "200"){
                    fail++;
                }else{
                    success++;
                    fileNameList = fileNameList +""+res.data.fileName+",";
                    $('#fileList').append("<tr><td>"+res.data.originalName+"</td><td><a href='#' onclick='deleteAttachment(this,\'"+res.data.fileName+"\')\'>删除</a></td></tr>")
                    $('#fileNameList').val(fileNameList);
                }
            },
            allDone:function(obj){
                layer.msg("总共要上传文件总数为："+(fail+success)+"\n"
                    +"其中上传成功文件数为："+success+"\n"
                    +"其中上传失败文件数为："+fail
                )
            }
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
/**
 * 编辑前回显
 * @param id
 */
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
                $("#preview_image").attr('src',"/images/"+product.descImg);
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
                $("#desc").val(product.desc);

                //$("#fileNameList").val(product.);
                $("#publisher").val(product.publisher);
                form.render('select');
                findAttachment(product.productId);
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

function deleteAttachment(row,filePath) {
    $.ajax({
        url: baseUrl + "/operation/product/disable?filePath="+ filePath ,
        type: "post",
        crossDomain: true == !(document.all),
        beforeSend: function (request) {
            request.setRequestHeader("OperaAuthorization", TOKEN);
        },
        success: function (resultData) {
            if (resultData.returnCode == 200) {
                var i = row.parentNode.parentNode.rowIndex;
                document.getElementById('fileList').deleteRow(i);
            }
        }
    });
}

function findAttachment(productId) {
    $.ajax({
        url: baseUrl + "/operation/product/attachment?productId="+ productId ,
        type: "post",
        crossDomain: true == !(document.all),
        beforeSend: function (request) {
            request.setRequestHeader("OperaAuthorization", TOKEN);
        },
        success: function (resultData) {
            if (resultData.returnCode == 200) {
                var list = resultData.data;
                var tbody = "";
                var fileNameList = '';
                for (var i = 0; i < list.length; i++) {
                    var content = list[i];
                    tbody += "<tr><td>"+content.fileName+"</td><td><a href='#' onclick=\"deleteAttachment(this,\'"+content.filePath+"\')\">删除</a></td></tr>";
                    fileNameList += content.filePath + ",";

                }
                $('#fileNameList').val(fileNameList);
                $('#fileList').append(tbody);
            }
        }
    });
}

