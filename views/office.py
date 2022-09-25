#!/usr/bin/env python
# -*- coding: utf-8 -*-
from flask import render_template
from views import office_blue


@office_blue.route('/')
def root():
    return render_template('/office.html')
