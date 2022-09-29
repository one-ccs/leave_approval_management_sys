#!/usr/bin/env python
# -*- coding: utf-8 -*-
from flask import request, session, make_response, render_template
from app.views import office_blue
from app.classes import Database

db = Database('./db/data.db')


@office_blue.before_request
def check_login():
    rid = request.cookies.get('rid')
    if not rid or rid not in session:
        return make_response({'state': 'fail', 'msg': '请登录后操作'}, 401)
    if session.get(rid)['role'] != '教务处':
        return make_response({'state': 'fail', 'msg': '非法操作, 拒绝访问'}, 403)


@office_blue.route('/')
def root():
    rid = request.cookies.get('rid')
    args = {
        'rid': session[rid]['rid'],
        'name': session[rid]['name'],
    }
    return render_template('/office.html', **args)
