#!/usr/bin/env python
# -*- coding: utf-8 -*-
from flask import render_template
from views import assistant_blue


@assistant_blue.route('/')
def root():
    return render_template('/assistant.html')
