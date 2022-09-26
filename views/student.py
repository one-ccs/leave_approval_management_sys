#!/usr/bin/env python
# -*- coding: utf-8 -*-
from flask import request, session, make_response, render_template
from views import student_blue
from classes import Database

db = Database('./db/data.db')


@student_blue.route('/')
def root():
    rid = request.cookies.get('rid')
    if not rid or rid not in session:
        return make_response({'state': 'fail', 'msg': '请登录后操作'}, 401)
    if session.get(rid)['role'] != '学生':
        return make_response({'state': 'fail', 'msg': '非法操作, 拒绝访问'}, 403)
    args = {}
    result = db.execute('SELECT * FROM student WHERE sid=?', (rid, ))
    if result and len(result) > 0:
        result = result[0]
        args = {
            'sid': result['sid'],
            'name': result['name'],
            'gender': result['gender'],
            'department': result['department'],
            'faculty': result['faculty'],
            'major': result['major'],
            '_class': result['class']
        }
    else:
        args = {
            'sid': session[rid]['rid'],
            'name': session[rid]['name'],
        }
    return render_template('/student.html', **args)
