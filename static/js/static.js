function getCookie(name) 
{ 
    var arr,reg=new RegExp("(^| )"+name+"=([^;]*)(;|$)");
 
    if(arr=document.cookie.match(reg)) 
        return decodeURIComponent(arr[2]); 
    else 
        return null; 
}
function login() {
    $('#formLogin').addClass('was-validated');
    let rid = $("#inputLoginRID").val(), password = $("#inputLoginPass").val();
    if (!rid || !password) {
        return $.confirm({
            theme: "bootstrap",
            type: "red",
            title: "提示",
            content: '<span class="fileitemTr">' + 'ID 和密码不能为空！' + "</span>",
            autoClose: "cancelAction|1200",
            typeAnimated: !0,
            buttons: {
                cancelAction: {
                    text: '关闭',
                    action: function() {}
                }
            }
        })
    }
    let form = new FormData();
    form.append("rid", rid),
    form.append("password", password);
    let settings = {
        async: !1,
        crossDomain: !0,
        url: "/login",
        method: "POST",
        headers: {
            "cache-control": "no-cache"
        },
        processData: !1,
        contentType: !1,
        mimeType: "multipart/form-data",
        data: form
    };
    $.ajax(settings).done((function(data) {
        let role = getCookie('role');
        switch(role) {
            case '学生':
                window.location.href = '/student';
                break;
            case '辅导员':
                window.location.href = '/assistant';
                break;
            case '教务处':
                window.location.href = '/office';
                break;
            case '考勤人员':
                window.location.href = '/attendance';
                break;
            case '管理员':
                window.location.href = '/admin';
                break;
        }
    })).fail((function(jqXHR) {
        let msg = JSON.parse(jqXHR.responseText).msg;
        switch(msg) {
            case '密码错误':
                $('#formLogin > div > div.invalid-feedback').text('密码错误！'),
                $("#inputLoginPass").val('');
                break;
            case '不存在此用户':
                $('#formLogin > div > div.invalid-feedback').text('不存在此用户'),
                $("#inputLoginRID").val('');
                break;
        }
        $.confirm({
            theme: "bootstrap",
            type: "red",
            title: "提示",
            content: '<span class="fileitemTr">' + 'ID 或密码错误，请重新输入' + "</span>",
            autoClose: "cancelAction|1200",
            buttons: {
                cancelAction: {
                    text: '关闭',
                    action: function() {}
                }
            }
        })
    }));
}
function regist() {
    $('#formRegist').addClass('was-validated');
    let rid = $('#inputRegistRID').val(), username = $("#inputRegistName").val(), password = $("#inputRegistPass").val();
    if (!rid || !username || !password) {
        return $.confirm({
            theme: "bootstrap",
            type: "red",
            title: "提示",
            content: '<span class="fileitemTr">' + 'ID、姓名和密码不能为空！' + "</span>",
            autoClose: "cancelAction|1200",
            typeAnimated: !0,
            buttons: {
                cancelAction: {
                    text: '关闭',
                    action: function() {}
                }
            }
        })
    }
    let form = new FormData();
    form.append("rid", rid),
    form.append("username", username),
    form.append("password", password);
    let settings = {
        async: !1,
        crossDomain: !0,
        url: "/regist",
        method: "POST",
        headers: {
            "cache-control": "no-cache"
        },
        processData: !1,
        contentType: !1,
        mimeType: "multipart/form-data",
        data: form
    };
    $.ajax(settings).done((function(data) {
        $.confirm({
            theme: "bootstrap",
            type: "green",
            title: "提示",
            content: '<span class="fileitemTr">' + '注册成功, 请重新登录！' + "</span>",
            autoClose: "cancelAction|800",
            typeAnimated: !0,
            buttons: {
                cancelAction: {
                    text: '确定',
                    action: function() {}
                }
            }
        });
        $("#inputLoginRID").val(rid),
        $("#inputLoginPass").val(password),
        $('body > div > div.row > div > div.row > div > button:nth-child(1)').click();
    })).fail((function(jqXHR) {
        401 === jqXHR.status ? (!0) : $.confirm({
            theme: "bootstrap",
            type: "red",
            title: "提示",
            content: '<span class="fileitemTr">' + 'ID 已存在, 请修改后重试!' + "</span>",
            autoClose: "cancelAction|2000",
            buttons: {
                cancelAction: {
                    text: '确定',
                    action: function() {}
                }
            }
        }),
        $('#formRegist > div:nth-child(1) > div.invalid-feedback').text('ID 已存在, 请修改后重试！'),
        $('#inputRegistRID').val(''),
        $('#inputRegistRID').focus()
    }))
}
$("#btnUser").on("click", (function() {
    $("#btnUser").text() === '登录 / 注册' ? (
        window.location.href = '/session'
    ): $.confirm({
        title: "确认",
        content: '<span class="fileitemTr">' + "确定退出登录?" + "</span>",
        theme: "bootstrap",
        type: "red",
        buttons: {
            confirm: {
                text: "确认",
                btnClass: "btn-red",
                action: () => {
                    let settings = {
                        async: !1,
                        crossDomain: !0,
                        url: "/login",
                        method: "DELETE",
                        headers: {
                            "cache-control": "no-cache"
                        },
                        processData: !1,
                        contentType: !1,
                        mimeType: "multipart/form-data"
                    };
                    $.ajax(settings).done(((data) => {
                        window.location.href = '/';
                    }
                    )).fail((function(jqXHR) {
                        $.confirm({
                            theme: "bootstrap",
                            type: "red",
                            title: "",
                            content: '<span class="fileitemTr">' + '操作失败，请联系管理员' + "</span>",
                            autoClose: "cancelAction|2000",
                            buttons: {
                                cancelAction: {
                                    text: '关闭',
                                    action: function() {}
                                }
                            }
                        })
                    }
                    ))
                }
            },
            cancel: {
                text: '取消',
                action: function() {}
            }
        }
    })
})),
$("#inputLoginRID").on("keypress", (function(event) {
    13 === event.keyCode && $("#inputLoginPass").focus();
})),
$("#inputLoginPass").on("keypress", (function(event) {
    13 === event.keyCode && login();
})),
$("#btnLogin").on("click", (function() {
    login();
})),
$("#inputRegistRID").on("keypress", (function(event) {
    13 === event.keyCode && $("#inputRegistName").focus();
})),
$("#inputRegistName").on("keypress", (function(event) {
    13 === event.keyCode && $("#inputRegistPass").focus();
})),
$("#inputRegistPass").on("keypress", (function(event) {
    13 === event.keyCode && regist();
})),
$("#btnRegist").on("click", (function() {
    regist();
})),
$("#btnUserCenter").on("click", (function() {
    let role = getCookie('role');
    switch(role) {
        case '学生':
            window.location.href = '/student';
            break;
        case '辅导员':
            window.location.href = '/assistant';
            break;
        case '教务处':
            window.location.href = '/office';
            break;
        case '考勤人员':
            window.location.href = '/attendance';
            break;
        case '管理员':
            window.location.href = '/admin';
            break;
    }
}));
(function() {
    let rid = getCookie('rid');
    let name = getCookie('name');
    if(rid && name) {
        $('#btnUser').text(rid + ' ' + name).removeClass('btn-secondary').addClass('btn-success'),
        $('#btnUserCenter').show(),
        $('#btnUser').show();
    }
})();
