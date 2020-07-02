/*
 * The conversion functions in this file can be used by input types to convert their outgoing values into the data type expected by the schema
 */

AutoForm.valueConverters = {
  booleanToString: function booleanToString(val) {
    if (val === true) {
      return "TRUE";
    } else if (val === false) {
      return "FALSE";
    }
    return val;
  },
  booleanToStringArray: function booleanToStringArray(val) {
    if (val === true) {
      return ["TRUE"];
    } else if (val === false) {
      return ["FALSE"];
    }
    return val;
  },
  booleanToNumber: function booleanToNumber(val) {
    if (val === true) {
      return 1;
    } else if (val === false) {
      return 0;
    }
    return val;
  },
  booleanToNumberArray: function booleanToNumberArray(val) {
    if (val === true) {
      return [1];
    } else if (val === false) {
      return [0];
    }
    return val;
  },
  /**
   * @method  AutoForm.valueConverters.dateToDateString
   * @private
   * @param  {Date} date
   * @return {String}
   *
   * Returns a "valid date string" representing the local date.
   */
  dateToDateString: function dateToDateString(val) {
    return (val instanceof Date) ? moment(val).format("YYYY-MM-DD") : val;
  },
  /**
   * @method  AutoForm.valueConverters.dateToDateStringUTC
   * @private
   * @param  {Date} date
   * @return {String}
   *
   * Returns a "valid date string" representing the date converted to the UTC time zone.
   */
  dateToDateStringUTC: function dateToDateStringUTC(val) {
    return (val instanceof Date) ? moment.utc(val).format("YYYY-MM-DD") : val;
  },
  dateToDateStringUTCArray: function dateToDateStringUTCArray(val) {
    if (val instanceof Date) {
      return [AutoForm.valueConverters.dateToDateStringUTC(val)];
    }
    return val;
  },
  /**
   * @method  AutoForm.valueConverters.dateToNormalizedForcedUtcGlobalDateAndTimeString
   * @private
   * @param  {Date} date
   * @return {String}
   *
   * Returns a "valid normalized forced-UTC global date and time string" representing the time
   * converted to the UTC time zone and expressed as the shortest possible string for the given
   * time (e.g. omitting the seconds component entirely if the given time is zero seconds past the minute).
   *
   * http://www.whatwg.org/specs/web-apps/current-work/multipage/states-of-the-type-attribute.html#date-and-time-state-(type=datetime)
   * http://www.whatwg.org/specs/web-apps/current-work/multipage/common-microsyntaxes.html#valid-normalized-forced-utc-global-date-and-time-string
   */
  dateToNormalizedForcedUtcGlobalDateAndTimeString: function dateToNormalizedForcedUtcGlobalDateAndTimeString(val) {
    return (val instanceof Date) ? moment(val).utc().format("YYYY-MM-DD[T]HH:mm:ss.SSS[Z]") : val;
  },
  dateToNormalizedForcedUtcGlobalDateAndTimeStringArray: function dateToNormalizedForcedUtcGlobalDateAndTimeStringArray(val) {
    if (val instanceof Date) {
      return [AutoForm.valueConverters.dateToNormalizedForcedUtcGlobalDateAndTimeString(val)];
    }
    return val;
  },
  /**
   * @method AutoForm.valueConverters.dateToNormalizedLocalDateAndTimeString
   * @private
   * @param {Date} date The Date object
   * @param {String} [timezoneId] A valid timezoneId that moment-timezone understands, e.g., "America/Los_Angeles"
   * @return {String}
   *
   * Returns a "valid normalized local date and time string".
   */
  dateToNormalizedLocalDateAndTimeString: function dateToNormalizedLocalDateAndTimeString(date, timezoneId) {
    var m = moment(date);
    // by default, we assume local timezone; add moment-timezone to app and pass timezoneId
    // to use a different timezone
    if (typeof timezoneId === "string") {
      if (typeof m.tz !== "function") {
        throw new Error("If you specify a timezoneId, make sure that you've added a moment-timezone package to your app");
      }
      m.tz(timezoneId);
    }
    return m.format("YYYY-MM-DD[T]HH:mm:ss.SSS");
  },
  dateToNumber: function dateToNumber(val) {
    return (val instanceof Date) ? val.getTime() : val;
  },
  dateToNumberArray: function dateToNumberArray(val) {
    if (val instanceof Date) {
      return [val.getTime()];
    }
    return val;
  },
  dateToDateArray: function dateToDateArray(val) {
    if (val instanceof Date) {
      return [val];
    }
    return val;
  },
  stringToStringArray: function stringToStringArray(val) {
    if (typeof val === "string") {
      val = val.split(",");
      return _.map(val, function (item) {
        return $.trim(item);
      });
    }
    return val;
  },
  /**
   * @method AutoForm.valueConverters.stringToNumber
   * @public
   * @param {String} val A string or null or undefined.
   * @return {Number|String} The string converted to a Number or the original value.
   *
   * For strings, returns Number(val) unless the result is NaN. Otherwise returns val.
   */
  stringToNumber: function stringToNumber(val) {
    if (typeof val === "string" && val.length > 0) {
      var numVal = Number(val);
      if (!isNaN(numVal)) {
        return numVal;
      }
    }
    return val;
  },
  stringToNumberArray: function stringToNumberArray(val) {
    if (typeof val === "string") {
      val = val.split(",");
      return _.map(val, function (item) {
        item = $.trim(item);
        return AutoForm.valueConverters.stringToNumber(item);
      });
    }
    return val;
  },
  /**
   * @method AutoForm.valueConverters.stringToBoolean
   * @private
   * @param {String} val A string or null or undefined.
   * @return {Boolean|String} The string converted to a Boolean.
   *
   * If the string is "true" or "1", returns `true`. If the string is "false" or "0", returns `false`. Otherwise returns the original string.
   */
  stringToBoolean: function stringToBoolean(val) {
    if (typeof val === "string" && val.length > 0) {
      var lval = val.toLowerCase();
      if (lval === "true" || lval === "1") {
        return true;
      } else if (lval === "false" || lval === "0") {
        return false;
      }
    }
    return val;
  },
  stringToBooleanArray: function stringToBooleanArray(val) {
    if (typeof val === "string") {
      val = val.split(",");
      return _.map(val, function (item) {
        item = $.trim(item);
        return AutoForm.valueConverters.stringToBoolean(item);
      });
    }
    return val;
  },
  /**
   * @method AutoForm.valueConverters.stringToDate
   * @private
   * @param {String} val A string or null or undefined.
   * @return {Date|String} The string converted to a Date instance.
   *
   * Returns new Date(val) as long as val is a string with at least one character. Otherwise returns the original string.
   */
  stringToDate: function stringToDate(val) {
    if (typeof val === "string" && val.length > 0) {
      return new Date(val);
    }
    return val;
  },
  stringToDateArray: function stringToDateArray(val) {
    if (typeof val === "string") {
      val = val.split(",");
      return _.map(val, function (item) {
        item = $.trim(item);
        return AutoForm.valueConverters.stringToDate(item);
      });
    }
    return val;
  },
  numberToString: function numberToString(val) {
    if (typeof val === "number") {
      return val.toString();
    }
    return val;
  },
  numberToStringArray: function numberToStringArray(val) {
    if (typeof val === "number") {
      return [val.toString()];
    }
    return val;
  },
  numberToNumberArray: function numberToNumberArray(val) {
    if (typeof val === "number") {
      return [val];
    }
    return val;
  },
  numberToBoolean: function numberToBoolean(val) {
    if (val === 0) {
      return false;
    } else if (val === 1) {
      return true;
    }
    return val;
  },
  numberToBooleanArray: function numberToBooleanArray(val) {
    if (val === 0) {
      return [false];
    } else if (val === 1) {
      return [true];
    }
    return val;
  }
};

// BACKWARDS COMPATIBILITY - some of these were formerly on the Utility object
Utility.dateToDateString = AutoForm.valueConverters.dateToDateString;
Utility.dateToDateStringUTC = AutoForm.valueConverters.dateToDateStringUTC;
Utility.dateToNormalizedForcedUtcGlobalDateAndTimeString = AutoForm.valueConverters.dateToNormalizedForcedUtcGlobalDateAndTimeString;
Utility.dateToNormalizedLocalDateAndTimeString = AutoForm.valueConverters.dateToNormalizedLocalDateAndTimeString;
Utility.stringToBool = AutoForm.valueConverters.stringToBoolean;
Utility.stringToNumber = AutoForm.valueConverters.stringToNumber;
Utility.stringToDate = AutoForm.valueConverters.stringToDate;
