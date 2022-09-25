#!/usr/bin/env python
# -*- coding: utf-8 -*-
from flask import render_template
from views import attendance_blue


@attendance_blue.route('/')
def root():
    return render_template('/attendance.html')
