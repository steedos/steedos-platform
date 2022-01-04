/* global describe it context */

import { expect } from 'chai';
import {
  addMonths,
  arrayUnique,
  buildDateLiteral,
  buildDatetimeLiteral,
  buildErrorLiteral,
  buildLiteralFromJs,
  buildGeolocationLiteral,
  buildMultipicklistLiteral,
  buildPicklistLiteral,
  buildTimeLiteral,
  formatLiteral,
  handleFormulonError,
  parseTime,
  sfRound,
  coerceLiteral,
} from '../src/utils';

import ArgumentError from '../src/errors/ArgumentError';
import NoFunctionError from '../src/errors/NoFunctionError';
import NotImplementedError from '../src/errors/NotImplementedError';
import ReferenceError from '../src/errors/ReferenceError';

describe('parseTime', () => {
  context('valid time', () => {
    it('returns expected result', () => {
      expect(parseTime('16:23:56.826')).to.deep.eq(buildTimeLiteral(59036826));
    });
  });

  context('invalid time', () => {
    context('invalid format', () => {
      it('returns expected result', () => {
        expect(parseTime('abc')).to.deep.eq(buildLiteralFromJs(null));
      });
    });

    context('hour invalid', () => {
      it('returns expected result', () => {
        expect(parseTime('24:23:56.826')).to.deep.eq(buildLiteralFromJs(null));
      });
    });

    context('minute invalid', () => {
      it('returns expected result', () => {
        expect(parseTime('16:60:56.826')).to.deep.eq(buildLiteralFromJs(null));
      });
    });

    context('second invalid', () => {
      it('returns expected result', () => {
        expect(parseTime('16:23:60.826')).to.deep.eq(buildLiteralFromJs(null));
      });
    });

    context('millisecond invalid', () => {
      it('returns expected result', () => {
        expect(parseTime('16:23:56.1000')).to.deep.eq(buildLiteralFromJs(null));
      });
    });
  });
});

describe('buildLiteralFromJs', () => {
  context('Number', () => {
    context('Integer', () => {
      it('returns expected Literal for positive number', () => {
        const expected = {
          type: 'literal',
          value: 1,
          dataType: 'number',
          options: {
            length: 1,
            scale: 0,
          },
        };
        expect(buildLiteralFromJs(1)).to.deep.eq(expected);
      });

      it('returns expected Literal for negative number', () => {
        const expected = {
          type: 'literal',
          value: -12,
          dataType: 'number',
          options: {
            length: 2,
            scale: 0,
          },
        };
        expect(buildLiteralFromJs(-12)).to.deep.eq(expected);
      });
    });

    context('Float', () => {
      it('returns expected Literal for positive number', () => {
        const expected = {
          type: 'literal',
          value: 1.5,
          dataType: 'number',
          options: {
            length: 1,
            scale: 1,
          },
        };
        expect(buildLiteralFromJs(1.5)).to.deep.eq(expected);
      });

      it('returns expected Literal for positive number', () => {
        const expected = {
          type: 'literal',
          value: -125.75,
          dataType: 'number',
          options: {
            length: 3,
            scale: 2,
          },
        };
        expect(buildLiteralFromJs(-125.75)).to.deep.eq(expected);
      });
    });
  });

  context('Text', () => {
    it('returns expected Literal for text number', () => {
      const expected = {
        type: 'literal',
        value: 'four',
        dataType: 'text',
        options: {
          length: 4,
        },
      };
      expect(buildLiteralFromJs('four')).to.deep.eq(expected);
    });
  });

  context('Checkbox', () => {
    it('returns expected Literal for true', () => {
      const expected = {
        type: 'literal',
        value: true,
        dataType: 'checkbox',
        options: {},
      };
      expect(buildLiteralFromJs(true)).to.deep.eq(expected);
    });
  });

  context('Null', () => {
    it('returns expected Literal', () => {
      const expected = {
        type: 'literal',
        value: null,
        dataType: 'null',
        options: {},
      };
      expect(buildLiteralFromJs(null)).to.deep.eq(expected);
    });
  });

  context('Undefined', () => {
    it('returns expected Literal', () => {
      const expected = {
        type: 'literal',
        value: null,
        dataType: 'null',
        options: {},
      };
      expect(buildLiteralFromJs(undefined)).to.deep.eq(expected);
    });
  });

  context('unsupported type', () => {
    it('throws TypeError', () => {
      const fn = () => { buildLiteralFromJs({}); };

      expect(fn).to.throw(TypeError, "Unsupported type 'object'");
    });
  });
});

describe('buildDateLiteral', () => {
  context('integer input', () => {
    it('returns expected literal for year/month/day', () => {
      const expected = {
        type: 'literal',
        value: new Date(Date.UTC(2020, 1, 11)),
        dataType: 'date',
        options: {},
      };
      expect(buildDateLiteral(2020, 2, 11)).to.deep.eq(expected);
    });
  });

  context('date input', () => {
    it('returns expected literal for date', () => {
      const expected = {
        type: 'literal',
        value: new Date(Date.UTC(2020, 1, 11)),
        dataType: 'date',
        options: {},
      };
      expect(buildDateLiteral(new Date(Date.UTC(2020, 1, 11)))).to.deep.eq(expected);
    });
  });
});

describe('buildDatetimeLiteral', () => {
  context('unix timestamp input', () => {
    it('returns expected literal for unix timesampt', () => {
      const expected = {
        type: 'literal',
        value: new Date(Date.UTC(2020, 1, 11, 14, 39, 42, 974)),
        dataType: 'datetime',
        options: {},
      };
      expect(buildDatetimeLiteral(1581431982974)).to.deep.eq(expected);
    });
  });

  context('date input', () => {
    it('returns expected literal for date', () => {
      const input = new Date(Date.UTC(2020, 1, 11, 14, 39, 42, 974));
      const expected = {
        type: 'literal',
        value: input,
        dataType: 'datetime',
        options: {},
      };
      expect(buildDatetimeLiteral(input)).to.deep.eq(expected);
    });
  });
});

describe('buildTimeLiteral', () => {
  context('milliseconds from midnight input', () => {
    it('returns expected literal for milliseconds from midnight', () => {
      const expected = {
        type: 'literal',
        value: new Date(86341005),
        dataType: 'time',
        options: {},
      };
      expect(buildTimeLiteral(86341005)).to.deep.eq(expected);
    });
  });
});

describe('buildErrorLiteral', () => {
  it('returns expected Literal for error', () => {
    const expected = {
      type: 'error',
      errorType: 'ReferenceError',
      identifier: 'idontexist',
      message: 'Field idontexist does not exist. Check spelling.',
    };
    expect(buildErrorLiteral('ReferenceError', 'Field idontexist does not exist. Check spelling.', { identifier: 'idontexist' })).to.deep.eq(expected);
  });
});

describe('buildMultipicklistLiteral', () => {
  it('returns expected Literal for picklist', () => {
    const expected = {
      type: 'literal',
      value: ['Pumpkin', 'Vanilla'],
      dataType: 'multipicklist',
      options: { values: ['Gingerbread', 'Strawberry', 'Chocolate', 'Raspberry', 'Pumpkin', 'Mint', 'Vanilla'] },
    };

    expect(buildMultipicklistLiteral(['Pumpkin', 'Vanilla'], ['Gingerbread', 'Strawberry', 'Chocolate', 'Raspberry', 'Pumpkin', 'Mint', 'Vanilla'])).to.deep.eq(expected);
  });
});

describe('buildPicklistLiteral', () => {
  it('returns expected Literal for picklist', () => {
    const expected = {
      type: 'literal',
      value: 'Public',
      dataType: 'picklist',
      options: { values: ['Public', 'Private', 'Subsidiary', 'Other'] },
    };
    expect(buildPicklistLiteral('Public', ['Public', 'Private', 'Subsidiary', 'Other'])).to.deep.eq(expected);
  });
});

describe('buildGeolocationLiteral', () => {
  it('returns expected Literal for geolocation', () => {
    const expected = {
      type: 'literal',
      value: [32.855160, -117.258836],
      dataType: 'geolocation',
      options: { },
    };
    expect(buildGeolocationLiteral(32.855160, -117.258836)).to.deep.eq(expected);
  });
});

describe('arrayUnique', () => {
  // TODO add deepFreeze
  context('non redundant elements', () => {
    it('returns same input as output for empty array', () => {
      const input = [];
      const expected = [];
      expect(arrayUnique(input)).to.deep.eq(expected);
    });

    it('returns same input as output', () => {
      const input = ['a', 'b', 'c'];
      const expected = ['a', 'b', 'c'];
      expect(arrayUnique(input)).to.deep.eq(expected);
    });
  });

  context('redundant elements', () => {
    it('leaves out redundant elements', () => {
      const input = ['a', 'b', 'c', 'a'];
      const expected = ['a', 'b', 'c'];
      expect(arrayUnique(input)).to.deep.eq(expected);
    });
  });
});

describe('sfRound', () => {
  it('positive number round up to full number', () => {
    expect(sfRound(1.5, 0)).to.deep.eq(2);
  });

  it('positive number round down to full number', () => {
    expect(sfRound(1.2345, 0)).to.deep.eq(1);
  });

  it('negative number round up to full number', () => {
    expect(sfRound(-1.5, 0)).to.deep.eq(-2);
  });

  it('positive number round up to 2 digits', () => {
    expect(sfRound(225.49823, 2)).to.deep.eq(225.50);
  });

  it('positive number down to 2 digits', () => {
    expect(sfRound(-225.495, 2)).to.deep.eq(-225.50);
  });
});

describe('addMonths', () => {
  context('mid month', () => {
    it('returns one month later', () => {
      const input = new Date(Date.UTC(2020, 6, 15));
      const expected = new Date(Date.UTC(2020, 8, 15));
      expect(addMonths(input, 2)).to.deep.eq(expected);
    });
  });

  context('end of the year', () => {
    it('returns one month later', () => {
      const input = new Date(Date.UTC(1999, 11, 15));
      const expected = new Date(Date.UTC(2000, 0, 15));
      expect(addMonths(input, 1)).to.deep.eq(expected);
    });
  });

  context('end of the month', () => {
    it('returns one month later', () => {
      const input = new Date(Date.UTC(2005, 0, 31));
      const expected = new Date(Date.UTC(2005, 1, 28));
      expect(addMonths(input, 1)).to.deep.eq(expected);
    });
  });
});

describe('coerceLiteral', () => {
  context('Number', () => {
    it('rounds accordingly', () => {
      const input = {
        type: 'literal',
        dataType: 'number',
        value: 1.5,
        options: {
          length: 1,
          scale: 0,
        },
      };

      const expectedOutput = {
        type: 'literal',
        dataType: 'number',
        value: 2,
        options: {
          length: 1,
          scale: 0,
        },
      };
      expect(coerceLiteral(input)).to.deep.eq(expectedOutput);
    });
  });

  context('Text', () => {
    it('cuts text off', () => {
      const input = {
        type: 'literal',
        dataType: 'text',
        value: 'first second',
        options: {
          length: 5,
        },
      };

      const expectedOutput = {
        type: 'literal',
        dataType: 'text',
        value: 'first',
        options: {
          length: 5,
        },
      };
      expect(coerceLiteral(input)).to.deep.eq(expectedOutput);
    });
  });
});

describe('formatLiteral', () => {
  context('Number', () => {
    it('returns correct string for null value', () => {
      const input = Object.assign(buildLiteralFromJs(1), { value: null });
      expect(formatLiteral(input)).to.eq('');
    });

    it('returns correct string for undefined value', () => {
      const input = Object.assign(buildLiteralFromJs(1), { value: undefined });
      expect(formatLiteral(input)).to.eq('');
    });

    it('returns correct string for zero', () => {
      expect(formatLiteral(buildLiteralFromJs(0))).to.eq('0');
    });

    it('returns correct string for integer', () => {
      expect(formatLiteral(buildLiteralFromJs(1))).to.eq('1');
    });

    it('returns correct string for float', () => {
      expect(formatLiteral(buildLiteralFromJs(3.14))).to.eq('3.14');
    });
  });

  context('Text', () => {
    it('returns correct string for null value', () => {
      const input = Object.assign(buildLiteralFromJs('string'), { value: null });
      expect(formatLiteral(input)).to.eq('');
    });

    it('returns correct string for undefined value', () => {
      const input = Object.assign(buildLiteralFromJs('string'), { value: undefined });
      expect(formatLiteral(input)).to.eq('');
    });

    it('returns correct string for empty string', () => {
      expect(formatLiteral(buildLiteralFromJs(''))).to.eq('""');
    });

    it('returns correct string', () => {
      expect(formatLiteral(buildLiteralFromJs('string'))).to.eq('"string"');
    });
  });

  context('Checkbox', () => {
    it('returns correct string for null value', () => {
      const input = Object.assign(buildLiteralFromJs(false), { value: null });
      expect(formatLiteral(input)).to.eq('');
    });

    it('returns correct string for undefined value', () => {
      const input = Object.assign(buildLiteralFromJs(false), { value: undefined });
      expect(formatLiteral(input)).to.eq('');
    });

    it('returns correct string for true', () => {
      expect(formatLiteral(buildLiteralFromJs(true))).to.eq('TRUE');
    });

    it('returns correct string for false', () => {
      expect(formatLiteral(buildLiteralFromJs(false))).to.eq('FALSE');
    });
  });

  context('Date', () => {
    it('returns correct string for null value', () => {
      const input = Object.assign(buildDateLiteral(2020, 2, 11), { value: null });
      expect(formatLiteral(input)).to.eq('');
    });

    it('returns correct string for undefined value', () => {
      const input = Object.assign(buildDateLiteral(2020, 2, 11), { value: undefined });
      expect(formatLiteral(input)).to.eq('');
    });

    it('returns correct string for date', () => {
      expect(formatLiteral(buildDateLiteral(2020, 2, 11))).to.eq('2020-02-11');
    });
  });

  context('Datetime', () => {
    it('returns correct string for null value', () => {
      const input = Object.assign(
        buildDatetimeLiteral(Date.UTC(2020, 1, 11, 14, 39, 42, 974)),
        { value: null },
      );
      expect(formatLiteral(input)).to.eq('');
    });

    it('returns correct string for undefined value', () => {
      const input = Object.assign(
        buildDatetimeLiteral(Date.UTC(2020, 1, 11, 14, 39, 42, 974)),
        { value: undefined },
      );
      expect(formatLiteral(input)).to.eq('');
    });

    it('returns correct string for datetime', () => {
      const unixTimestamp = Date.UTC(2020, 1, 11, 14, 39, 42, 974);
      expect(formatLiteral(buildDatetimeLiteral(unixTimestamp))).to.eq('2020-02-11T14:39:42.974Z');
    });
  });

  context('Time', () => {
    it('returns correct string for null value', () => {
      const input = Object.assign(buildTimeLiteral(32833019), { value: null });
      expect(formatLiteral(input)).to.eq('');
    });

    it('returns correct string for undefined value', () => {
      const input = Object.assign(buildTimeLiteral(32833019), { value: undefined });
      expect(formatLiteral(input)).to.eq('');
    });

    it('returns correct string for time', () => {
      const milliSecondsFromMidnight = 32833019;
      expect(formatLiteral(buildTimeLiteral(milliSecondsFromMidnight))).to.eq('09:07:13.019');
    });
  });

  context('Geolocation', () => {
    context('null input', () => {
      it('returns correct string for both arguments being null', () => {
        expect(formatLiteral(buildGeolocationLiteral(null, null))).to.eq('');
      });

      it('returns correct string for first arguments being null', () => {
        expect(formatLiteral(buildGeolocationLiteral(null, -117.258836))).to.eq('');
      });

      it('returns correct string for last arguments being null', () => {
        expect(formatLiteral(buildGeolocationLiteral(32.855160, null))).to.eq('');
      });
    });

    context('default input', () => {
      it('returns correct string for 0,0', () => {
        expect(formatLiteral(buildGeolocationLiteral(0, 0))).to.eq('0.000000, 0.000000');
      });
    });

    context('float input', () => {
      it('returns correct string for gelocation', () => {
        expect(formatLiteral(buildGeolocationLiteral(32.855160, -117.258836))).to.eq('32.855160, -117.258836');
      });
    });

    context('integer input', () => {
      it('returns correct string for gelocation', () => {
        expect(formatLiteral(buildGeolocationLiteral(51.4764081, 0))).to.eq('51.476408, 0.000000');
      });
    });
  });

  context('Picklist', () => {
    it('returns correct string for picklist', () => {
      expect(formatLiteral(buildPicklistLiteral('Public', ['Public', 'Private']))).to.eq('"Public"');
    });
  });

  context('Multipicklist', () => {
    it('returns correct string for picklist', () => {
      expect(formatLiteral(buildMultipicklistLiteral(['Pumpkin', 'Vanilla'], ['Gingerbread', 'Strawberry', 'Chocolate', 'Raspberry', 'Pumpkin', 'Mint', 'Vanilla']))).to.eq('["Pumpkin", "Vanilla"]');
    });
  });

  context('Null', () => {
    it('returns correct string for date', () => {
      expect(formatLiteral(buildLiteralFromJs(null))).to.eq('NULL');
    });
  });
});

describe('handleFormulonError', () => {
  context('no error raised', () => {
    it('returns value of function', () => {
      const fn = () => 'success';
      expect(handleFormulonError(fn)).to.eq('success');
    });
  });

  context('ArgumentError', () => {
    it('returns error object', () => {
      const fn = () => { throw new ArgumentError('Test Argument Error', { optionKey: 'optionValue' }); };
      const expected = {
        type: 'error',
        errorType: 'ArgumentError',
        message: 'Test Argument Error',
        optionKey: 'optionValue',
      };
      expect(handleFormulonError(fn)).to.deep.eq(expected);
    });
  });

  context('ReferenceError', () => {
    it('returns error object', () => {
      const fn = () => { throw new ReferenceError('Test ReferenceError', { optionKey: 'optionValue' }); };
      const expected = {
        type: 'error',
        errorType: 'ReferenceError',
        message: 'Test ReferenceError',
        optionKey: 'optionValue',
      };
      expect(handleFormulonError(fn)).to.deep.eq(expected);
    });
  });

  context('NoFunctionError', () => {
    it('returns error object', () => {
      const fn = () => { throw new NoFunctionError('Test NoFunctionError', { optionKey: 'optionValue' }); };
      const expected = {
        type: 'error',
        errorType: 'NoFunctionError',
        message: 'Test NoFunctionError',
        optionKey: 'optionValue',
      };
      expect(handleFormulonError(fn)).to.deep.eq(expected);
    });
  });

  context('NotImplementedError', () => {
    it('returns error object', () => {
      const fn = () => { throw new NotImplementedError('Test NotImplementedError', { optionKey: 'optionValue' }); };
      const expected = {
        type: 'error',
        errorType: 'NotImplementedError',
        message: 'Test NotImplementedError',
        optionKey: 'optionValue',
      };
      expect(handleFormulonError(fn)).to.deep.eq(expected);
    });
  });

  context('non formulon error', () => {
    it('throws error', () => {
      const fn = () => { throw new TypeError('Something different'); };
      expect(fn).to.throw(TypeError, 'Something different');
    });
  });
});
