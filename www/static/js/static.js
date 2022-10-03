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
            case '/session':
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
    let list = $(studentTable).bootstrapTable('getSelections');
    console.log(list)
    $.confirm({
        title: '删除学生信息',
        content: '<form id="test" class="my-2"> <div class="row"> <div class="col"> <div class="form-floating"> <input class="form-control" type="text" name="sid"> <label class="form-label float-start" for="sid">学号</label> </div> </div> <div class="col"> <div class="form-floating"> <input class="form-control" type="text" name="name"> <label class="form-label" for="name">姓名</label> </div> </div> <div class="col"> <div class="form-floating"> <input class="form-control" type="text" name="gender"> <label class="form-label" for="gender">性别</label> </div> </div> </div> <div class="form-floating mt-3"> <input class="form-control" type="text" name="department"> <label class="form-label" for="department">学部</label> </div> <div class="form-floating mt-3"> <input class="form-control" type="text" name="faculty"> <label class="form-label" for="faculty">系别</label> </div> <div class="form-floating mt-3"> <input class="form-control" type="text" name="major"> <label class="form-label" for="major">专业</label> </div> <div class="form-floating mt-3"> <input class="form-control" type="text" name="class"> <label class="form-label" for="class">班级</label> </div> </form>',
        theme: 'bootstrap',
        class: 'rounded',
        buttons: {
            submit: {
                text: '提交',
                btnClass: 'btn-primary',
                action: function() {
                    let sid = document.forms.test['sid'].value;
                    let name = document.forms.test['name'].value;
                    let gend = document.forms.test['gender'].value;
                    let depa = document.forms.test['department'].value;
                    let facu = document.forms.test['faculty'].value;
                    let majo = document.forms.test['major'].value;
                    let clas = document.forms.test['class'].value;
                
                    let form = new FormData();
                    form.append('sid', sid);
                    form.append('name', name);
                    form.append('gender', gend);
                    form.append('department', depa);
                    form.append('faculty', facu);
                    form.append('major', majo);
                    form.append('class', clas);
                    console.log(sid,name,gend,depa,facu,majo,clas);
                },
            },
            cancel: {
                text: '取消',
                btnClass: 'btn-danger',
                action: function() {

                }
            },
        },
    })
}
function btnAdminDeleteTeacherClick() {
    let list = $(studentTable).bootstrapTable('getSelections');
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
