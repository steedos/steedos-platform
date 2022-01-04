import {
  addDays,
  addMonths,
  buildDateLiteral,
  buildDatetimeLiteral,
  buildGeolocationLiteral,
  buildLiteralFromJs,
  buildTimeLiteral,
  daysDifference,
  escapeRegExp,
  formatLiteral,
  parseTime,
  sfRound,
} from './utils';
import NotImplementedError from './errors/NotImplementedError';
import ArgumentError from './errors/ArgumentError';

const STATIC_SESSION_ID = '00D3z000001eRlg!AQMAQC3Y4aM9sFux6SRWhyFcOUKin4taGaBxNMU8TN_R_1R0Y7ArI95eSyzQZVIlrnV_unTbmwHZlXex8xhlXz2kXZNP49Fa';

// Essential Functions

export const sf$or = (...booleans) => {
  const result = booleans
    .map((boolean) => boolean.value)
    .reduce((previous, current) => previous || current);

  return buildLiteralFromJs(result);
};

export const sf$equal = (value1, value2) => {
  switch (value1.dataType) {
    case 'date':
    case 'datetime':
      return buildLiteralFromJs(value1.value.getTime() === value2.value.getTime());
    default:
      return buildLiteralFromJs(value1.value === value2.value);
  }
};

export const sf$unequal = (value1, value2) => buildLiteralFromJs(!sf$equal(value1, value2).value);

export const sf$greaterThan = (value1, value2) => (
  buildLiteralFromJs(value1.value > value2.value)
);

export const sf$greaterThanOrEqual = (value1, value2) => (
  buildLiteralFromJs(value1.value >= value2.value)
);

export const sf$lessThan = (value1, value2) => (
  buildLiteralFromJs(value1.value < value2.value)
);

export const sf$lessThanOrEqual = (value1, value2) => (
  buildLiteralFromJs(value1.value <= value2.value)
);

// Date & Time Functions

export const sf$addmonths = (date, num) => (
  buildDateLiteral(addMonths(date.value, num.value))
);

export const sf$date = (year, month, day) => (
  buildDateLiteral(year.value, month.value, day.value)
);

export const sf$datevalue = (expression) => (
  buildDateLiteral(new Date(Date.parse(expression.value)))
);

export const sf$datetimevalue = (expression) => (
  buildDatetimeLiteral(Date.parse(`${expression.value}Z`))
);

export const sf$day = (date) => (
  buildLiteralFromJs(date.value.getUTCDate())
);

export const sf$hour = (expression) => (
  buildLiteralFromJs(expression.value.getUTCHours())
);

export const sf$millisecond = (expression) => (
  buildLiteralFromJs(expression.value.getUTCMilliseconds())
);

export const sf$minute = (expression) => (
  buildLiteralFromJs(expression.value.getUTCMinutes())
);

export const sf$month = (date) => (
  buildLiteralFromJs(date.value.getUTCMonth() + 1)
);

export const sf$now = () => (
  buildDatetimeLiteral(new Date().getTime())
);

export const sf$second = (expression) => (
  buildLiteralFromJs(expression.value.getUTCSeconds())
);

export const sf$timenow = () => {
  const millisecondsInDay = 24 * 60 * 60 * 1000;

  return buildTimeLiteral(new Date().getTime() % millisecondsInDay);
};

export const sf$timevalue = (expression) => parseTime(expression.value);

export const sf$today = () => buildDateLiteral(new Date());

export const sf$weekday = (date) => buildLiteralFromJs(date.value.getUTCDay() + 1);

export const sf$year = (date) => buildLiteralFromJs(date.value.getUTCFullYear());

// Logical Functions

export const sf$and = (...booleans) => {
  const result = booleans
    .map((boolean) => boolean.value)
    .reduce((previous, current) => previous && current);

  return buildLiteralFromJs(result);
};

export const sf$blankvalue = (expression, substituteExpression) => {
  const isblank = expression.dataType === 'null' || expression.value === '' || expression.value === null || expression.value === undefined || (expression.dataType === "multipicklist" && !expression.value.length);
  return isblank ? substituteExpression : expression
};

export const sf$case = (expression, ...values) => {
  const lastValueIndex = values.length - 1;
  if (lastValueIndex <= 0) {
    const options = {
      function: 'case',
      expected: 4,
      received: lastValueIndex + 2,
    };
    throw new ArgumentError(`Incorrect number of parameters for function '${options.function.toUpperCase()}()'. Expected ${options.expected}+, received ${options.received}`, options);
  }

  if (lastValueIndex % 2 !== 0) {
    const options = {
      function: 'case',
      expected: lastValueIndex + 1,
      received: lastValueIndex + 2,
    };
    throw new ArgumentError(`Incorrect number of parameters for function '${options.function.toUpperCase()}()'. Expected ${options.expected}, received ${options.received}`, options);
  }
  for (let index = 0; index < lastValueIndex; index += 2) {
    if (sf$equal(values[index], expression).value) {
      return values[index + 1];
    }
  }
  return values[lastValueIndex];
};

export const sf$if = (logicalTest, valueIfTrue, valueIfFalse) => (
  logicalTest.value ? valueIfTrue : valueIfFalse
);

export const sf$isblank = (expression) => buildLiteralFromJs(expression.dataType === 'null' || expression.value === '' || expression.value === null || expression.value === undefined || (expression.dataType === "multipicklist" && !expression.value.length));

/* eslint-disable no-unused-vars */
export const sf$isnull = (_expression) => {
  NotImplementedError.throwError('isnull');
};
/* eslint-enable no-unused-vars */

/* eslint-disable no-unused-vars */
export const sf$isnumber = (_text) => {
  NotImplementedError.throwError('isnumber');
};
/* eslint-enable no-unused-vars */

export const sf$not = (logical) => buildLiteralFromJs(!logical.value);

/* eslint-disable no-unused-vars */
export const sf$nullvalue = (_expression, _substituteExpression) => {
  NotImplementedError.throwError('nullvalue');
};
/* eslint-enable no-unused-vars */

// Math Operators

/* eslint-disable consistent-return */
export const sf$add = (value1, value2) => {
  switch ([value1.dataType, value2.dataType].join(' ')) {
    case 'date number':
      return buildDateLiteral(addDays(value1.value, value2.value));
    case 'number date':
      return buildDateLiteral(addDays(value2.value, value1.value));
    case 'time number':
      return buildTimeLiteral(value1.value.getTime() + value2.value);
    case 'number time':
      return buildTimeLiteral(value1.value + value2.value.getTime());
    case 'datetime number':
      return buildDatetimeLiteral(addDays(value1.value, value2.value));
    case 'number datetime':
      return buildDatetimeLiteral(addDays(value2.value, value1.value));
    case 'number number':
    case 'text text':
      return buildLiteralFromJs(value1.value + value2.value);
    default:
      ArgumentError.throwWrongType('add', 'number', value2.dataType);
  }
};

export const sf$subtract = (value1, value2) => {
  switch ([value1.dataType, value2.dataType].join(' ')) {
    case 'date number':
      return buildDateLiteral(addDays(value1.value, -1 * value2.value));
    case 'time number':
      return buildTimeLiteral(value1.value.getTime() + -1 * value2.value);
    case 'datetime number':
      return buildDatetimeLiteral(addDays(value1.value, -1 * value2.value));
    case 'date date':
    case 'datetime datetime':
      return buildLiteralFromJs(daysDifference(value1.value, value2.value));
    case 'time time':
      return buildLiteralFromJs(value1.value.getTime() - value2.value.getTime());
    case 'number number':
    case 'text text':
      return buildLiteralFromJs(value1.value - value2.value);
    default:
      ArgumentError.throwWrongType('subtract', 'number', value2.dataType);
  }
};
/* eslint-enable consistent-return */

export const sf$multiply = (value1, value2) => buildLiteralFromJs(value1.value * value2.value);

export const sf$divide = (value1, value2) => buildLiteralFromJs(value1.value / value2.value);

export const sf$exponentiate = (value1, value2) => (
  buildLiteralFromJs(value1.value ** value2.value)
);

// Math Functions

export const sf$abs = (number) => buildLiteralFromJs(Math.abs(number.value));

export const sf$ceiling = (number) => {
  if (number.value < 0) {
    return buildLiteralFromJs(-1 * Math.ceil(-1 * number.value));
  }

  return buildLiteralFromJs(Math.ceil(number.value));
};

export const sf$distance = (location1, location2, unit) => {
  const distanceUnit = unit.value;

  if (distanceUnit !== 'km' && distanceUnit !== 'mi') {
    const options = {
      function: 'distance',
      expected: ['km', 'mi'],
      received: distanceUnit,
    };
    throw new ArgumentError(`Incorrect parameter value for function 'DISTANCE()'. Expected 'mi'/'km', received '${distanceUnit}'`, options);
  }

  const [lat1, lon1] = location1.value;
  const [lat2, lon2] = location2.value;

  // haversine algorithm taken from https://www.movable-type.co.uk/scripts/latlong.html
  if ((lat1 === lat2) && (lon1 === lon2)) {
    return buildLiteralFromJs(0);
  }

  // earth radius in meters, reverse engineered from
  // Salesforce DISTANCE(GEOLOCATION(0,0), GEOLOCATION(0, 180), 'km')
  const earthRadius = 6371009;
  const phi1 = (lat1 * Math.PI) / 180;
  const phi2 = (lat2 * Math.PI) / 180;
  const deltaPhi = ((lat2 - lat1) * Math.PI) / 180;
  const deltaLambda = ((lon2 - lon1) * Math.PI) / 180;

  const a = Math.sin(deltaPhi / 2) * Math.sin(deltaPhi / 2)
              + Math.cos(phi1) * Math.cos(phi2)
              * Math.sin(deltaLambda / 2) * Math.sin(deltaLambda / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  const d = (earthRadius * c) / 1000;

  if (distanceUnit === 'mi') {
    return buildLiteralFromJs(d / 1.609344);
  }

  return buildLiteralFromJs(d);
};

export const sf$exp = (number) => buildLiteralFromJs(Math.exp(number.value));

export const sf$floor = (number) => {
  if (number.value < 0) {
    return buildLiteralFromJs(-1 * Math.floor(-1 * number.value));
  }

  return buildLiteralFromJs(Math.floor(number.value));
};

export const sf$geolocation = (latitude, longitude) => (
  buildGeolocationLiteral(latitude.value, longitude.value)
);

export const sf$ln = (number) => buildLiteralFromJs(Math.log(number.value));

export const sf$log = (number) => buildLiteralFromJs(Math.log10(number.value));

export const sf$max = (...numbers) => {
  const values = numbers.map((v) => v.value);
  return buildLiteralFromJs(Math.max(...values));
};

export const sf$mceiling = (number) => buildLiteralFromJs(Math.ceil(number.value));

export const sf$mfloor = (number) => buildLiteralFromJs(Math.floor(number.value));

export const sf$min = (...numbers) => {
  const values = numbers.map((v) => v.value);
  return buildLiteralFromJs(Math.min(...values));
};

export const sf$mod = (number, divisor) => buildLiteralFromJs(number.value % divisor.value);

export const sf$round = (number, numDigits) => (
  buildLiteralFromJs(sfRound(number.value, numDigits.value))
);

export const sf$sqrt = (number) => buildLiteralFromJs(Math.sqrt(number.value));

// Text Functions

export const sf$begins = (text, compareText) => (
  buildLiteralFromJs(text.value.startsWith(compareText.value))
);

export const sf$br = () => buildLiteralFromJs('\n');

export const sf$casesafeid = (id) => {
  let suffix = '';

  [0, 1, 2].forEach((i) => {
    let flags = 0;

    [0, 1, 2, 3, 4].forEach((j) => {
      const c = id.value[i * 5 + j];
      if (c.toUpperCase() === c && c >= 'A' && c <= 'Z') {
        /* eslint no-bitwise: ["error", { "allow": ["<<"] }] */
        flags += 1 << j;
        /* eslint no-bitwise: ["error", { "allow": ["<<"] }] */
      }
    });
    suffix += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ012345'[flags];
  });

  return buildLiteralFromJs(id.value + suffix);
};

export const sf$concat = (text1, text2) => buildLiteralFromJs(text1.value + text2.value);

export const sf$contains = (text, compareText) => (
  buildLiteralFromJs(text.value.includes(compareText.value))
);

export const sf$find = (searchText, text, startNum = buildLiteralFromJs(1)) => {
  if (startNum.value <= 0 || searchText.value === '') {
    return buildLiteralFromJs(0);
  }

  const textToSearchIn = text.value.substring(startNum.value - 1);
  return buildLiteralFromJs(textToSearchIn.indexOf(searchText.value) + 1);
};

export const sf$getsessionid = () => buildLiteralFromJs(STATIC_SESSION_ID);

export const sf$hyperlink = (url, friendlyName, target = null) => {
  const targetString = target ? ` target="${target.value}"` : '';

  return buildLiteralFromJs(`<a href="${url.value}"${targetString}>${friendlyName.value}</a>`);
};

export const sf$image = (imageUrl, alternateText, height = null, width = null) => {
  const heightString = height ? ` height="${height.value}"` : '';
  const widthString = width ? ` width="${width.value}"` : '';
  return buildLiteralFromJs(`<img src="${imageUrl.value}" alt="${alternateText.value}"${heightString}${widthString}/>`);
};

export const sf$includes = (multiselectPicklistField, textLiteral) => (
  buildLiteralFromJs(multiselectPicklistField.value.includes(textLiteral.value))
);

export const sf$ispickval = (picklistField, textLiteral) => (
  buildLiteralFromJs(picklistField.value === textLiteral.value)
);

export const sf$mid = (text, startNum, numChars) => (
  buildLiteralFromJs(text.value.substr(startNum.value - 1, numChars.value))
);

export const sf$left = (text, numChars) => sf$mid(text, buildLiteralFromJs(1), numChars);

export const sf$len = (text) => buildLiteralFromJs(text.value.length);

/* eslint-disable no-unused-vars */
export const sf$lower = (text, _locale) => buildLiteralFromJs(text.value.toLowerCase());
/* eslint-enable no-unused-vars */

export const sf$lpad = (text, paddedLength, padString) => {
  if (padString == null) {
    return text;
  } if (paddedLength.value < text.value.length) {
    return sf$left(text, paddedLength);
  }
  const maxPadding = padString.value.repeat(paddedLength.value);
  return buildLiteralFromJs((maxPadding + text.value).slice(-paddedLength.value));
};

export const sf$right = (text, numChars) => (
  buildLiteralFromJs(text.value.substr(text.value.length - numChars.value))
);

export const sf$rpad = (text, paddedLength, padString) => {
  if (padString == null) {
    return text;
  } if (paddedLength.value < text.value.length) {
    return sf$left(text, paddedLength);
  }
  const maxPadding = padString.value.repeat(paddedLength.value);
  return buildLiteralFromJs((text.value + maxPadding).substr(0, paddedLength.value));
};

export const sf$substitute = (text, oldText, newText) => buildLiteralFromJs(text.value.replace(new RegExp(escapeRegExp(oldText.value), 'g'), newText.value));

export const sf$text = (value) => {
  if (value.dataType === 'text') {
    return value;
  }

  if (value.dataType === 'datetime') {
    return buildLiteralFromJs(formatLiteral(value).replace('T', ' ').replace(/\.\d{3}/, ''));
  }

  return buildLiteralFromJs(formatLiteral(value));
};

export const sf$trim = (text) => buildLiteralFromJs(text.value.trim());

/* eslint-disable no-unused-vars */
export const sf$upper = (text, _locale) => buildLiteralFromJs(text.value.toUpperCase());
/* eslint-enable no-unused-vars */

/* eslint-disable no-unused-vars */
export const sf$value = (text) => {
  const parsedValue = parseFloat(text.value);

  if (parsedValue) {
    return buildLiteralFromJs(parsedValue);
  }

  return buildLiteralFromJs(null);
};
/* eslint-enable no-unused-vars */

// Advanced Functions

/* eslint-disable no-unused-vars */
export const sf$currencyrate = (_isoCode) => {
  NotImplementedError.throwError('currencyrate');
};
/* eslint-enable no-unused-vars */

export const sf$regex = (text, regexText) => {
  const r = new RegExp(`^${regexText.value}$`);
  return buildLiteralFromJs(r.exec(text.value) != null);
};
