"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

/* Copyright (c) 2015-present, salesforce.com, inc. All rights reserved */

/* Licensed under BSD 3-Clause - see LICENSE.txt or git.io/sfdc-license */
var DateUtil = {
  firstDayOfMonth: function firstDayOfMonth(date) {
    var newDate = new Date(date);
    newDate.setDate(1);
    return newDate;
  },
  isFirstDayOfMonth: function isFirstDayOfMonth(date) {
    return date.getDate() === 1;
  },
  isLastDayOfMonth: function isLastDayOfMonth(date) {
    return !DateUtil.isSameMonth(date, DateUtil.addDays(date, 1));
  },
  isSameMonth: function isSameMonth(d1, d2) {
    if (!d1 || !d2) {
      return false;
    }

    return d1.getFullYear() === d2.getFullYear() && d1.getMonth() === d2.getMonth();
  },
  isSameDay: function isSameDay(d1, d2) {
    if (!d1 || !d2) {
      return false;
    }

    return d1.getFullYear() === d2.getFullYear() && d1.getMonth() === d2.getMonth() && d1.getDate() === d2.getDate();
  },
  isCurrentMonth: function isCurrentMonth(date) {
    if (!date) {
      return false;
    }

    return DateUtil.isSameMonth(date, new Date());
  },
  isToday: function isToday(date) {
    if (!date) {
      return false;
    }

    return DateUtil.isSameDay(date, new Date());
  },
  isEqual: function isEqual(d1, d2) {
    return d1.getTime() === d2.getTime();
  },
  addDays: function addDays(date, deltaDays) {
    var newDate = new Date(date);
    newDate.setDate(newDate.getDate() + parseInt(deltaDays, 10));
    return newDate;
  },
  addWeeks: function addWeeks(date, deltaWeeks) {
    return DateUtil.addDays(date, parseInt(deltaWeeks, 10) * 7);
  },
  nearestWeekDay: function nearestWeekDay(date, weekDayIndex) {
    var delta = weekDayIndex - date.getDay();

    if (delta < 0) {
      delta += 7;
    }

    return DateUtil.addDays(date, delta);
  },
  isLeapYear: function isLeapYear(year) {
    return year % 4 === 0 && year % 100 !== 0 || year % 400 === 0;
  },
  getDaysInMonth: function getDaysInMonth(year, month) {
    return [31, DateUtil.isLeapYear(year) ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][month];
  },
  addMonths: function addMonths(date, value) {
    var newDate = new Date(date);
    var dateOfNewDate = newDate.getDate();
    newDate.setDate(1);
    newDate.setMonth(newDate.getMonth() + value);
    newDate.setDate(Math.min(dateOfNewDate, DateUtil.getDaysInMonth(newDate.getFullYear(), newDate.getMonth())));
    return newDate;
  }
};
var _default = DateUtil;
exports.default = _default;