function dialogInfo(msg, callback=function(){}, dismiss=true, autoClose=true) {
    let ac = "ok|800";
    if(!autoClose) ac = '';
    return $.confirm({
        title: "提示",
        content: '<span class="fileitemTr">' + msg + "</span>",
        theme: "bootstrap",
        type: "green",
        autoClose: ac,
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
function dialogWarning(msg, callback=function(){}, dismiss=true, autoClose=true) {
    let ac = "ok|1200";
    if(!autoClose) ac = '';
    return $.confirm({
        title: "警告",
        content: '<span class="fileitemTr">' + msg + "</span>",
        theme: "bootstrap",
        type: "orange",
        autoClose: ac,
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
function dialogError(msg, callback=function(){}, dismiss=false, autoClose=true) {
    let ac = "ok|2000";
    if(!autoClose) ac = '';
    return $.confirm({
        title: "错误",
        content: '<span class="fileitemTr">' + msg + "</span>",
        theme: "bootstrap",
        type: "red",
        autoClose: ac,
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
function dialogConfirm(title, msg, confirm=function(){}, cancel=function(){}) {
    $.confirm({
        title: title,
        content: '<span class="fileitemTr">' + msg + "</span>",
        theme: "bootstrap",
        type: "red",
        autoClose: '',
        backgroundDismiss: false,
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
function createConfirmModal(kw={}) {
    let args = ['$button', 'indirectButton', 'id', 'title', 'body', 'buttonClick', 'confirmClick', 'cancelClick'];
    for(let k in kw) if(args.indexOf(k) < 0) throw new ReferenceError(`无法识别的关键字 "${k}".`);

    let $button = kw.$button || $();
    let id = kw.id || `_${(new Date()).valueOf()}_${parseInt(Math.random() * 1000)}`;
    let indirectButton = kw.indirectButton === undefined? false: true;
    let title = kw.title || '标题';
    let body = kw.body || '内容';
    let buttonClick = kw.buttonClick || function(){};
    let confirmClick = kw.confirmClick || function(){};
    let cancelClick = kw.cancelClick || function(){};

    let $modal = $(document.createElement('div'));
    $modal.attr('id', id),
    $modal.addClass('modal fade'),
    $modal.attr('role', 'dialog');

    let $_btn = $(document.createElement('button'));
    if(indirectButton) {
        $_btn.hide();
        $_btn.attr('data-bs-toggle', 'modal'),
        $_btn.attr('data-bs-target', `#${id}`),
        $button.on('click', e => buttonClick(e, $modal, $_btn)),
        $(document.body).append($_btn);
    }
    else {
        $button.attr('data-bs-toggle', 'modal'),
        $button.attr('data-bs-target', `#${id}`),
        $button.on('click', e => buttonClick(e, $modal, $button));
    }
    $modal.setTitle = function(title) {
        $(this).find('.modal-title').html(title);
    };
    $modal.show = () => {
        if(!$modal.hasClass('show')) {
            indirectButton? $_btn.click(): $button.click();
        }
    };
    $modal.hide = () => {
        if($modal.hasClass('show')) {
            indirectButton? $_btn.click(): $button.click();
        }
    };

    $modal.html(`<div class="modal-dialog"> <div class="modal-content"> <div class="modal-header"> <div class="modal-title">${title}</div> <button class="btn-close" data-bs-dismiss="modal"></button> </div> <div class="modal-body">${body}</div> <div class="modal-footer"> <button class="btn btn-secondary" data-bs-dismiss="modal">取消</button> <button class="btn btn-primary">提交</button> </div> </div> </div>`);
    $btnCancel = $modal.find('div.modal-footer > button.btn.btn-secondary');
    $btnConfirm = $modal.find('div.modal-footer > button.btn.btn-primary');
    $btnCancel.on('click', e => cancelClick(e, $modal, $btnCancel)),
    $btnConfirm.on('click', e => confirmClick(e, $modal, $btnConfirm)),
    $(document.body).append($modal);
}
function bindDragSelectEvent(kw={}) {
    let args = ['$table', 'uniqueId', 'uniqueIdType', 'onStart', 'onEnd'];
    for(let k in kw) if(args.indexOf(k) < 0) throw new ReferenceError(`无法识别的关键字 "${k}".`);

    let $table = kw.$table || $();
    let uniqueId = kw.uniqueId || '';
    let uniqueIdType = kw.uniqueIdType || 'string';
    let onStart = kw.onStart || function(){};
    let onEnd = kw.onEnd || function(){};

    $($table).on('mousedown', e => {
        if($(e.target).closest('thead').length) return;
        $table.selector = {
            mousedown: true,
            drag: false,
            x: e.pageX,
            y: e.pageY,
            startRow: [uniqueIdType === 'int'? parseInt($(e.target).closest('tr').attr('data-uniqueid')): $(e.target).closest('tr').attr('data-uniqueid')],
        }
        if(!uniqueId) return;

        $($table).find('tbody > tr').not('[data-dragbinded="true"]').each((index, element) => {
            $(element).attr('data-dragbinded', 'true');
            let offset = 3; // 设置判定误差, 防止隔行选择

            $(element).on('mouseenter', (e) => {
                if(!$table.selector.drag) return;
                let _uniqueid = $(e.currentTarget).attr('data-uniqueid');
                let originY = $table.selector.y;
                let checks = [];
                if(e.pageY > originY) {
                    if(e.offsetY + offset >= 0) checks.push(uniqueIdType === 'int'? parseInt(_uniqueid): _uniqueid);
                }
                else {
                    if(e.offsetY + offset > 0) checks.push(uniqueIdType === 'int'? parseInt(_uniqueid): _uniqueid);
                }
                $table.bootstrapTable('checkBy', {field: uniqueId, values: checks});
            });
            $(element).on('mouseleave', (e) => {
                if(!$table.selector.drag) return;
                let _uniqueid = $(e.currentTarget).attr('data-uniqueid');
                let originY = $table.selector.y;
                let unchecks = [];
                if(e.pageY > originY) {
                    if(e.offsetY < 0) unchecks.push(uniqueIdType === 'int'? parseInt(_uniqueid): _uniqueid);
                }
                else {
                    if(e.offsetY > 0) unchecks.push(uniqueIdType === 'int'? parseInt(_uniqueid): _uniqueid);
                }
                $table.bootstrapTable('uncheckBy', {field: uniqueId, values: unchecks});
            });
        });
    }),
    $($table).on('mousemove', e => {
        if(!$table.selector || !$table.selector.mousedown) return;
        e.preventDefault();
        if(!$table.selector.drag) {
            $table.selector.drag = true;
            $table.bootstrapTable('checkBy', {field: uniqueId, values: $table.selector.startRow});
            $('#drag-box').css({
                'z-index': 999,
                'left': e.pageX + 'px',
                'top': e.pageY + 'px',
                'display': 'block',
            });
            if(!uniqueId) return;

            onStart(e, $table);
            if(!e.ctrlKey) $table.bootstrapTable('uncheckAll');
            $table.bootstrapTable('checkBy', {field: uniqueId, values: $table.selector.startRow});
        }
        // 计算拖选框二维
        let originX = $table.selector.x;
        let originY = $table.selector.y;
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
    $($table).on('mouseup', e => {
        if(!$table.selector || !$table.selector.mousedown) return;
        $table.selector.mousedown = false;
        $table.selector.drag = false;
        onEnd(e, $table);
        $('#drag-box').css({
            'z-index': -999,
            'left': 0,
            'top': 0,
            'width': 0,
            'height': 0,
            'display': 'none',
        });
    }),
    $($table).on('mouseleave', e => {
        if(!$table.selector || !$table.selector.mousedown) return;
        $table.selector.mousedown = false;
        $table.selector.drag = false;
        onEnd(e, $table);
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
        return dialogWarning('ID 和密码不能为空!');
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
        dialogWarning(msg);
    }));
}
function logoff() {
    dialogConfirm('登出', "确定退出登录?", function() {
        $.ajax({
            url: "/login",
            method: "DELETE",
        }).done(((data) => {
            dialogInfo('登出成功, 即将返回首页...', function() {
                window.location.href = '/';
            }, false);
        })).fail((function(jqXHR) {
            dialogError(JSON.parse(jqXHR.responseText).msg);
        }));
    });
}
function regist() {
    $('#formRegist').addClass('was-validated');
    let rid = $('#inputRegistRID').val(), username = $("#inputRegistName").val(), password = $("#inputRegistPass").val();
    if (!rid || !username || !password) {
        return dialogWarning('ID、姓名和密码不能为空!');
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
        dialogInfo('注册成功, 请重新登录!', function() {
            $("#inputLoginRID").val(rid),
            $("#inputLoginPass").val(password),
            $('body > div > div.row > div > div.row > div > button:nth-child(1)').click();
        });
    })).fail((function(jqXHR) {
        dialogWarning('ID 已存在, 请修改后重试!'),
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
        let itv = setInterval(() => {
            $.ajax({
                type: 'get',
                url: '/online',
            }).done((data => {
                if(data.state === 'fail') {
                    itv && clearInterval(itv);
                    dialogConfirm('会话已过期', '登录已过期, 请重新登录!', function() {
                        window.location.href = '/session';
                    }, dismiss=false, autoClose=false);
                }
            })).fail((function(jqXHR) {
                dialogError(JSON.parse(jqXHR.responseText).msg);
            }));
        }, 1000 * 60 * 32);
    }
});
