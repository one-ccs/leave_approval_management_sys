#!/usr/bin/env python
# -*- coding: utf-8 -*-
from unicodedata import category
from flask import request, session, make_response, render_template
from app.views import student_blue
from app.classes import Database

db = Database('./db/data.db')


@student_blue.before_request
def check_login():
    rid = request.cookies.get('rid')
    if not rid or rid not in session:
        return make_response({'state': 'fail', 'msg': '请登录后操作'}, 401)
    if session.get(rid)['role'] != '学生':
        return make_response({'state': 'fail', 'msg': '非法操作, 拒绝访问'}, 403)

@student_blue.route('/')
def root():
    rid = request.cookies.get('rid')
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

@student_blue.route('/leaves', methods=['GET', 'POST', 'DELETE'])
def leaves():
    res = None
    sid = session.get(request.cookies.get('rid'))['rid']
    if request.method == 'GET':
        result = db.execute('SELECT a.*,b.name a1,c.name a2 FROM leave a LEFT JOIN teacher b ON a.approver1_id=b.tid LEFT JOIN teacher c ON a.approver2_id=c.tid WHERE sid=?', (sid, ))
        if result and len(result) > 0:
            dict = {
                'state': 'ok',
                'msg': '查询成功',
                'length': len(result),
                'data': []
            }
            for row in result:
                dict['data'].append({
                    'id': row['id'],
                    'apply_datetime': row['apply_datetime'],
                    'category': row['category'],
                    'start_datetime': row['start_datetime'],
                    'end_datetime': row['end_datetime'],
                    'reason': row['reason'],
                    'a1': row['a1'],
                    'a2': row['a2'],
                    'state': row['state'],
                    'action': '<button class="btn btn-danger btn-sm me-1" onclick="onBtnRevokeClick(this)"><i class="fa fa-close"></i></button>',
                })
            res = make_response(dict, 200)
        else:
            res = make_response({'state': 'fail', 'msg': '查询失败'}, 403)
    if request.method == 'POST':
        category = request.form.get('category')
        start_datetime = request.form.get('start_datetime')
        end_datetime = request.form.get('end_datetime')
        reason = request.form.get('reason')
        if not category or not start_datetime or not end_datetime:
            return make_response({'state': 'fial', 'msg': '申请失败, 类别、开始日期和结束日期不能为空'}, 403)
        start_datetime = start_datetime.replace('T', ' ') + ':00'
        end_datetime = end_datetime.replace('T', ' ') + ':00'
        result = db.execute(
            'INSERT INTO leave(sid,state,category,start_datetime,end_datetime,reason) VALUES(?,?,?,?,?,?)',
            (sid, '待审批', category, start_datetime, end_datetime, reason)
        )
        if result and result > 0:
            res = make_response({'state': 'ok', 'msg': '申请成功'}, 200)
        else:
            res = make_response({'state': 'fail', 'msg': '申请失败'}, 403)
    if request.method == 'DELETE':
        id = request.form.get('id')
        if not id:
            return make_response({'state': 'fail', 'msg': '操作失败'}, 403)
        result = db.execute('DELETE FROM leave WHERE id=?', (id, ))
        if result and result > 0:
            res = make_response({'state': 'ok', 'msg': '撤销成功'}, 200)
        else:
            res = make_response({'state': 'fail', 'msg': '撤销失败'}, 403)
    return res
