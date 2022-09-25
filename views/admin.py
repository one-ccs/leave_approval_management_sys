#!/usr/bin/env python
# -*- coding: utf-8 -*-
from flask import render_template
from views import admin_blue


@admin_blue.route('/')
def root():
    return render_template('/admin.html')
