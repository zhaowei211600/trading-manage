$(document).ready(function(){

    /*jQuery.validator.addMethod("isPws", function (value, element) {
    		var length = value.length;
        var mobile = /[0-9]+[a-zA-Z]+[0-9a-zA-Z]*|[a-zA-Z]+[0-9]+[0-9a-zA-Z]*!/;
        var qw = this.optional(element)
        var er = mobile.test(value)
        return this.optional(element) || (mobile.test(value));
    }, "密码必须包含数字和字母");*/

    layui.use(['form', 'layer'], function () {
        var form = layui.form
            ,layer = layui.layer,
            element = layui.element
    });
});


//登录验证
$("#loginButton").click(function () {
    var account = $('#account').val();
    var password = $('#password').val();
    if(!account || !password){
        return false;
    }

    //提交表单 时调用的发方法
    var param = {};
    param["username"] = account;
    param["password"] = password;

    $.ajax({
        data: JSON.stringify(param),
        url: baseUrl +"/operation/user/login",
        type: "post",
        contentType: "application/json;charset=utf-8",
        crossDomain: true == !(document.all),
        success: function (resultData) {
            // console.log(resultData)
            if (resultData.returnCode == 200) {
                var content = resultData.data || {};
                window.location.href = getRootPath_web()+'/index.html';
                if (content.OperaAuthorization) {
                    if (window.ActiveXObject || "ActiveXObject" in window){
                        $.cookie('OperaAuthorization', content.OperaAuthorization, { path: '/' ,expires : 1 });
                        $.cookie('userName', content.userName, { path: '/' ,expires : 1 });
                        //console.log('cookie = '+ $.cookie('OperaAuthorization'))
                    }else{
                        localStorage.setItem('OperaAuthorization',content.OperaAuthorization);
                        localStorage.setItem('userName',content.userName);
                    }
                } else{
                    //没有获取到token值
                    layer.msg('登录失败', {icon: 6,time:3000});
                    return false;
                }

            } else if(resultData.returnCode == 405 ||resultData.returnCode == 401 ){
                layer.msg('登录失败！请输入正确账号或密码', {icon: 6,time:3000});
                return false;
            }else{
                layer.msg('登录失败！请输入正确账号或密码', {icon: 6,time:3000});
                return false;
            }

        },
        error:function () {
            layer.msg('登录失败！', {icon: 6,time:3000});
            return false;
        }
    });
})