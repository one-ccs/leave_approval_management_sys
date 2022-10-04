#!/usr/bin/env python
# -*- coding: utf-8 -*-
from flask import Flask, request, session, make_response, render_template, url_for, redirect
from datetime import timedelta
from app.classes import Database, Role

app = Flask(__name__, template_folder='../www/templates', static_folder='../www/static')
app.config['SECRET_KEY'] = 'LmzwTvA1p5B2DODi$b2bfe2b68ef2ec99b86dd354e00d3c3c7f533ce18fe8a6f33f7c3af52396b1bb'
app.config['PERMANENT_SESSION_LIFETIME'] = timedelta(seconds=1800)
db = Database('./db/data.db')

@app.before_request
def check_login():
    if 'role' not in session:
        session.clear()

@app.route('/favicon.ico')
def favicon():
    return redirect(url_for('static', filename='favicon.ico'))

@app.route('/')
def root():
    args = session.get('role', {})
    return render_template('/index.html', **args)

@app.route('/session')
def _session():
    args = session.get('role', {})
    return render_template('/session.html', **args)

@app.route('/login', methods=['GET', 'POST', 'DELETE'])
def login():
    res = None
    if request.method == 'GET':
        return render_template('/login.html')
    # 登录
    if request.method == 'POST':
        result, role, rid, password = None, None, request.form.get('rid'), request.form.get('password')
        try:
            _role = db.execute('SELECT * FROM role WHERE rid=?', (rid, ))
            role = Role('None', password, rid, _role[0]['role'])
        except ValueError:
            return make_response({'state': 'fail', 'msg': 'ID 和密码不能为空'}, 403)
        except IndexError:
            return make_response({'state': 'fail', 'msg': '不存在此用户'}, 403)
        if role.role == '管理员':
            result = db.execute('SELECT rid,password,role,name FROM role,admin WHERE rid=? and rid=aid', (role.rid, ))
        elif role.role in ('辅导员', '教务处', '考勤'):
            result = db.execute('SELECT rid,password,role,name FROM role,teacher WHERE rid=? and rid=tid', (role.rid, ))
        elif role.role == '学生':
            result = db.execute('SELECT rid,password,role,name FROM role,student WHERE rid=? and rid=sid', (role.rid, ))
        else:
            res = make_response({'state': 'fail', 'msg': '不存在此用户'}, 403)
        if result and len(result) > 0:
            result = result[0]
            if not role.check_password(result['password']):
                res =  make_response({'state': 'fail', 'msg': '密码错误'}, 403)
            else:
                session['role'] = {
                    'rid': result['rid'],
                    'name': result['name'],
                    'password': result['password'],
                    'role': result['role']
                }
                res = make_response({'state': 'ok', 'msg': '登录成功'}, 200)
        else:
            res = make_response({'state': 'fail', 'msg': '用户信息查询失败, 请联系管理员'}, 500)
    # 登出
    if request.method == 'DELETE':
        if 'role' not in session:
            res = make_response({'state': 'fail', 'msg': '请登录后操作'}, 403)
        else:
            session.clear()
            res = make_response({'state': 'ok', 'msg': '登出成功'}, 200)
    return res

@app.route('/regist', methods=['GET', 'POST'])
def regist():
    res = None
    if request.method == 'GET':
        return render_template('/regist.html')
    if request.method == 'POST':
        role = None
        try:
            role = Role(request.form.get('username'), request.form.get('password'), request.form.get('rid'), '学生')
        except ValueError:
            return make_response({'state': 'fail', 'msg': 'ID 、姓名和密码不能为空'}, 403)
        result1 = db.execute(
            'INSERT INTO role(rid,password,role) VALUES(?,?,?)',
            (role.rid, role.hash_password, role.role)
        )
        if result1 and result1 > 0:
            result2 = db.execute(
                'INSERT INTO student(sid,name) VALUES(?,?)',
                (role.rid, role.name)
            )
            if result2 and result2 > 0:
                res = make_response({'state': 'ok', 'msg': '注册成功'}, 200)
            else:
                res = make_response({'state': 'fail', 'msg': '注册失败, ID 已存在, 请修改后重试'}, 403)
        else:
            res = make_response({'state': 'fail', 'msg': '注册失败, ID 已存在, 请修改后重试'}, 403)
    return res

@app.route('/user')
def user():
    if 'role' not in session:
        return redirect('/session')
    res, role = None, session.get('role')['role']
    if role == '学生':
        res = redirect('/student/')
    elif role == '辅导员':
        res = redirect('/assistant/')
    elif role == '教务处':
        res = redirect('/office/')
    elif role == '考勤':
        res = redirect('/attendance/')
    elif role == '管理员':
        res = redirect('/admin/')
    return res

@app.route('/headimg', methods=['POST'])
def headimg():
    pass

from app.views import errorhandle_blue
from app.views import student_blue
from app.views import assistant_blue
from app.views import office_blue
from app.views import attendance_blue
from app.views import admin_blue

app.register_blueprint(errorhandle_blue)
app.register_blueprint(student_blue)
app.register_blueprint(assistant_blue)
app.register_blueprint(office_blue)
app.register_blueprint(attendance_blue)
app.register_blueprint(admin_blue)
