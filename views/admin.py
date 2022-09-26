#!/usr/bin/env python
# -*- coding: utf-8 -*-
from flask import request, session, make_response, render_template
from views import admin_blue
from classes import Database

db = Database('./db/data.db')


@admin_blue.route('/')
def root():
    rid = request.cookies.get('rid')
    if not rid or rid not in session:
        return make_response({'state': 'fail', 'msg': '请登录后操作'}, 401)
    if session.get(rid)['role'] != '管理员':
        return make_response({'state': 'fail', 'msg': '非法操作, 拒绝访问'}, 403)
    args = {}
    result = db.execute('SELECT * FROM admin WHERE aid=?', (rid, ))
    if result and len(result) > 0:
        result = result[0]
        args = {
            'aid': result['aid'],
            'name': result['name'],
            'gender': result['gender'],
        }
    else:
        args = {
            'aid': session[rid]['rid'],
            'name': session[rid]['name'],
        }
    return render_template('/admin.html', **args)
