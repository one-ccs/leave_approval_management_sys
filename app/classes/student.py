#!/usr/bin/env python
# -*- coding: utf-8 -*-
from app.classes import User


class Student(User):
    def __init__(self, name, password, sid, gender='', department='', faculty='', major='', _class=''):
        super().__init__(name, password)
        self.__sid = sid
        self.gender = gender
        self.department = department
        self.faculty = faculty
        self.major = major
        self._class  = _class

    @property
    def sid(self):
        return self.__sid

    @sid.setter
    def sid(self, sid):
        if not isinstance(sid, int) or sid < 0:
            raise TypeError('类型错误: sid 必须为自然数.')
        self.__sid = sid
        return self
