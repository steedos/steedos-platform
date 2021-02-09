import * as functions from './functions';
import {
  caseParams,
  maxNumOfParams,
  minNumOfParams,
  paramTypes,
  sameParamType,
} from './validations';
import { handleFormulonError } from './utils';
import NoFunctionError from './errors/NoFunctionError';

const existingFunctions = {
  abs: {
    validations: [minNumOfParams(1), maxNumOfParams(1), paramTypes('number')],
    returnType: 'number',
  },
  add: {
    validations: [minNumOfParams(2), maxNumOfParams(2), paramTypes(['number', 'text', 'date', 'datetime', 'time'], ['number', 'text', 'date', 'datetime', 'time'])],
    returnType: ['number', 'text', 'date', 'datetime', 'time'],
  },
  addmonths: {
    validations: [minNumOfParams(2), maxNumOfParams(2), paramTypes(['date', 'datetime'], ['number'])],
    returnType: ['date', 'datetime'],
  },
  and: {
    validations: [minNumOfParams(1), paramTypes('checkbox')],
    returnType: 'checkbox',
  },
  begins: {
    validations: [minNumOfParams(2), maxNumOfParams(2), paramTypes('text', 'text')],
    returnType: 'checkbox',
  },
  blankvalue: {
    validations: [minNumOfParams(2), maxNumOfParams(2), paramTypes(['text', 'number', 'date', 'datetime', 'geolocation']), sameParamType()],
    returnType: ['text', 'number', 'date', 'datetime', 'geolocation'],
  },
  br: {
    validations: [minNumOfParams(0), maxNumOfParams(0)],
    returnType: 'text',
  },
  case: {
    validations: [minNumOfParams(4), paramTypes(['text', 'number', 'picklist', 'date', 'datetime']), caseParams()],
    returnType: ['text', 'number', 'date', 'datetime'],
  },
  casesafeid: {
    validations: [minNumOfParams(1), maxNumOfParams(1), paramTypes('text')],
    returnType: 'text',
  },
  ceiling: {
    validations: [minNumOfParams(1), maxNumOfParams(1), paramTypes('number')],
    returnType: 'number',
  },
  contains: {
    validations: [minNumOfParams(2), maxNumOfParams(2), paramTypes('text', 'text')],
    returnType: 'checkbox',
  },
  currencyrate: {
    validations: [minNumOfParams(1), maxNumOfParams(1), paramTypes('text')],
    returnType: 'text',
  },
  date: {
    validations: [minNumOfParams(3), maxNumOfParams(3), paramTypes('number', 'number', 'number')],
    returnType: 'date',
  },
  datetimevalue: {
    validations: [minNumOfParams(1), maxNumOfParams(1), paramTypes('text', 'date', 'datetime')],
    returnType: 'datetime',
  },
  datevalue: {
    validations: [minNumOfParams(1), maxNumOfParams(1), paramTypes(['text', 'date', 'datetime'])],
    returnType: 'date',
  },
  day: {
    validations: [minNumOfParams(1), maxNumOfParams(1), paramTypes('date')],
    returnType: 'number',
  },
  distance: {
    validations: [minNumOfParams(3), maxNumOfParams(3), paramTypes('geolocation', 'geolocation', 'text')],
    returnType: 'number',
  },
  divide: {
    validations: [minNumOfParams(2), maxNumOfParams(2), paramTypes('number', 'number')],
    returnType: 'number',
  },
  equal: {
    validations: [minNumOfParams(2), maxNumOfParams(2), paramTypes(['text', 'number', 'date', 'datetime', 'checkbox']), sameParamType()],
    returnType: 'checkbox',
  },
  exp: {
    validations: [minNumOfParams(1), maxNumOfParams(1), paramTypes('number')],
    returnType: 'number',
  },
  exponentiate: {
    validations: [minNumOfParams(2), maxNumOfParams(2), paramTypes('number', 'number')],
    returnType: 'number',
  },
  find: {
    validations: [minNumOfParams(2), maxNumOfParams(3), paramTypes('text', 'text', 'number')],
    returnType: 'number',
  },
  floor: {
    validations: [minNumOfParams(1), maxNumOfParams(1), paramTypes('number')],
    returnType: 'number',
  },
  geolocation: {
    validations: [minNumOfParams(2), maxNumOfParams(2), paramTypes('number', 'number')],
    returnType: 'geolocation',
  },
  getsessionid: {
    validations: [minNumOfParams(0), maxNumOfParams(0)],
    returnType: 'text',
  },
  greaterThan: {
    validations: [minNumOfParams(2), maxNumOfParams(2), paramTypes(['number', 'date', 'datetime']), sameParamType()],
    returnType: 'checkbox',
  },
  greaterThanOrEqual: {
    validations: [minNumOfParams(2), maxNumOfParams(2), paramTypes(['number', 'date', 'datetime'])],
    returnType: 'checkbox',
  },
  hour: {
    validations: [minNumOfParams(1), maxNumOfParams(1), paramTypes('datetime')],
    returnType: 'number',
  },
  hyperlink: {
    validations: [minNumOfParams(2), maxNumOfParams(3), paramTypes('text', 'text', 'text')],
    returnType: 'text',
  },
  if: {
    validations: [minNumOfParams(3), maxNumOfParams(3), paramTypes('checkbox', ['text', 'number', 'date', 'datetime'], ['text', 'number', 'date', 'datetime'])],
    returnType: ['text', 'number', 'date', 'datetime'],
  },
  image: {
    validations: [minNumOfParams(2), maxNumOfParams(4), paramTypes('text', 'text', 'number', 'number')],
    returnType: 'text',
  },
  includes: {
    validations: [minNumOfParams(2), maxNumOfParams(2), paramTypes('multipicklist', 'text')],
    returnType: 'checkbox',
  },
  isblank: {
    validations: [minNumOfParams(1), maxNumOfParams(1), paramTypes(['text', 'number', 'date', 'datetime', 'picklist', 'multipicklist', 'geolocation'])],
    returnType: 'checkbox',
  },
  isnull: {
    validations: [minNumOfParams(1), maxNumOfParams(1), paramTypes(['text', 'number'])],
    returnType: 'checkbox',
  },
  ispickval: {
    validations: [minNumOfParams(2), maxNumOfParams(2), paramTypes('picklist', 'text')],
    returnType: 'checkbox',
  },
  isnumber: {
    validations: [minNumOfParams(1), maxNumOfParams(1), paramTypes('text')],
    returnType: 'checkbox',
  },
  left: {
    validations: [minNumOfParams(2), maxNumOfParams(2), paramTypes('text', 'number')],
    returnType: 'text',
  },
  len: {
    validations: [minNumOfParams(1), maxNumOfParams(1), paramTypes('text')],
    returnType: 'number',
  },
  lessThan: {
    validations: [minNumOfParams(2), maxNumOfParams(2), paramTypes(['number', 'date', 'datetime']), sameParamType()],
    returnType: 'checkbox',
  },
  lessThanOrEqual: {
    validations: [minNumOfParams(2), maxNumOfParams(2), paramTypes(['number', 'date', 'datetime']), sameParamType()],
    returnType: 'checkbox',
  },
  ln: {
    validations: [minNumOfParams(1), maxNumOfParams(1), paramTypes('number')],
    returnType: 'number',
  },
  log: {
    validations: [minNumOfParams(1), maxNumOfParams(1), paramTypes('number')],
    returnType: 'checkbox',
  },
  lower: {
    validations: [minNumOfParams(1), maxNumOfParams(1), paramTypes('text')],
    returnType: 'text',
  },
  lpad: {
    validations: [minNumOfParams(2), maxNumOfParams(3), paramTypes('text', 'number', 'text')],
    returnType: 'text',
  },
  max: {
    validations: [minNumOfParams(1), paramTypes('number')],
    returnType: 'number',
  },
  mceiling: {
    validations: [minNumOfParams(1), maxNumOfParams(1), paramTypes('number')],
    returnType: 'number',
  },
  mfloor: {
    validations: [minNumOfParams(1), maxNumOfParams(1), paramTypes('number')],
    returnType: 'number',
  },
  mid: {
    validations: [minNumOfParams(3), maxNumOfParams(3), paramTypes('text', 'number', 'number')],
    returnType: 'number',
  },
  millisecond: {
    validations: [minNumOfParams(1), maxNumOfParams(1), paramTypes('datetime')],
    returnType: 'number',
  },
  min: {
    validations: [minNumOfParams(1), paramTypes('number')],
    returnType: 'number',
  },
  minute: {
    validations: [minNumOfParams(1), maxNumOfParams(1), paramTypes('datetime')],
    returnType: 'number',
  },
  mod: {
    validations: [minNumOfParams(2), maxNumOfParams(2), paramTypes('number', 'number')],
    returnType: 'number',
  },
  month: {
    validations: [minNumOfParams(1), maxNumOfParams(1), paramTypes('date')],
    returnType: 'number',
  },
  multiply: {
    validations: [minNumOfParams(2), maxNumOfParams(2), paramTypes('number', 'number')],
    returnType: 'number',
  },
  not: {
    validations: [minNumOfParams(1), maxNumOfParams(1), paramTypes('checkbox')],
    returnType: 'checkbox',
  },
  now: {
    validations: [minNumOfParams(0), maxNumOfParams(0)],
    returnType: 'datetime',
  },
  nullvalue: {
    validations: [minNumOfParams(2), maxNumOfParams(2), paramTypes(['text', 'number'], ['text', 'number'])],
    returnType: ['text', 'number'],
  },
  or: {
    validations: [minNumOfParams(1), paramTypes('checkbox')],
    returnType: 'checkbox',
  },
  regex: {
    validations: [minNumOfParams(2), maxNumOfParams(2), paramTypes('text', 'text')],
    returnType: 'text',
  },
  right: {
    validations: [minNumOfParams(2), maxNumOfParams(2), paramTypes('text', 'number')],
    returnType: 'text',
  },
  round: {
    validations: [minNumOfParams(2), maxNumOfParams(2), paramTypes('number', 'number')],
    returnType: 'number',
  },
  rpad: {
    validations: [minNumOfParams(2), maxNumOfParams(3), paramTypes('text', 'number', 'text')],
    returnType: 'text',
  },
  second: {
    validations: [minNumOfParams(1), maxNumOfParams(1), paramTypes('datetime')],
    returnType: 'number',
  },
  sqrt: {
    validations: [minNumOfParams(1), maxNumOfParams(1), paramTypes('number')],
    returnType: 'number',
  },
  subtract: {
    validations: [minNumOfParams(2), maxNumOfParams(2), paramTypes(['number', 'date', 'datetime', 'time'], ['number', 'date', 'datetime', 'time'])],
    returnType: ['number', 'date', 'datetime', 'time'],
  },
  substitute: {
    validations: [minNumOfParams(3), maxNumOfParams(3), paramTypes('text', 'text', 'text')],
    returnType: 'text',
  },
  text: {
    validations: [minNumOfParams(1), maxNumOfParams(1), paramTypes(['number', 'date', 'datetime', 'picklist', 'time'])],
    returnType: 'text',
  },
  timenow: {
    validations: [minNumOfParams(0), maxNumOfParams(0)],
    returnType: 'time',
  },
  timevalue: {
    validations: [minNumOfParams(1), maxNumOfParams(1), paramTypes('text')],
    returnType: 'time',
  },
  today: {
    validations: [minNumOfParams(0), maxNumOfParams(0)],
    returnType: 'date',
  },
  trim: {
    validations: [minNumOfParams(1), maxNumOfParams(1), paramTypes('text')],
    returnType: 'text',
  },
  unequal: {
    validations: [minNumOfParams(2), maxNumOfParams(2), paramTypes(['text', 'number', 'date', 'datetime', 'checkbox']), sameParamType()],
    returnType: 'checkbox',
  },
  upper: {
    validations: [minNumOfParams(1), maxNumOfParams(1), paramTypes('text')],
    returnType: 'text',
  },
  value: {
    validations: [minNumOfParams(1), maxNumOfParams(1), paramTypes('text')],
    returnType: 'number',
  },
  weekday: {
    validations: [minNumOfParams(1), maxNumOfParams(1), paramTypes('date')],
    returnType: 'number',
  },
  year: {
    validations: [minNumOfParams(1), maxNumOfParams(1), paramTypes('date')],
    returnType: 'number',
  },
};

const dispatch = (name, args) => handleFormulonError(() => {
  const runTimeError = args.find((arg) => arg.type === 'error');

  if (runTimeError) {
    return runTimeError;
  }

  const existingFunction = existingFunctions[name];

  if (existingFunction) {
    existingFunction.validations.forEach(
      (validateFn) => validateFn(name)(args),
    );

    return functions[`sf$${name}`](...args);
  }

  throw new NoFunctionError(`Unknown function ${name.toUpperCase()}. Check spelling.`, { function: name });
});

export default dispatch;
