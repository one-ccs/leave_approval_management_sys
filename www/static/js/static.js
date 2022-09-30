function getCookie(name) 
{ 
    var arr,reg=new RegExp("(^| )"+name+"=([^;]*)(;|$)");
 
    if(arr=document.cookie.match(reg)) 
        return decodeURIComponent(arr[2]); 
    else 
        return null; 
}
function dialog_info(msg, callback=function(){}) {
    return $.confirm({
        title: "提示",
        content: '<span class="fileitemTr">' + msg + "</span>",
        theme: "bootstrap",
        type: "green",
        autoClose: "cancelAction|800",
        buttons: {
            cancelAction: {
                text: '确定',
                action: callback
            }
        }
    });
}
function dialog_warning(msg, callback=function(){}) {
    return $.confirm({
        title: "警告",
        content: '<span class="fileitemTr">' + msg + "</span>",
        theme: "bootstrap",
        type: "orange",
        autoClose: "cancelAction|1200",
        buttons: {
            cancelAction: {
                text: '确定',
                action: callback
            }
        }
    });
}
function dialog_error(msg, callback=function(){}) {
    return $.confirm({
        title: "错误",
        content: '<span class="fileitemTr">' + msg + "</span>",
        theme: "bootstrap",
        type: "red",
        autoClose: "cancelAction|2000",
        buttons: {
            cancelAction: {
                text: '确定',
                action: callback
            }
        }
    });
}
function dialog_confirm(msg, confirm=function(){}, cancel=function(){}) {
    $.confirm({
        title: "消息",
        content: '<span class="fileitemTr">' + msg + "</span>",
        theme: "bootstrap",
        type: "red",
        buttons: {
            confirm: {
                text: "确认",
                btnClass: "btn-red",
                action: confirm
            },
            cancel: {
                text: '取消',
                action: cancel
            }
        }
    });
}
function login() {
    $('#formLogin').addClass('was-validated');
    let rid = $("#inputLoginRID").val(), password = $("#inputLoginPass").val();
    if (!rid || !password) {
        return dialog_warning('ID 和密码不能为空！');
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
            case '考勤':
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
        dialog_warning(msg);
    }));
}
function logoff() {
    $.confirm({
        title: "登出",
        content: '<span class="fileitemTr">' + "确定退出登录?" + "</span>",
        theme: "bootstrap",
        type: "red",
        buttons: {
            confirm: {
                text: "确认",
                btnClass: "btn-red",
                action: () => {
                    $.ajax({
                        url: "/login",
                        method: "DELETE",
                    }).done(((data) => {
                        dialog_info('登出成功, 即将返回首页...', function() {
                            window.location.href = '/';
                        });
                    })).fail((function(jqXHR) {
                        dialog_error(JSON.parse(jqXHR.responseText).msg);
                    }));
                }
            },
            cancel: {
                text: '取消',
                action: function() {}
            }
        }
    });
}
function regist() {
    $('#formRegist').addClass('was-validated');
    let rid = $('#inputRegistRID').val(), username = $("#inputRegistName").val(), password = $("#inputRegistPass").val();
    if (!rid || !username || !password) {
        return dialog_warning('ID、姓名和密码不能为空！');
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
        dialog_info('注册成功, 请重新登录！', function() {
            $("#inputLoginRID").val(rid),
            $("#inputLoginPass").val(password),
            $('body > div > div.row > div > div.row > div > button:nth-child(1)').click();
        });
    })).fail((function(jqXHR) {
        dialog_warning('ID 已存在, 请修改后重试!'),
        $('#formRegist > div:nth-child(1) > div.invalid-feedback').text('ID 已存在, 请修改后重试！'),
        $('#inputRegistRID').val(''),
        $('#inputRegistRID').focus()
    }))
}
$('#btnUserLR').on('click', function() {
    if($(this).text() === '登录 / 注册' || !getCookie('name')) {
        window.location.href = '/session';
    }
    else {
        logoff();
    }
}),
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
        case '考勤':
            window.location.href = '/attendance';
            break;
        case '管理员':
            window.location.href = '/admin';
            break;
    }
})),
$('.itemcard > .itemcard-menu > .pagination > .page-item').not('.page-item.disabled').on('click', function() {
    let ancestry = this.parentNode.parentNode.parentNode;

    $(this).siblings().filter('.page-item.active').removeClass('active'),
    $(this).addClass('active'),
    $(ancestry).children('.itemcard-page.active').removeClass('active'),
    $(ancestry).children(`[data-itemcard-page="${this.getAttribute('data-itemcard-menu')}"]`).addClass('active');
}),
$('table').on('mousedown', function(e) {
    this.selector = {
        mousedown: true,
        firstX: e.pageX,
        firstY: e.pageY,
        data: {
            length: 0,
            list: [],
        },
    }
    $(this).find('tbody > tr.table-active').removeClass('table-active'),
    $(e.target.parentNode).addClass('table-active');
    $(this).find('tbody > tr').not('[data-drag-bind="true"]').each((index, element) => {
        $(element).attr('data-drag-bind', 'true');
        $(element).on('mouseenter', (e) => {
            if(!this.selector.mousedown) return; 
            let tr = e.target.parentNode;
            tr.enterY = e.pageY;
            $(tr).addClass('table-active');
        });
        $(element).on('mouseleave', (e) => {
            if(!this.selector.mousedown) return; 
            let tr = e.target.parentNode;
            tr.leaveY = e.pageY;
            if(tr.leaveY < tr.enterY) {
                $(tr).removeClass('table-active');
            }
        });
    }),
    $('#drag-box').css({
        'left': e.pageX + 'px',
        'top': e.pageY + 'px',
        'display': 'block',
    });
}),
$('table').on('mousemove', function(e) {
    if(!this.selector || !this.selector.mousedown) return;
    $('#drag-box').css({
        'width': e.pageX - this.selector.firstX + 'px',
        'height': e.pageY - this.selector.firstY + 'px',
    });
}),
$('table').on('mouseup', function(e) {
    this.selector.mousedown = false;
    let selected = $(this).find('tbody > tr.table-active');
    for(row of selected) {
        let rowData = $(this).DataTable().row(row).data();
        let sid = rowData.sid;
        let name = rowData.name;
        this.selector.data.list.push({
            sid: sid,
            name: name,
        });
    }
    this.selector.data.length = selected.length;
    $('#drag-box').css({
        'left': 0,
        'top': 0,
        'width': 0,
        'height': 0,
        'display': 'none',
    });
}),
$(document).ready(function() {
    let rid = getCookie('rid');
    let name = getCookie('name');
    if(rid && name) {
        $('#btnUserLR').html('<i class="fa fa-user-circle me-2"></i>' + rid + ' ' + name),
        $('#btnUserLR').removeClass('btn-secondary').addClass('btn-success');
        switch(window.location.pathname) {
            case '/':
            case '/login':
            case '/regist':
                $('#btnUserCenter').show();
                break;
        }
    }
});
function btnRevokeClick(self) {
    let ancestry = self.parentNode.parentNode;
    if(!ancestry) {
        return dialog_error('操作失败，请联系管理员！');
    }
    let lid = $(ancestry).children().first().text();
    if(!lid) {
        return dialog_error('操作失败，请联系管理员！');
    }
    dialog_confirm("确定撤销申请吗?", () => {
        let form = new FormData();
        form.append('id', lid);
        $.ajax({
            url: "/student/leaves",
            method: "DELETE",
            mimeType: "multipart/form-data",
            data: form
        }).done((function(data) {
            $('[data-itemcard-menu="2"]').click();
        })).fail((function(jqXHR) {
            dialog_error(JSON.parse(jqXHR.responseText).msg);
        }));
    });
}
function btnBrowseClick(self) {
    
}
function btnRejectClick(self) {

}
function btnAgreeClick(self) {

}
function btnReportClick(self) {

}
function getActiveRowData(table) {

}
function btnAdminDeleteStudentClick() {
    let list = studentTable.get(0).selector.data.list;
    console.log(list)
}
function btnAdminDeleteTeacherClick() {
    let list = studentTable.get(0).selector.data.list;
    console.log(list)
}
function btnModifyStudentClick(self) {
    let dsid = $(self).attr('data-sid');
    let row = null;
    for(_row of studentTable.get(0).rows) {
        if($(_row.cells.item(1)).text() === dsid) {
            row = _row;
            break;
        }
    }
    if(row) {
        document.forms.modifyStudentForm['sid'].value        = $(row.cells.item(1)).text();
        document.forms.modifyStudentForm['name'].value       = $(row.cells.item(2)).text();
        document.forms.modifyStudentForm['gender'].value     = $(row.cells.item(3)).text();
        document.forms.modifyStudentForm['department'].value = $(row.cells.item(4)).text();
        document.forms.modifyStudentForm['faculty'].value    = $(row.cells.item(5)).text();
        document.forms.modifyStudentForm['major'].value      = $(row.cells.item(6)).text();
        document.forms.modifyStudentForm['class'].value      = $(row.cells.item(7)).text();
    }
}
function btnModifyStudentSubmitClick(self) {
    let sid = document.forms.modifyStudentForm['sid'].value;
    let name = document.forms.modifyStudentForm['name'].value;
    let gend = document.forms.modifyStudentForm['gender'].value;
    let depa = document.forms.modifyStudentForm['department'].value;
    let facu = document.forms.modifyStudentForm['faculty'].value;
    let majo = document.forms.modifyStudentForm['major'].value;
    let clas = document.forms.modifyStudentForm['class'].value;

    let form = new FormData();
    form.append('sid', sid);
    form.append('name', name);
    form.append('gender', gend);
    form.append('department', depa);
    form.append('faculty', facu);
    form.append('major', majo);
    form.append('class', clas);
    $.ajax({
        async: !1,
        crossDomain: !0,
        url: "/admin/students",
        method: "POST",
        headers: {
            "cache-control": "no-cache"
        },
        processData: !1,
        contentType: !1,
        mimeType: "multipart/form-data",
        data: form
    }).done((function(data) {
        dialog_info('修改成功, 请刷新页面查看');
    })).fail((function(jqXHR) {
        dialog_error(JSON.parse(jqXHR.responseText).msg);
    }));
}
function btnModifyTeacherClick(self) {
    let dtid = $(self).attr('data-tid');
    let row = null;
    for(_row of teacherTable.get(0).rows) {
        if($(_row.cells.item(1)).text() === dtid) {
            row = _row;
            break;
        }
    }
    if(row) {
        document.forms.modifyTeacherForm['tid'].value      = $(row.cells.item(1)).text();
        document.forms.modifyTeacherForm['name'].value     = $(row.cells.item(2)).text();
        document.forms.modifyTeacherForm['gender'].value   = $(row.cells.item(3)).text();
        document.forms.modifyTeacherForm['telphone'].value = $(row.cells.item(4)).text();
        document.forms.modifyTeacherForm['role'].value     = $(row.cells.item(5)).text();
    }
}
function btnModifyTeacherSubmitClick(self) {
    let ancestry = self.parentNode.parentNode;
    if(!ancestry) {
        return dialog_error('操作失败，请联系管理员！');
    }
    let tid = $(ancestry).children().first().text();
    if(!tid) {
        return dialog_error('操作失败，请联系管理员！');
    }
    let form = new FormData();
    form.append('id', tid);
    $.ajax({
        async: !1,
        crossDomain: !0,
        url: "/admin/teachers",
        method: "POST",
        headers: {
            "cache-control": "no-cache"
        },
        processData: !1,
        contentType: !1,
        mimeType: "multipart/form-data",
        data: form
    }).done((function(data) {
        dialog_info('修改成功, 请刷新页面查看');
    })).fail((function(jqXHR) {
        dialog_error(JSON.parse(jqXHR.responseText).msg);
    }));
}
