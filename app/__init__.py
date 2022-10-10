#!/usr/bin/env python
# -*- coding: utf-8 -*-
from .app import DATABASE_FILE
from .app import UPLOAD_FOLDER
from .app import ALLOWED_IMAGE_EXTENSIONS

from .app import app
from .app import db


__all__ = ['DATABASE_FILE', 'UPLOAD_FOLDER', 'ALLOWED_IMAGE_EXTENSIONS', 'app', 'db']


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
