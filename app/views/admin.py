#!/usr/bin/env python
# -*- coding: utf-8 -*-
from flask import request, session, make_response, render_template
from app.views import admin_blue
from app.classes import Database, Student

db = Database('./db/data.db')


@admin_blue.before_request
def check_login():
    rid = request.cookies.get('rid')
    if not rid or rid not in session:
        return make_response({'state': 'fail', 'msg': '请登录后操作'}, 401)
    if session.get(rid)['role'] != '管理员':
        return make_response({'state': 'fail', 'msg': '非法操作, 拒绝访问'}, 403)

@admin_blue.route('/')
def root():
    rid = request.cookies.get('rid')
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

@admin_blue.route('/students', methods=['GET', 'POST', 'DELETE'])
def students():
    res = None
    if request.method == 'GET':
        result = db.execute('SELECT row_number() OVER(ORDER BY sid ASC) as "on",* FROM student')
        if result and len(result) > 0:
            dict = {
                'state': 'ok',
                'msg': '查询成功',
                'length': len(result),
                'data': []
            }
            for row in result:
                dict['data'].append({
                    'on': row['on'],
                    'sid': row['sid'],
                    'name': row['name'],
                    'gender': row['gender'],
                    'department': row['department'],
                    'faculty': row['faculty'],
                    'major': row['major'],
                    'class': row['class'],
                })
            res = make_response(dict, 200)
        else:
            res = make_response({'state': 'fail', 'msg': '查询失败'}, 403)
    if request.method == 'POST':
        sid = request.form.get('sid')
        name = request.form.get('name')
        gend = request.form.get('gender')
        depa = request.form.get('department')
        facu = request.form.get('faculty')
        majo = request.form.get('major')
        clas = request.form.get('class')
        try:
            stu = Student(name, 'None', sid, gend, depa, facu, majo, clas)
            stu.id = session.get(stu.sid)['id']
        except ValueError:
            return make_response({'state': 'fail', 'msg': '学号和姓名不能为空'}, 403)
        result = db.execute()
        res = make_response({'state': 'fail', 'msg': '修改失败'}, 403)
    if request.method == 'DELETE':
        sid = request.form.get('sid')
        name = request.form.get('name')
        gend = request.form.get('gender')
        depa = request.form.get('department')
        facu = request.form.get('faculty')
        majo = request.form.get('major')
        clas = request.form.get('class')
        try:
            stu = Student(name, 'None', sid, gend, depa, facu, majo, clas)
            stu.id = session.get(stu.sid)['id']
        except ValueError:
            return make_response({'state': 'fail', 'msg': '学号和姓名不能为空'}, 403)
        result = db.execute()
        res = make_response({'state': 'fail', 'msg': '删除失败'}, 403)
    return res

@admin_blue.route('/teachers', methods=['GET', 'POST', 'DELETE'])
def teachers():
    res = None
    if request.method == 'GET':
        result = db.execute('SELECT row_number() OVER(ORDER BY tid ASC) as "on",teacher.*,role.role FROM teacher,role where teacher.tid=role.rid')
        if result and len(result) > 0:
            dict = {
                'state': 'ok',
                'msg': '查询成功',
                'length': len(result),
                'data': []
            }
            for row in result:
                dict['data'].append({
                    'on': row['on'],
                    'tid': row['tid'],
                    'name': row['name'],
                    'gender': row['gender'],
                    'telphone': row['telphone'],
                    'role': row['role'],
                })
            res = make_response(dict, 200)
        else:
            res = make_response({'state': 'fail', 'msg': '查询失败'}, 403)
    if request.method == 'POST':
        res = make_response({'state': 'fail', 'msg': '修改失败'}, 403)
    if request.method == 'DELETE':
        res = make_response({'state': 'fail', 'msg': '删除失败'}, 403)
    return res
