#!/usr/bin/env python
# -*- coding: utf-8 -*-
from flask import request, session, make_response, render_template
from views import admin_blue


@admin_blue.route('/')
def root():
    rid = request.cookies.get('rid')
    if not rid or rid not in session:
        return make_response({'state': 'fail', 'msg': '请登录后操作'}, 401)
    args = {
        'rid': session[rid]['rid'],
        'name': session[rid]['name'],
    }
    return render_template('/admin.html', **args)
