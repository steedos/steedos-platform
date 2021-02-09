{
  function validateInput(hour, minute, second, millisecond) {
    if(hour > 23) {
      error("hour part needs to be under 24")
    }

    if(minute > 59) {
      error("minute part needs to be under 60")
    }

    if(second > 59) {
      error("second part needs to be under 60")
    }

    if(millisecond > 999) {
      error("millisecond part needs to be under 1000")
    }
  }
}

Time
  = hour:Hour ":" minute:Minute ":" second:Second "." millisecond:Millisecond {
    validateInput(hour, minute, second, millisecond)

    return {
      type: "literal",
      value: new Date(millisecond + second * 1000 + minute * 60 * 1000 + hour * 60 * 60 * 1000),
      dataType: "time",
      options: {}
    }
  }

Hour
  = DecimalDigit DecimalDigit { return parseInt(text()) }

Minute
  = DecimalDigit DecimalDigit { return parseInt(text()) }

Second
  = DecimalDigit DecimalDigit { return parseInt(text()) }

Millisecond
  = DecimalDigit DecimalDigit DecimalDigit { return parseInt(text()) }

DecimalDigit
  = [0-9]
