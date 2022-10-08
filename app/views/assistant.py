#!/usr/bin/env python
# -*- coding: utf-8 -*-
from flask import request, session, make_response, render_template, url_for, redirect
from os import path
from app.views import assistant_blue
from app.classes import Database

db = Database('./db/data.db')


@assistant_blue.before_request
def check_login():
    if 'role' not in session:
        return redirect('/session')
    if session.get('role')['role'] != '辅导员':
        return make_response({'state': 'fail', 'msg': '非法操作, 拒绝访问'}, 403)

@assistant_blue.route('/')
def root():
    rid = session.get('role')['rid']
    args = {'headimg': ''}
    result = db.execute('SELECT * FROM teacher WHERE tid=?', (rid, ))
    if result and len(result) > 0:
        result = result[0]
        args = {
            'rid': result['tid'],
            'name': result['name'],
            'gender': result['gender'],
            'telphone': result['telphone']
        }
    else:
        args = {
            'rid': session[rid]['rid'],
            'name': session[rid]['name'],
        }
    headimg_path = url_for('static', filename=f'img/user_head/{args["rid"]}.webp')
    if path.isfile('www' + headimg_path):
        args['headimg'] = headimg_path
    return render_template('/assistant.html', **args)

@assistant_blue.route('/leaves', methods=['GET', 'POST', 'DELETE'])
def leaves():
    res = None
    tid = session.get('role')['rid']
    if request.method == 'GET':
        search = request.values.get('search')
        if search == 'approval':
            result = db.execute(
                'SELECT a.*,b.name name,c.name a1,d.name a2 FROM leave a LEFT JOIN student b ON a.sid=b.sid LEFT JOIN teacher c ON a.approver1_id=c.tid LEFT JOIN teacher d ON a.approver2_id=d.tid WHERE b.tid=? and state IN ("待审批", "审批中", "销假中")',
                (tid, )
            )
        elif search == 'total':
            result = db.execute(
                'SELECT a.*,b.name name,c.name a1,d.name a2 FROM leave a LEFT JOIN student b ON a.sid=b.sid LEFT JOIN teacher c ON a.approver1_id=c.tid LEFT JOIN teacher d ON a.approver2_id=d.tid WHERE b.tid=?',
                (tid, )
            )
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
                    'sid': row['sid'],
                    'name': row['name'],
                    'apply_timestamp': row['apply_timestamp'],
                    'category': row['category'],
                    'start_timestamp': row['start_timestamp'],
                    'end_timestamp': row['end_timestamp'],
                    'reason': row['reason'],
                    'a1': row['a1'],
                    'a2': row['a2'],
                    'state': row['state'],
                })
            res = make_response(dict, 200)
        else:
            res = make_response({'state': 'fail', 'msg': '查询失败'}, 403)
    if request.method == 'POST':
        category = request.form.get('category')
        start_timestamp = request.form.get('start_timestamp')
        end_timestamp = request.form.get('end_timestamp')
        reason = request.form.get('reason')
        if not category or not start_timestamp or not end_timestamp:
            return make_response({'state': 'fial', 'msg': '申请失败, 类别、开始日期和结束日期不能为空'}, 403)
        start_timestamp = start_timestamp.replace('T', ' ') + ':00'
        end_timestamp = end_timestamp.replace('T', ' ') + ':00'
        result = db.execute(
            'INSERT INTO leave(sid,state,category,start_timestamp,end_timestamp,reason) VALUES(?,?,?,?,?,?)',
            (tid, '待审批', category, start_timestamp, end_timestamp, reason)
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
