function dialog_info(msg, callback=function(){}, dismiss=true) {
    return $.confirm({
        title: "提示",
        content: '<span class="fileitemTr">' + msg + "</span>",
        theme: "bootstrap",
        type: "green",
        autoClose: "ok|800",
        backgroundDismiss: dismiss,
        buttons: {
            ok: {
                text: '确定',
                keys: ['esc', 'enter'],
                action: callback
            }
        }
    });
}
function dialog_warning(msg, callback=function(){}, dismiss=true) {
    return $.confirm({
        title: "警告",
        content: '<span class="fileitemTr">' + msg + "</span>",
        theme: "bootstrap",
        type: "orange",
        autoClose: "ok|1200",
        backgroundDismiss: dismiss,
        buttons: {
            ok: {
                text: '确定',
                keys: ['esc', 'enter'],
                action: callback
            }
        }
    });
}
function dialog_error(msg, callback=function(){}, dismiss=false) {
    return $.confirm({
        title: "错误",
        content: '<span class="fileitemTr">' + msg + "</span>",
        theme: "bootstrap",
        type: "red",
        autoClose: "ok|2000",
        backgroundDismiss: dismiss,
        buttons: {
            ok: {
                text: '确定',
                keys: ['esc', 'enter'],
                action: callback
            }
        }
    });
}
function dialog_confirm(title, msg, confirm=function(){}, cancel=function(){}) {
    $.confirm({
        title: title,
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
                keys: ['esc', 'enter'],
                action: cancel
            }
        }
    });
}
function modal_form(options={}) {
    let sHTML = ` <div class="modal fade" id="${options.modalID}" role="dialog"> <div class="modal-dialog"> <div class="modal-content"> <div class="modal-header"> <div class="modal-title">${options.title}</div> <button class="btn-close" data-bs-dismiss="modal"></button> </div> <div class="modal-body">${sForm}</div> <div class="modal-footer"> <button class="btn btn-primary" onclick="${onSubmit.name}()">提交</button> <button class="btn btn-danger" data-bs-dismiss="modal" onclick="${onClose.name}()">关闭</button> </div> </div> </div> </div>`;
}
function bindDragSelectEvent(table, bootstrapTable, field) {
    $(table).on('mousedown', function(e) {
        this.selector = {
            mousedown: true,
            x: e.pageX,
            y: e.pageY,
        }
        if(e.target.parentNode.parentNode.tagName === 'THEAD') {
            this.selector.mousedown = false;
            return;
        }
        if(e.ctrlKey && e.shiftKey) {
            
        }
        else if(e.ctrlKey) {
            // $(this).find('tbody > tr.selected').removeClass('selected');
        }
        else if(e.shiftKey) {
            
        }
        else {
            bootstrapTable().uncheckAll();
        }
        // $(e.target.parentNode).addClass('selected');
        values = [];
        $(this).find('tbody > tr').not('[data-drag-bind="true"]').each((index, element) => {
            $(element).attr('data-drag-bind', 'true');
            let offset = 5; // 设置误差防止隔行选择
            $(element).on('mouseenter', (e) => {
                if(!this.selector.mousedown) return; 
                let tr = e.currentTarget;
                let originY = this.selector.y;
                let offsetY = e.offsetY;
                if(e.pageY > originY) {
                    if(offsetY >= 0) $(tr).addClass('selected');
                }
                else {
                    if(e.offsetY > 0) $(tr).addClass('selected');
                }
                bootstrapTable('checkBy', {field: field, values: values})
            });
            $(element).on('mouseleave', (e) => {
                if(!this.selector.mousedown) return; 
                let tr = e.currentTarget;
                let originY = this.selector.y;
                let offsetY = e.offsetY;
                let nowY = e.pageY;
                if(nowY > originY) {
                    if(offsetY < 0) $(tr).removeClass('selected');
                }
                else {
                    if(e.offsetY > 0) $(tr).removeClass('selected');
                }
            });
        }),
        $('#drag-box').css({
            'z-index': 999,
            'left': e.pageX + 'px',
            'top': e.pageY + 'px',
            'display': 'block',
        });
    }),
    $(table).on('mousemove', function(e) {
        if(!this.selector || !this.selector.mousedown) return;
        e.preventDefault();
        // 计算拖选框二维
        let originX = this.selector.x;
        let originY = this.selector.y;
        let nowY = e.pageY;
        let nowX = e.pageX;
        let _x = originX, _y = originY, _width = Math.abs(nowX - originX), _height = Math.abs(nowY - originY);
        if(nowY > originY) {
            if(nowX > originX) {
                _width = nowX - originX;
                _height = nowY - originY;
            }
            else {
                _x -= originX - nowX;
            }
        }
        else {
            if(nowX > originX) {
                _y -= originY - nowY;
            }
            else {
                _x -= originX - nowX;
                _y -= originY - nowY;
            }
        }
        $('#drag-box').css({
            'left': _x + 'px',
            'top': _y + 'px',
            'width': _width + 'px',
            'height': _height + 'px',
        });
    }),
    $(table).on('mouseup', function(e) {
        if(!this.selector) return;
        this.selector.mousedown = false;
        $('#drag-box').css({
            'z-index': -999,
            'left': 0,
            'top': 0,
            'width': 0,
            'height': 0,
            'display': 'none',
        });
    }),
    $(table).on('mouseleave', function(e) {
        if(!this.selector || !this.selector.mousedown) return;
        this.selector.mousedown = false;
        $('#drag-box').css({
            'z-index': -999,
            'left': 0,
            'top': 0,
            'width': 0,
            'height': 0,
            'display': 'none',
        });
    });
}
function login() {
    $('#formLogin').addClass('was-validated');
    let rid = $("#inputLoginRID").val(), password = $("#inputLoginPass").val();
    if (!rid || !password) {
        return dialog_warning('ID 和密码不能为空!');
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
        window.location.href = '/user';
    })).fail((function(jqXHR) {
        let msg = JSON.parse(jqXHR.responseText).msg;
        switch(msg) {
            case '密码错误':
                $('#formLogin > div > div.invalid-feedback').text('密码错误!'),
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
    dialog_confirm('登出', "确定退出登录?", function() {
        $.ajax({
            url: "/login",
            method: "DELETE",
        }).done(((data) => {
            dialog_info('登出成功, 即将返回首页...', function() {
                window.location.href = '/';
            }, false);
        })).fail((function(jqXHR) {
            dialog_error(JSON.parse(jqXHR.responseText).msg);
        }));
    });
}
function regist() {
    $('#formRegist').addClass('was-validated');
    let rid = $('#inputRegistRID').val(), username = $("#inputRegistName").val(), password = $("#inputRegistPass").val();
    if (!rid || !username || !password) {
        return dialog_warning('ID、姓名和密码不能为空!');
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
        dialog_info('注册成功, 请重新登录!', function() {
            $("#inputLoginRID").val(rid),
            $("#inputLoginPass").val(password),
            $('body > div > div.row > div > div.row > div > button:nth-child(1)').click();
        });
    })).fail((function(jqXHR) {
        dialog_warning('ID 已存在, 请修改后重试!'),
        $('#formRegist > div:nth-child(1) > div.invalid-feedback').text('ID 已存在, 请修改后重试!'),
        $('#inputRegistRID').val(''),
        $('#inputRegistRID').focus()
    }))
}
$("#btnUserCenter").on("click", (function() {
    window.location.href = '/user';
})),
$('#btnUserLR').on('click', function() {
    if($(this).text() === '登录 / 注册') {
        window.location.href = '/session';
        return;
    }
    logoff();
}),
$('#btnShowLogin').on('click', function() {
    $('#formLogin').show(),
    $('#formRegist').hide(),
    $('#formRegist').removeClass('was-validated');
}),
$('#btnShowRegist').on('click', function() {
    $('#formLogin').hide(),
    $('#formRegist').show(),
    $('#formLogin').removeClass('was-validated');
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
$('.itemcard > .itemcard-menu > .pagination > .page-item').not('.page-item.disabled').on('click', function() {
    let ancestry = this.parentNode.parentNode.parentNode;

    $(this).siblings().filter('.page-item.active').removeClass('active'),
    $(this).addClass('active'),
    $(ancestry).children('.itemcard-page.active').removeClass('active'),
    $(ancestry).children(`[data-itemcard-page="${this.getAttribute('data-itemcard-menu')}"]`).addClass('active');
}),
$(document).ready(function() {
    if($('#btnUserLR').text() !== '登录 / 注册') {
        switch(window.location.pathname) {
            case '/':
            case '/login':
            case '/regist':
            case '/session':
                $('#btnUserCenter').show();
                break;
        }
    }
});
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
    let list = $('#studentTable').bootstrapTable('getSelections');
    if(list.length === 0) return dialog_warning('未选择任何数据!');
    let arr1 = [];
    for(row of list) {
        arr1.push('<div class="col">' + row.sid + ' ' + row.name + "</div>");
    }
    let arr2 = [];
    if(arr1.length % 2 === 0) {
        for(i in arr1) {
            if(i % 2 !== 0) {
                arr2.push('<div class="row">' + arr1[i-1] + arr1[i] + '</div>')
            }
        }
    }
    else {
        if(arr1.length === 1) {
            arr2.push('<div class="row">' + arr1[0] + '</div>')
        }
        else {
            arr2.push('<div class="row">' + arr1[0])
            for(i in arr1) {
                if(i > 0 && i % 2 === 0 && i !== arr1.length - 1) {
                    arr2.push(arr1[i-1] + '</div><div class="row">' + arr1[i]);
                }
                if(i === arr1.length - 1) {
                    arr2[arr2.length - 1] = arr2[arr2.length - 1] + arr1[arr1.length - 1] + '</div>';
                }
            }
        }
    }
    let html = '<div class="container">' + arr2.join('') + '</div>';
    dialog_confirm('警告', `<div class="my-1 text-center text-danger">确定要删除 ${list.length} 条数据吗, 该操作无法撤销!</div><br>` + html, () => {
        let sids = [];
        for(row of list) sids.push(row.sid);
        let form = new FormData();
        form.append('sids', sids);let settings = {
            async: !1,
            crossDomain: !0,
            url: "/admin/students",
            method: "delete",
            headers: {
                "cache-control": "no-cache"
            },
            processData: !1,
            contentType: !1,
            mimeType: "multipart/form-data",
            data: form
        };
        $.ajax(settings).done((function(data) {
            $('#studentTable').bootstrapTable('refresh', {});
        })).fail((function(jqXHR) {
            let msg = JSON.parse(jqXHR.responseText).msg;
            dialog_warning(msg);
        }));
    });
}
function btnAdminDeleteTeacherClick() {
    let list = $('#teacherTable').bootstrapTable('getSelections');
    if(list.length === 0) return dialog_warning('未选择任何数据!');
    let arr1 = [];
    for(row of list) {
        arr1.push('<div class="col">' + row.tid + ' ' + row.name + "</div>");
    }
    let arr2 = [];
    if(arr1.length % 2 === 0) {
        for(i in arr1) {
            if(i % 2 !== 0) {
                arr2.push('<div class="row">' + arr1[i-1] + arr1[i] + '</div>')
            }
        }
    }
    else {
        if(arr1.length === 1) {
            arr2.push('<div class="row">' + arr1[0] + '</div>')
        }
        else {
            arr2.push('<div class="row">' + arr1[0])
            for(i in arr1) {
                if(i > 0 && i % 2 === 0 && i !== arr1.length - 1) {
                    arr2.push(arr1[i-1] + '</div><div class="row">' + arr1[i]);
                }
                if(i === arr1.length - 1) {
                    arr2[arr2.length - 1] = arr2[arr2.length - 1] + arr1[arr1.length - 1] + '</div>';
                }
            }
        }
    }
    let html = '<div class="container">' + arr2.join('') + '</div>';
    dialog_confirm('警告', `<div class="my-1 text-center text-danger">确定要删除 ${list.length} 条数据吗, 该操作无法撤销!</div><br>` + html, () => {
        let tids = [];
        for(row of list) tids.push(row.tid);
        let form = new FormData();
        form.append('tids', tids);let settings = {
            async: !1,
            crossDomain: !0,
            url: "/admin/teachers",
            method: "delete",
            headers: {
                "cache-control": "no-cache"
            },
            processData: !1,
            contentType: !1,
            mimeType: "multipart/form-data",
            data: form
        };
        $.ajax(settings).done((function(data) {
            $('#teacherTable').bootstrapTable('refresh', {});
        })).fail((function(jqXHR) {
            let msg = JSON.parse(jqXHR.responseText).msg;
            dialog_warning(msg);
        }));
    });
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
        return dialog_error('操作失败, 请联系管理员!');
    }
    let tid = $(ancestry).children().first().text();
    if(!tid) {
        return dialog_error('操作失败, 请联系管理员!');
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
