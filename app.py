#!/usr/bin/env python
# -*- coding: utf-8 -*-
from flask import Flask, request, session, make_response, render_template, send_file
from datetime import timedelta
from urllib.parse import quote
from classes import Database, Role

app = Flask(__name__)
app.config['SECRET_KEY'] = 'hard to guess'
app.config['PERMANENT_SESSION_LIFETIME'] = timedelta(seconds=1800 + 3600 * 8)
db = Database('./db/data.db')


@app.route('/favicon.ico')
def favicon():
    return send_file('static/favicon.ico', mimetype='image/jpeg')

@app.route('/')
def root():
    return render_template('/index.html')

@app.route('/session')
def _session():
    return render_template('/session.html')

@app.route('/login', methods=['GET', 'POST', 'DELETE'])
def login():
    res = None
    # 请求登录页
    if request.method == 'GET':
        return render_template('/login.html')
    # 登录
    if request.method == 'POST':
        role = None
        try:
            role = Role('None', request.form.get('password'), request.form.get('rid'), '学生')
        except ValueError:
            return make_response({'state': 'fail', 'msg': '学号和密码不能为空'}, 403)
        result = db.execute('SELECT * FROM role WHERE rid=?', (role.rid, ))
        if result and len(result) > 0:
            result = result[0]
            if not role.check_password(result['password']):
                res =  make_response({'state': 'fail', 'msg': '密码错误'}, 403)
            else:
                session[role.rid] = {
                    'rid': result['rid'],
                    'name': result['name'],
                    'password': result['password'],
                    'role': result['role']}
                session.permanent = True
                res = make_response({'state': 'ok', 'msg': '登录成功'}, 200)
                res.set_cookie('rid', str(result['rid']))
                # res.set_cookie('name', quote(result['name']))
                res.set_cookie('role', quote(result['role']))
        else:
            res = make_response({'state': 'fail', 'msg': '不存在此用户'}, 403)
    # 登出
    if request.method == 'DELETE':
        rid = request.cookies.get('rid')
        if not rid or rid not in session:
            res = make_response({'state': 'fail', 'msg': '请登录后操作'}, 403)
        else:
            session.clear()
            res = make_response({'state': 'ok', 'msg': '登出成功'}, 200)
            res.delete_cookie('rid')
            res.delete_cookie('name')
            res.delete_cookie('role')
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
            return make_response({'state': 'fail', 'msg': '学号、姓名和密码不能为空'}, 403)
        result = db.execute(
            'INSERT INTO role(rid,name,password,role) VALUES(?,?,?,?)',
            (role.rid, role.name, role.hash_password, role.role)
        )
        if result and result > 0:
            res = make_response({'state': 'ok', 'msg': '注册成功'}, 200)
        else:
            res = make_response({'state': 'fail', 'msg': '注册失败, 学号已存在, 请修改后重试'}, 403)
    return res


from views import errorhandle_blue
from views import student_blue
from views import assistant_blue
from views import office_blue
from views import attendance_blue
from views import admin_blue

app.register_blueprint(errorhandle_blue)
app.register_blueprint(student_blue)
app.register_blueprint(assistant_blue)
app.register_blueprint(office_blue)
app.register_blueprint(attendance_blue)
app.register_blueprint(admin_blue)


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=9527, debug=True)
