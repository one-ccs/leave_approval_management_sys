#!/usr/bin/env python
# -*- coding: utf-8 -*-
from flask import request, session, make_response, render_template, url_for, redirect
from os import path
from app.views import admin_blue
from app.classes import Database, Student

db = Database('./db/data.db')


@admin_blue.before_request
def check_login():
    if 'role' not in session:
        return redirect('/session')
    if session.get('role').get('role') != '管理员':
        return make_response({'state': 'fail', 'msg': '非法操作, 拒绝访问'}, 403)

@admin_blue.route('/')
def root():
    rid = session.get('role').get('rid')
    args = {'headimg': ''}
    result = db.execute('SELECT * FROM admin WHERE aid=?', (rid, ))
    if result and len(result) > 0:
        result = result[0]
        args = {
            'rid': result['aid'],
            'name': result['name'],
            'gender': result['gender'],
        }
    else:
        args = {
            'rid': session.get('role').get('rid'),
            'name': session.get('role').get('name'),
        }
    headimg_path = url_for('static', filename=f'img/user_head/{args["rid"]}.webp')
    if path.isfile('www' + headimg_path):
        args['headimg'] = headimg_path
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
                    'grade': row['grade'],
                    'class': row['class'],
                })
            res = make_response(dict, 200)
        else:
            res = make_response({'state': 'fail', 'msg': '查询失败'}, 403)
    if request.method == 'POST':
        sid = request.values.get('sid')
        name = request.values.get('name')
        gend = request.values.get('gender')
        depa = request.values.get('department')
        facu = request.values.get('faculty')
        majo = request.values.get('major')
        grad = request.values.get('grade')
        clas = request.values.get('class')
        try:
            stu = Student(name, 'None', sid, gend, depa, facu, majo, grad, clas)
            stu.id = session.get('role').get('id')
        except ValueError:
            return make_response({'state': 'fail', 'msg': '学号和姓名不能为空'}, 403)
        result = db.execute()
        res = make_response({'state': 'fail', 'msg': '修改失败'}, 403)
    if request.method == 'DELETE':
        sids = request.values.get('sids')
        if not sids or len(sids) == 0:
            return make_response({'state': 'fail', 'msg': '未提供要删除的学号'}, 403)
        sids = sids.split(',')
        _sids = []
        for sid in sids:
            _sids.append((sid, ))
        result = db.executemany('DELETE FROM student WHERE sid=?', tuple(_sids))
        if result and result > 0:
            res = make_response({'state': 'ok', 'msg': f'删除成功, 共删除 {result} 条'}, 200)
        else:
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
        tids = request.values.get('tids')
        if not tids or len(tids) == 0:
            return make_response({'state': 'fail', 'msg': '未提供要删除的学号'}, 403)
        tids = tids.split(',')
        _tids = []
        for tid in tids:
            _tids.append((tid, ))
        result = db.executemany('DELETE FROM teacher WHERE tid=?', tuple(_tids))
        if result and result > 0:
            res = make_response({'state': 'ok', 'msg': f'删除成功, 共删除 {result} 条'}, 200)
        else:
            res = make_response({'state': 'fail', 'msg': '删除失败'}, 403)
    return res
