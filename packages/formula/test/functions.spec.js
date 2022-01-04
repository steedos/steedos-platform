/* global describe it context */

import { expect } from 'chai';

import {
  buildDateLiteral,
  buildDatetimeLiteral,
  buildErrorLiteral,
  buildGeolocationLiteral,
  buildLiteralFromJs,
  buildPicklistLiteral,
  buildMultipicklistLiteral,
  buildTimeLiteral,
} from '../src/utils';

import dispatch from '../src/functionDispatcher';

// Date & Time Functions

describe('addmonths', () => {
  it('returns correct date', () => {
    const input = buildDateLiteral(1999, 12, 31);
    const expected = buildDateLiteral(2000, 2, 29);
    expect(dispatch('addmonths', [input, buildLiteralFromJs(2)])).to.deep.eq(expected);
  });
});

describe('date', () => {
  it('returns correct date', () => {
    const expected = buildDateLiteral(2020, 2, 11);
    expect(dispatch('date', [buildLiteralFromJs(2020), buildLiteralFromJs(2), buildLiteralFromJs(11)])).to.deep.eq(expected);
  });
});

describe('datetimevalue', () => {
  it('returns correct datetime', () => {
    const input = buildLiteralFromJs('2020-02-11 17:39:00.973');
    const expected = buildDatetimeLiteral(Date.UTC(2020, 1, 11, 17, 39, 0, 973));
    expect(dispatch('datetimevalue', [input])).to.deep.eq(expected);
  });
});

describe('datevalue', () => {
  it('returns correct date', () => {
    const expected = buildDateLiteral(2020, 2, 11);
    expect(dispatch('datevalue', [buildLiteralFromJs('2020-02-11')])).to.deep.eq(expected);
  });
});

describe('day', () => {
  it('returns correct day', () => {
    const expected = buildLiteralFromJs(11);
    const input = buildDateLiteral(2020, 2, 11);
    expect(dispatch('day', [input])).to.deep.eq(expected);
  });
});

describe('hour', () => {
  it('returns correct hour', () => {
    const expected = buildLiteralFromJs(17);
    const input = buildDatetimeLiteral(Date.UTC(2020, 2, 11, 17, 39, 0));
    expect(dispatch('hour', [input])).to.deep.eq(expected);
  });
});

describe('millisecond', () => {
  it('returns correct millisecond', () => {
    const expected = buildLiteralFromJs(973);
    const input = buildDatetimeLiteral(Date.UTC(2020, 2, 11, 17, 39, 0, 973));
    expect(dispatch('millisecond', [input])).to.deep.eq(expected);
  });
});

describe('minute', () => {
  it('returns correct minute', () => {
    const expected = buildLiteralFromJs(39);
    const input = buildDatetimeLiteral(Date.UTC(2020, 2, 11, 17, 39, 0));
    expect(dispatch('minute', [input])).to.deep.eq(expected);
  });
});

describe('month', () => {
  it('returns correct month', () => {
    const expected = buildLiteralFromJs(2);
    const input = buildDateLiteral(2020, 2, 11);
    expect(dispatch('month', [input])).to.deep.eq(expected);
  });
});

describe('now', () => {
  it('returns correct now', () => {
    const date = new Date();
    let expected = buildDatetimeLiteral(date.getTime());

    let result = dispatch('now', []);

    const timeDiference = result.value.getTime() - expected.value.getTime();

    // ignore exact time for comparison
    expected = Object.assign(expected, { value: null });
    result = Object.assign(result, { value: null });

    expect(result).to.deep.eq(expected);

    // check if time difference is below 100 milliseconds
    expect(timeDiference).to.be.within(0, 100);
  });
});

describe('second', () => {
  it('returns correct second', () => {
    const expected = buildLiteralFromJs(19);
    const input = buildDatetimeLiteral(Date.UTC(2020, 2, 11, 17, 39, 19));
    expect(dispatch('second', [input])).to.deep.eq(expected);
  });
});

describe('timenow', () => {
  it('returns correct timenow', () => {
    const millisecondsInDay = 24 * 60 * 60 * 1000;

    const date = new Date();
    let expected = buildTimeLiteral(date.getTime() % millisecondsInDay);

    let result = dispatch('timenow', []);

    const timeDiference = result.value.getTime() - expected.value.getTime();

    // ignore exact time for comparison
    expected = Object.assign(expected, { value: null });
    result = Object.assign(result, { value: null });

    expect(result).to.deep.eq(expected);

    // check if time difference is below 100 milliseconds
    expect(timeDiference).to.be.within(0, 100);
  });
});

describe('timevalue', () => {
  it('returns correct timevalue', () => {
    const expected = buildTimeLiteral(63061003);
    expect(dispatch('timevalue', [buildLiteralFromJs('17:31:01.003')])).to.deep.eq(expected);
  });
});

describe('today', () => {
  it('returns correct today', () => {
    const date = new Date();
    const expected = buildDateLiteral(
      date.getUTCFullYear(),
      date.getUTCMonth() + 1,
      date.getUTCDate(),
    );

    expect(dispatch('today', [])).to.deep.eq(expected);
  });
});

describe('weekday', () => {
  context('sunday', () => {
    it('returns correct weekday', () => {
      const expected = buildLiteralFromJs(1);
      const input = buildDateLiteral(2020, 3, 15);

      expect(dispatch('weekday', [input])).to.deep.eq(expected);
    });
  });

  context('saturday', () => {
    it('returns correct weekday', () => {
      const expected = buildLiteralFromJs(7);
      const input = buildDateLiteral(2020, 2, 15);

      expect(dispatch('weekday', [input])).to.deep.eq(expected);
    });
  });
});

describe('year', () => {
  it('returns correct year', () => {
    const expected = buildLiteralFromJs(2020);
    const input = buildDateLiteral(2020, 2, 15);

    expect(dispatch('year', [input])).to.deep.eq(expected);
  });
});

// Logical Functions

describe('and', () => {
  context('1 argument', () => {
    it('true', () => {
      expect(dispatch('and', [buildLiteralFromJs(true)])).to.deep.eq(buildLiteralFromJs(true));
    });

    it('false', () => {
      expect(dispatch('and', [buildLiteralFromJs(false)])).to.deep.eq(buildLiteralFromJs(false));
    });
  });

  context('2 arguments', () => {
    it('both true', () => {
      expect(dispatch('and', [buildLiteralFromJs(true), buildLiteralFromJs(true)])).to.deep.eq(buildLiteralFromJs(true));
    });

    it('false and true', () => {
      expect(dispatch('and', [buildLiteralFromJs(false), buildLiteralFromJs(true)])).to.deep.eq(buildLiteralFromJs(false));
    });

    it('true and false', () => {
      expect(dispatch('and', [buildLiteralFromJs(true), buildLiteralFromJs(false)])).to.deep.eq(buildLiteralFromJs(false));
    });

    it('both false', () => {
      expect(dispatch('and', [buildLiteralFromJs(false), buildLiteralFromJs(false)])).to.deep.eq(buildLiteralFromJs(false));
    });
  });

  context('3 arguments', () => {
    it('all true', () => {
      expect(dispatch('and', [buildLiteralFromJs(true), buildLiteralFromJs(true), buildLiteralFromJs(true)])).to.deep.eq(buildLiteralFromJs(true));
    });

    it('last one false', () => {
      expect(dispatch('and', [buildLiteralFromJs(true), buildLiteralFromJs(true), buildLiteralFromJs(false)])).to.deep.eq(buildLiteralFromJs(false));
    });

    it('all false', () => {
      expect(dispatch('and', [buildLiteralFromJs(false), buildLiteralFromJs(false), buildLiteralFromJs(false)])).to.deep.eq(buildLiteralFromJs(false));
    });
  });
});

describe('blankvalue', () => {
  describe('isblank', () => {
    context('null/undefined', () => {
      it('returns fallback value if value is null', () => {
        expect(dispatch('blankvalue', [buildLiteralFromJs(null), buildLiteralFromJs('Backup')])).to.deep.eq(buildLiteralFromJs('Backup'));
      });

      it('returns fallback value if value is null', () => {
        expect(dispatch('blankvalue', [buildLiteralFromJs(undefined), buildLiteralFromJs('Backup')])).to.deep.eq(buildLiteralFromJs('Backup'));
      });
    });

    context('Text', () => {
      it('returns fallback value if value is an empty string', () => {
        expect(dispatch('blankvalue', [buildLiteralFromJs(''), buildLiteralFromJs('Backup')])).to.deep.eq(buildLiteralFromJs('Backup'));
      });

      it('returns value if value is space', () => {
        expect(dispatch('blankvalue', [buildLiteralFromJs(' '), buildLiteralFromJs('Backup')])).to.deep.eq(buildLiteralFromJs(' '));
      });
    });

    context('Number', () => {
      it('returns value if value is 0', () => {
        expect(dispatch('blankvalue', [buildLiteralFromJs(0), buildLiteralFromJs(-1)])).to.deep.eq(buildLiteralFromJs(0));
      });

      it('returns fallback value if value is null', () => {
        expect(dispatch('blankvalue', [buildLiteralFromJs(null), buildLiteralFromJs(-1)])).to.deep.eq(buildLiteralFromJs(-1));
      });
    });

    context('Date', () => {
      it('returns value if value is filled', () => {
        expect(dispatch('blankvalue', [buildDateLiteral(2020, 2, 11), buildDateLiteral(1970, 1, 1)])).to.deep.eq(buildDateLiteral(2020, 2, 11));
      });

      it('returns fallback value if value is null', () => {
        expect(dispatch('blankvalue', [buildLiteralFromJs(null), buildDateLiteral(1970, 1, 1)])).to.deep.eq(buildDateLiteral(1970, 1, 1));
      });
    });

    context('Datetime', () => {
      const value = buildDatetimeLiteral(Date.UTC(2020, 1, 11, 17, 39, 0, 973));
      const fallback = buildDatetimeLiteral(Date.UTC(1970, 1, 1, 1, 0, 0, 0));

      it('returns value if value is filled', () => {
        expect(dispatch('blankvalue', [value, fallback])).to.deep.eq(value);
      });

      it('returns fallback value if value is null', () => {
        expect(dispatch('blankvalue', [buildLiteralFromJs(null), fallback])).to.deep.eq(fallback);
      });
    });

    context('Geolocation', () => {
      const value = buildGeolocationLiteral(51.5105474, -0.1358797);
      const fallback = buildGeolocationLiteral(0, 0);

      it('returns value if value is filled', () => {
        expect(dispatch('blankvalue', [value, fallback])).to.deep.eq(value);
      });

      it('returns fallback value if value is null', () => {
        expect(dispatch('blankvalue', [buildLiteralFromJs(null), fallback])).to.deep.eq(fallback);
      });
    });

    context('Mixed Data Types', () => {
      it('raises error for mixed types', () => {
        expect(dispatch('blankvalue', [buildLiteralFromJs('1'), buildLiteralFromJs(0)])).to.deep.eq(buildErrorLiteral('ArgumentError', "Incorrect parameter type for function 'BLANKVALUE()'. Expected Text, received Number", { function: 'blankvalue', expected: 'text', received: 'number' }));
      });
    });
  });
});

describe('case', () => {
  context('Number', () => {
    const validFn = (input) => dispatch('case', [
      buildLiteralFromJs(input),
      buildLiteralFromJs(1), buildLiteralFromJs('January'),
      buildLiteralFromJs(2), buildLiteralFromJs('February'),
      buildLiteralFromJs(3), buildLiteralFromJs('March'),
      buildLiteralFromJs(4), buildLiteralFromJs('April'),
      buildLiteralFromJs(5), buildLiteralFromJs('May'),
      buildLiteralFromJs(6), buildLiteralFromJs('June'),
      buildLiteralFromJs(7), buildLiteralFromJs('July'),
      buildLiteralFromJs(8), buildLiteralFromJs('August'),
      buildLiteralFromJs(9), buildLiteralFromJs('September'),
      buildLiteralFromJs(10), buildLiteralFromJs('October'),
      buildLiteralFromJs(11), buildLiteralFromJs('November'),
      buildLiteralFromJs(12), buildLiteralFromJs('December'),
      buildLiteralFromJs('None'),
    ]);

    it('value found', () => {
      expect(validFn(5)).to.deep.eq(buildLiteralFromJs('May'));
    });

    it('value not found', () => {
      expect(validFn(13)).to.deep.eq(buildLiteralFromJs('None'));
    });
  });

  context('Text', () => {
    const validFn = (input) => dispatch('case', [
      buildLiteralFromJs(input),
      buildLiteralFromJs('Jan'), buildLiteralFromJs('January'),
      buildLiteralFromJs('Feb'), buildLiteralFromJs('February'),
      buildLiteralFromJs('Mar'), buildLiteralFromJs('March'),
      buildLiteralFromJs('Apr'), buildLiteralFromJs('April'),
      buildLiteralFromJs('May'), buildLiteralFromJs('May'),
      buildLiteralFromJs('Jun'), buildLiteralFromJs('June'),
      buildLiteralFromJs('Jul'), buildLiteralFromJs('July'),
      buildLiteralFromJs('Aug'), buildLiteralFromJs('August'),
      buildLiteralFromJs('Sep'), buildLiteralFromJs('September'),
      buildLiteralFromJs('Oct'), buildLiteralFromJs('October'),
      buildLiteralFromJs('Nov'), buildLiteralFromJs('November'),
      buildLiteralFromJs('Dec'), buildLiteralFromJs('December'),
      buildLiteralFromJs('None'),
    ]);

    it('value found', () => {
      expect(validFn('Jan')).to.deep.eq(buildLiteralFromJs('January'));
    });

    it('value not found', () => {
      expect(validFn('Mon')).to.deep.eq(buildLiteralFromJs('None'));
    });
  });

  context('Picklist', () => {
    const picklistActive = buildPicklistLiteral('Active', ['Active', 'Inactive']);
    const picklistInBox = buildPicklistLiteral('In a Box', ['Active', 'Inactive', 'In a Box']);

    const fn = (input) => dispatch('case', [
      input,
      buildLiteralFromJs('Active'), buildLiteralFromJs('Alive'),
      buildLiteralFromJs('Inactive'), buildLiteralFromJs('Dead'),
      buildLiteralFromJs('Schrödinger'),
    ]);

    it('value found', () => {
      expect(fn(picklistActive)).to.deep.eq(buildLiteralFromJs('Alive'));
    });

    it('value not found', () => {
      expect(fn(picklistInBox)).to.deep.eq(buildLiteralFromJs('Schrödinger'));
    });
  });

  context('invalid inputs', () => {
    context('incorrect numbe of arguments', () => {
      // too little arguments
      const invalidFn1 = (input) => dispatch('case', [buildLiteralFromJs(input), buildLiteralFromJs(1)]);

      // No else value
      const invalidFn2 = (input) => dispatch('case', [
        buildLiteralFromJs(input),
        buildLiteralFromJs(1), buildLiteralFromJs('January'),
        buildLiteralFromJs(2), buildLiteralFromJs('February'),
        buildLiteralFromJs(3), buildLiteralFromJs('March'),
        buildLiteralFromJs(4), buildLiteralFromJs('April'),
        buildLiteralFromJs(5), buildLiteralFromJs('May'),
        buildLiteralFromJs(6), buildLiteralFromJs('June'),
        buildLiteralFromJs(7), buildLiteralFromJs('July'),
        buildLiteralFromJs(8), buildLiteralFromJs('August'),
        buildLiteralFromJs(9), buildLiteralFromJs('September'),
        buildLiteralFromJs(10), buildLiteralFromJs('October'),
        buildLiteralFromJs(11), buildLiteralFromJs('November'),
        buildLiteralFromJs(12), buildLiteralFromJs('December'),
      ]);

      it('returns erroor for too few arguments', () => {
        expect(invalidFn1(5)).to.deep.eq(buildErrorLiteral('ArgumentError', "Incorrect number of parameters for function 'CASE()'. Expected 4, received 2", { function: 'case', expected: 4, received: 2 }));
      });

      it('returns error for no else case', () => {
        expect(invalidFn2(5)).to.deep.eq(buildErrorLiteral('ArgumentError', "Incorrect number of parameters for function 'CASE()'. Expected 24, received 25", { function: 'case', expected: 24, received: 25 }));
      });
    });

    context('Mixed Types', () => {
      const invalidFn = (input) => dispatch('case', [
        buildLiteralFromJs(input),
        buildLiteralFromJs(1), buildLiteralFromJs('January'),
        buildLiteralFromJs('2'), buildLiteralFromJs('February'),
        buildLiteralFromJs('None'),
      ]);

      it('returns error for mixed returns', () => {
        expect(invalidFn(1)).to.deep.eq(buildErrorLiteral('ArgumentError', "Incorrect parameter type for function 'CASE()'. Expected Number, received Text", { function: 'case', expected: 'number', received: 'text' }));
      });
    });
  });
});

describe('if', () => {
  it('true', () => {
    expect(dispatch('if', [buildLiteralFromJs(true), buildLiteralFromJs('first'), buildLiteralFromJs('second')])).to.deep.eq(buildLiteralFromJs('first'));
  });
  it('false', () => {
    expect(dispatch('if', [buildLiteralFromJs(false), buildLiteralFromJs('first'), buildLiteralFromJs('second')])).to.deep.eq(buildLiteralFromJs('second'));
  });
});

describe('isblank', () => {
  context('null/undefined', () => {
    it('returns true if value is null', () => {
      expect(dispatch('isblank', [buildLiteralFromJs(null)])).to.deep.eq(buildLiteralFromJs(true));
    });

    it('returns false if value is undefined', () => {
      expect(dispatch('isblank', [buildLiteralFromJs(undefined)])).to.deep.eq(buildLiteralFromJs(true));
    });
  });

  context('Text', () => {
    it('returns true if value is an empty string', () => {
      expect(dispatch('isblank', [buildLiteralFromJs('')])).to.deep.eq(buildLiteralFromJs(true));
    });

    it('returns false if value is space', () => {
      expect(dispatch('isblank', [buildLiteralFromJs(' ')])).to.deep.eq(buildLiteralFromJs(false));
    });
  });

  context('Number', () => {
    it('returns false if value is 0', () => {
      expect(dispatch('isblank', [buildLiteralFromJs(0)])).to.deep.eq(buildLiteralFromJs(false));
    });
  });

  context('Date', () => {
    it('returns false if value is filled', () => {
      expect(dispatch('isblank', [buildDateLiteral(2020, 2, 11)])).to.deep.eq(buildLiteralFromJs(false));
    });
  });

  context('Datetime', () => {
    it('returns false if value is filled', () => {
      expect(dispatch('isblank', [buildDatetimeLiteral(Date.UTC(2020, 1, 11, 17, 39, 0, 973))])).to.deep.eq(buildLiteralFromJs(false));
    });
  });

  context('Geolocation', () => {
    it('returns false if value is filled', () => {
      expect(dispatch('isblank', [buildGeolocationLiteral(51.5105474, -0.1358797)])).to.deep.eq(buildLiteralFromJs(false));
    });
  });
});

describe.skip('isnull', () => {
  it('returns correct isnull', () => {
    // TODO implement test for sf$isnull
    expect(dispatch('isnull', [null])).to.deep.eq(null);
  });
});

describe.skip('isnumber', () => {
  it('returns correct isnumber', () => {
    // TODO implement test for sf$isnumber
    expect(dispatch('isnumber', [null])).to.deep.eq(null);
  });
});

describe('not', () => {
  it('true', () => {
    expect(dispatch('not', [buildLiteralFromJs(true)])).to.deep.eq(buildLiteralFromJs(false));
  });

  it('false', () => {
    expect(dispatch('not', [buildLiteralFromJs(false)])).to.deep.eq(buildLiteralFromJs(true));
  });
});

describe('or', () => {
  context('1 argument', () => {
    it('true', () => {
      expect(dispatch('or', [buildLiteralFromJs(true)])).to.deep.eq(buildLiteralFromJs(true));
    });

    it('false', () => {
      expect(dispatch('or', [buildLiteralFromJs(false)])).to.deep.eq(buildLiteralFromJs(false));
    });
  });

  context('2 arguments', () => {
    it('both true', () => {
      expect(dispatch('or', [buildLiteralFromJs(true), buildLiteralFromJs(true)])).to.deep.eq(buildLiteralFromJs(true));
    });

    it('false and true', () => {
      expect(dispatch('or', [buildLiteralFromJs(false), buildLiteralFromJs(true)])).to.deep.eq(buildLiteralFromJs(true));
    });

    it('true and false', () => {
      expect(dispatch('or', [buildLiteralFromJs(true), buildLiteralFromJs(false)])).to.deep.eq(buildLiteralFromJs(true));
    });

    it('both false', () => {
      expect(dispatch('or', [buildLiteralFromJs(false), buildLiteralFromJs(false)])).to.deep.eq(buildLiteralFromJs(false));
    });
  });

  context('3 arguments', () => {
    it('all true', () => {
      expect(dispatch('or', [buildLiteralFromJs(true), buildLiteralFromJs(true), buildLiteralFromJs(true)])).to.deep.eq(buildLiteralFromJs(true));
    });

    it('last one true', () => {
      expect(dispatch('or', [buildLiteralFromJs(false), buildLiteralFromJs(false), buildLiteralFromJs(true)])).to.deep.eq(buildLiteralFromJs(true));
    });

    it('all false', () => {
      expect(dispatch('or', [buildLiteralFromJs(false), buildLiteralFromJs(false), buildLiteralFromJs(false)])).to.deep.eq(buildLiteralFromJs(false));
    });
  });
});

describe.skip('nullvalue', () => {
  it('returns correct nullvalue', () => {
    // TODO implement test for sf$nullvalue
    expect(dispatch('nullvalue', [null, null])).to.deep.eq(null);
  });
});

describe('equal', () => {
  context('Number', () => {
    it('equal', () => {
      expect(dispatch('equal', [buildLiteralFromJs(1), buildLiteralFromJs(1)])).to.deep.eq(buildLiteralFromJs(true));
    });

    it('unequal', () => {
      expect(dispatch('equal', [buildLiteralFromJs(1), buildLiteralFromJs(0)])).to.deep.eq(buildLiteralFromJs(false));
    });
  });

  context('Text', () => {
    it('equal', () => {
      expect(dispatch('equal', [buildLiteralFromJs('Eins'), buildLiteralFromJs('Eins')])).to.deep.eq(buildLiteralFromJs(true));
    });

    it('unequal', () => {
      expect(dispatch('equal', [buildLiteralFromJs('Zwei'), buildLiteralFromJs('Drei')])).to.deep.eq(buildLiteralFromJs(false));
    });
  });

  context('Checkbox', () => {
    it('equal', () => {
      expect(dispatch('equal', [buildLiteralFromJs(false), buildLiteralFromJs(false)])).to.deep.eq(buildLiteralFromJs(true));
    });

    it('unequal', () => {
      expect(dispatch('equal', [buildLiteralFromJs(false), buildLiteralFromJs(true)])).to.deep.eq(buildLiteralFromJs(false));
    });
  });

  context('Date', () => {
    it('equal', () => {
      expect(dispatch('equal', [buildDateLiteral(2020, 2, 11), buildDateLiteral(2020, 2, 11)])).to.deep.eq(buildLiteralFromJs(true));
    });

    it('unequal', () => {
      expect(dispatch('equal', [buildDateLiteral(2020, 2, 11), buildDateLiteral(2020, 2, 12)])).to.deep.eq(buildLiteralFromJs(false));
    });
  });

  context('Datetime', () => {
    it('equal', () => {
      expect(dispatch('equal', [buildDatetimeLiteral(Date.UTC(2020, 1, 28, 17, 39, 0, 973)), buildDatetimeLiteral(Date.UTC(2020, 1, 28, 17, 39, 0, 973))])).to.deep.eq(buildLiteralFromJs(true));
    });

    it('unequal', () => {
      expect(dispatch('equal', [buildDatetimeLiteral(Date.UTC(2020, 1, 28, 17, 39, 0, 973)), buildDatetimeLiteral(Date.UTC(2020, 1, 28, 17, 39, 0, 974))])).to.deep.eq(buildLiteralFromJs(false));
    });
  });

  context('different types', () => {
    it('returns an ArgumentError', () => {
      expect(dispatch('equal', [buildLiteralFromJs(1), buildLiteralFromJs('1')])).to.deep.eq(buildErrorLiteral('ArgumentError', "Incorrect parameter type for function 'EQUAL()'. Expected Number, received Text", { function: 'equal', expected: 'number', received: 'text' }));
    });
  });
});

describe('unequal', () => {
  context('Number', () => {
    it('equal', () => {
      expect(dispatch('unequal', [buildLiteralFromJs(1), buildLiteralFromJs(1)])).to.deep.eq(buildLiteralFromJs(false));
    });

    it('unequal', () => {
      expect(dispatch('unequal', [buildLiteralFromJs(1), buildLiteralFromJs(0)])).to.deep.eq(buildLiteralFromJs(true));
    });
  });

  context('Text', () => {
    it('equal', () => {
      expect(dispatch('unequal', [buildLiteralFromJs('Eins'), buildLiteralFromJs('Eins')])).to.deep.eq(buildLiteralFromJs(false));
    });

    it('unequal', () => {
      expect(dispatch('unequal', [buildLiteralFromJs('Zwei'), buildLiteralFromJs('Drei')])).to.deep.eq(buildLiteralFromJs(true));
    });
  });

  context('Checkbox', () => {
    it('equal', () => {
      expect(dispatch('unequal', [buildLiteralFromJs(false), buildLiteralFromJs(false)])).to.deep.eq(buildLiteralFromJs(false));
    });

    it('unequal', () => {
      expect(dispatch('unequal', [buildLiteralFromJs(false), buildLiteralFromJs(true)])).to.deep.eq(buildLiteralFromJs(true));
    });
  });

  context('Date', () => {
    it('equal', () => {
      expect(dispatch('unequal', [buildDateLiteral(2020, 2, 11), buildDateLiteral(2020, 2, 11)])).to.deep.eq(buildLiteralFromJs(false));
    });

    it('unequal', () => {
      expect(dispatch('unequal', [buildDateLiteral(2020, 2, 11), buildDateLiteral(2020, 2, 12)])).to.deep.eq(buildLiteralFromJs(true));
    });
  });

  context('Datetime', () => {
    it('equal', () => {
      expect(dispatch('unequal', [buildDatetimeLiteral(Date.UTC(2020, 1, 28, 17, 39, 0, 973)), buildDatetimeLiteral(Date.UTC(2020, 1, 28, 17, 39, 0, 973))])).to.deep.eq(buildLiteralFromJs(false));
    });

    it('unequal', () => {
      expect(dispatch('unequal', [buildDatetimeLiteral(Date.UTC(2020, 1, 28, 17, 39, 0, 973)), buildDatetimeLiteral(Date.UTC(2020, 1, 28, 17, 39, 0, 974))])).to.deep.eq(buildLiteralFromJs(true));
    });
  });

  context('different types', () => {
    it('returns an ArgumentError', () => {
      expect(dispatch('unequal', [buildLiteralFromJs(1), buildLiteralFromJs('1')])).to.deep.eq(buildErrorLiteral('ArgumentError', "Incorrect parameter type for function 'UNEQUAL()'. Expected Number, received Text", { function: 'unequal', expected: 'number', received: 'text' }));
    });
  });
});

describe('greaterThan', () => {
  context('Number', () => {
    it('greater than', () => {
      expect(dispatch('greaterThan', [buildLiteralFromJs(1), buildLiteralFromJs(0)])).to.deep.eq(buildLiteralFromJs(true));
    });

    it('smaller than', () => {
      expect(dispatch('greaterThan', [buildLiteralFromJs(0), buildLiteralFromJs(1)])).to.deep.eq(buildLiteralFromJs(false));
    });

    it('equal', () => {
      expect(dispatch('greaterThan', [buildLiteralFromJs(1), buildLiteralFromJs(1)])).to.deep.eq(buildLiteralFromJs(false));
    });
  });

  context('Date', () => {
    it('greater than', () => {
      expect(dispatch('greaterThan', [buildDateLiteral(2020, 2, 11), buildDateLiteral(2020, 2, 10)])).to.deep.eq(buildLiteralFromJs(true));
    });

    it('smaller than', () => {
      expect(dispatch('greaterThan', [buildDateLiteral(2020, 2, 10), buildDateLiteral(2020, 2, 11)])).to.deep.eq(buildLiteralFromJs(false));
    });

    it('equal', () => {
      expect(dispatch('greaterThan', [buildDateLiteral(2020, 2, 11), buildDateLiteral(2020, 2, 11)])).to.deep.eq(buildLiteralFromJs(false));
    });
  });

  context('Datetime', () => {
    it('greater than', () => {
      expect(dispatch('greaterThan', [buildDatetimeLiteral(Date.UTC(2020, 1, 28, 17, 39, 0, 973)), buildDatetimeLiteral(Date.UTC(2020, 1, 28, 17, 39, 0, 972))])).to.deep.eq(buildLiteralFromJs(true));
    });

    it('smaller than', () => {
      expect(dispatch('greaterThan', [buildDatetimeLiteral(Date.UTC(2020, 1, 28, 17, 39, 0, 972)), buildDatetimeLiteral(Date.UTC(2020, 1, 28, 17, 39, 0, 973))])).to.deep.eq(buildLiteralFromJs(false));
    });

    it('equal', () => {
      expect(dispatch('greaterThan', [buildDatetimeLiteral(Date.UTC(2020, 1, 28, 17, 39, 0, 973)), buildDatetimeLiteral(Date.UTC(2020, 1, 28, 17, 39, 0, 973))])).to.deep.eq(buildLiteralFromJs(false));
    });
  });

  context('different types', () => {
    it('returns an ArgumentError', () => {
      expect(dispatch('greaterThan', [buildDateLiteral(2020, 2, 10), buildLiteralFromJs(1)])).to.deep.eq(buildErrorLiteral('ArgumentError', "Incorrect parameter type for function 'GREATERTHAN()'. Expected Date, received Number", { function: 'greaterThan', expected: 'date', received: 'number' }));
    });
  });
});

describe('greaterThanOrEqual', () => {
  context('Number', () => {
    it('greater than', () => {
      expect(dispatch('greaterThanOrEqual', [buildLiteralFromJs(1), buildLiteralFromJs(0)])).to.deep.eq(buildLiteralFromJs(true));
    });

    it('smaller than', () => {
      expect(dispatch('greaterThanOrEqual', [buildLiteralFromJs(0), buildLiteralFromJs(1)])).to.deep.eq(buildLiteralFromJs(false));
    });

    it('equal', () => {
      expect(dispatch('greaterThanOrEqual', [buildLiteralFromJs(1), buildLiteralFromJs(1)])).to.deep.eq(buildLiteralFromJs(true));
    });
  });

  context('Date', () => {
    it('greater than', () => {
      expect(dispatch('greaterThanOrEqual', [buildDateLiteral(2020, 2, 11), buildDateLiteral(2020, 2, 10)])).to.deep.eq(buildLiteralFromJs(true));
    });

    it('smaller than', () => {
      expect(dispatch('greaterThanOrEqual', [buildDateLiteral(2020, 2, 10), buildDateLiteral(2020, 2, 11)])).to.deep.eq(buildLiteralFromJs(false));
    });

    it('equal', () => {
      expect(dispatch('greaterThanOrEqual', [buildDateLiteral(2020, 2, 11), buildDateLiteral(2020, 2, 11)])).to.deep.eq(buildLiteralFromJs(true));
    });
  });

  context('Datetime', () => {
    it('greater than', () => {
      expect(dispatch('greaterThanOrEqual', [buildDatetimeLiteral(Date.UTC(2020, 1, 28, 17, 39, 0, 973)), buildDatetimeLiteral(Date.UTC(2020, 1, 28, 17, 39, 0, 972))])).to.deep.eq(buildLiteralFromJs(true));
    });

    it('smaller than', () => {
      expect(dispatch('greaterThanOrEqual', [buildDatetimeLiteral(Date.UTC(2020, 1, 28, 17, 39, 0, 972)), buildDatetimeLiteral(Date.UTC(2020, 1, 28, 17, 39, 0, 973))])).to.deep.eq(buildLiteralFromJs(false));
    });

    it('equal', () => {
      expect(dispatch('greaterThanOrEqual', [buildDatetimeLiteral(Date.UTC(2020, 1, 28, 17, 39, 0, 973)), buildDatetimeLiteral(Date.UTC(2020, 1, 28, 17, 39, 0, 973))])).to.deep.eq(buildLiteralFromJs(true));
    });
  });

  context('different types', () => {
    it('returns an ArgumentError', () => {
      expect(dispatch('greaterThan', [buildDateLiteral(2020, 2, 10), buildLiteralFromJs(1)])).to.deep.eq(buildErrorLiteral('ArgumentError', "Incorrect parameter type for function 'GREATERTHAN()'. Expected Date, received Number", { function: 'greaterThan', expected: 'date', received: 'number' }));
    });
  });
});

describe('lessThan', () => {
  context('Number', () => {
    it('greater than', () => {
      expect(dispatch('lessThan', [buildLiteralFromJs(1), buildLiteralFromJs(0)])).to.deep.eq(buildLiteralFromJs(false));
    });

    it('smaller than', () => {
      expect(dispatch('lessThan', [buildLiteralFromJs(0), buildLiteralFromJs(1)])).to.deep.eq(buildLiteralFromJs(true));
    });

    it('equal', () => {
      expect(dispatch('lessThan', [buildLiteralFromJs(1), buildLiteralFromJs(1)])).to.deep.eq(buildLiteralFromJs(false));
    });
  });

  context('Date', () => {
    it('greater than', () => {
      expect(dispatch('lessThan', [buildDateLiteral(2020, 2, 11), buildDateLiteral(2020, 2, 10)])).to.deep.eq(buildLiteralFromJs(false));
    });

    it('smaller than', () => {
      expect(dispatch('lessThan', [buildDateLiteral(2020, 2, 10), buildDateLiteral(2020, 2, 11)])).to.deep.eq(buildLiteralFromJs(true));
    });

    it('equal', () => {
      expect(dispatch('lessThan', [buildDateLiteral(2020, 2, 11), buildDateLiteral(2020, 2, 11)])).to.deep.eq(buildLiteralFromJs(false));
    });
  });

  context('Datetime', () => {
    it('greater than', () => {
      expect(dispatch('lessThan', [buildDatetimeLiteral(Date.UTC(2020, 1, 28, 17, 39, 0, 973)), buildDatetimeLiteral(Date.UTC(2020, 1, 28, 17, 39, 0, 972))])).to.deep.eq(buildLiteralFromJs(false));
    });

    it('smaller than', () => {
      expect(dispatch('lessThan', [buildDatetimeLiteral(Date.UTC(2020, 1, 28, 17, 39, 0, 972)), buildDatetimeLiteral(Date.UTC(2020, 1, 28, 17, 39, 0, 973))])).to.deep.eq(buildLiteralFromJs(true));
    });

    it('equal', () => {
      expect(dispatch('lessThan', [buildDatetimeLiteral(Date.UTC(2020, 1, 28, 17, 39, 0, 973)), buildDatetimeLiteral(Date.UTC(2020, 1, 28, 17, 39, 0, 973))])).to.deep.eq(buildLiteralFromJs(false));
    });
  });

  context('different types', () => {
    it('returns an ArgumentError', () => {
      expect(dispatch('lessThan', [buildDateLiteral(2020, 2, 10), buildLiteralFromJs(1)])).to.deep.eq(buildErrorLiteral('ArgumentError', "Incorrect parameter type for function 'LESSTHAN()'. Expected Date, received Number", { function: 'lessThan', expected: 'date', received: 'number' }));
    });
  });
});

describe('lessThanOrEqual', () => {
  context('Number', () => {
    it('greater than', () => {
      expect(dispatch('lessThanOrEqual', [buildLiteralFromJs(1), buildLiteralFromJs(0)])).to.deep.eq(buildLiteralFromJs(false));
    });

    it('smaller than', () => {
      expect(dispatch('lessThanOrEqual', [buildLiteralFromJs(0), buildLiteralFromJs(1)])).to.deep.eq(buildLiteralFromJs(true));
    });

    it('equal', () => {
      expect(dispatch('lessThanOrEqual', [buildLiteralFromJs(1), buildLiteralFromJs(1)])).to.deep.eq(buildLiteralFromJs(true));
    });
  });

  context('Date', () => {
    it('greater than', () => {
      expect(dispatch('lessThanOrEqual', [buildDateLiteral(2020, 2, 11), buildDateLiteral(2020, 2, 10)])).to.deep.eq(buildLiteralFromJs(false));
    });

    it('smaller than', () => {
      expect(dispatch('lessThanOrEqual', [buildDateLiteral(2020, 2, 10), buildDateLiteral(2020, 2, 11)])).to.deep.eq(buildLiteralFromJs(true));
    });

    it('equal', () => {
      expect(dispatch('lessThanOrEqual', [buildDateLiteral(2020, 2, 11), buildDateLiteral(2020, 2, 11)])).to.deep.eq(buildLiteralFromJs(true));
    });
  });

  context('Datetime', () => {
    it('greater than', () => {
      expect(dispatch('lessThanOrEqual', [buildDatetimeLiteral(Date.UTC(2020, 1, 28, 17, 39, 0, 973)), buildDatetimeLiteral(Date.UTC(2020, 1, 28, 17, 39, 0, 972))])).to.deep.eq(buildLiteralFromJs(false));
    });

    it('smaller than', () => {
      expect(dispatch('lessThanOrEqual', [buildDatetimeLiteral(Date.UTC(2020, 1, 28, 17, 39, 0, 972)), buildDatetimeLiteral(Date.UTC(2020, 1, 28, 17, 39, 0, 973))])).to.deep.eq(buildLiteralFromJs(true));
    });

    it('equal', () => {
      expect(dispatch('lessThanOrEqual', [buildDatetimeLiteral(Date.UTC(2020, 1, 28, 17, 39, 0, 973)), buildDatetimeLiteral(Date.UTC(2020, 1, 28, 17, 39, 0, 973))])).to.deep.eq(buildLiteralFromJs(true));
    });
  });

  context('different types', () => {
    it('returns an ArgumentError', () => {
      expect(dispatch('lessThanOrEqual', [buildDateLiteral(2020, 2, 10), buildLiteralFromJs(1)])).to.deep.eq(buildErrorLiteral('ArgumentError', "Incorrect parameter type for function 'LESSTHANOREQUAL()'. Expected Date, received Number", { function: 'lessThanOrEqual', expected: 'date', received: 'number' }));
    });
  });
});

// Math Operators

describe('add', () => {
  context('Number, Number', () => {
    it('adds correctly', () => {
      expect(dispatch('add', [buildLiteralFromJs(1), buildLiteralFromJs(2)])).to.deep.eq(buildLiteralFromJs(3));
    });
  });

  context('Text, Text', () => {
    it('concats correctly', () => {
      expect(dispatch('add', [buildLiteralFromJs('Black'), buildLiteralFromJs('Jack')])).to.deep.eq(buildLiteralFromJs('BlackJack'));
    });
  });

  context('Date, Number', () => {
    it('adds number of days', () => {
      expect(dispatch('add', [buildDateLiteral(2020, 2, 11), buildLiteralFromJs(5)])).to.deep.eq(buildDateLiteral(2020, 2, 16));
    });
  });

  context('Number, Date', () => {
    it('adds number of days', () => {
      expect(dispatch('add', [buildLiteralFromJs(5), buildDateLiteral(2020, 2, 11)])).to.deep.eq(buildDateLiteral(2020, 2, 16));
    });
  });

  context('Time, Number', () => {
    it('adds number of milliseconds', () => {
      expect(dispatch('add', [buildTimeLiteral(45000000), buildLiteralFromJs(5000)])).to.deep.eq(buildTimeLiteral(45005000));
    });
  });

  context('Number, Time', () => {
    it('adds number of milliseconds', () => {
      expect(dispatch('add', [buildLiteralFromJs(5000), buildTimeLiteral(45000000)])).to.deep.eq(buildTimeLiteral(45005000));
    });
  });

  context('Datetime, Number', () => {
    it('adds number of days', () => {
      expect(dispatch('add', [buildDatetimeLiteral(Date.UTC(2020, 1, 28, 17, 39, 0, 973)), buildLiteralFromJs(5)])).to.deep.eq(buildDatetimeLiteral(Date.UTC(2020, 2, 4, 17, 39, 0, 973)));
    });
  });

  context('Number, Datetime', () => {
    it('adds number of days', () => {
      expect(dispatch('add', [buildLiteralFromJs(5), buildDatetimeLiteral(Date.UTC(2020, 1, 28, 17, 39, 0, 973))])).to.deep.eq(buildDatetimeLiteral(Date.UTC(2020, 2, 4, 17, 39, 0, 973)));
    });
  });

  context('Date, Date', () => {
    it('returns ArgumentError', () => {
      expect(dispatch('add', [buildDateLiteral(2020, 2, 11), buildDateLiteral(2020, 2, 11)])).to.deep.eq(buildErrorLiteral('ArgumentError', "Incorrect parameter type for function 'ADD()'. Expected Number, received Date", { function: 'add', expected: 'number', received: 'date' }));
    });
  });
});

describe('concat operator', () => {
  context('Text, Text', () => {
    it('concats correctly', () => {
      expect(dispatch('add', [buildLiteralFromJs('Black'), buildLiteralFromJs('Jack')])).to.deep.eq(buildLiteralFromJs('BlackJack'));
    });
  });
});

describe('multiply', () => {
  it('multiplies correctly', () => {
    expect(dispatch('multiply', [buildLiteralFromJs(7), buildLiteralFromJs(8)])).to.deep.eq(buildLiteralFromJs(56));
  });
});

describe('exponentiate', () => {
  it('exponentiates correctly', () => {
    expect(dispatch('exponentiate', [buildLiteralFromJs(2), buildLiteralFromJs(5)])).to.deep.eq(buildLiteralFromJs(32));
  });
});

// Math Functions

describe('abs', () => {
  it('positive value', () => {
    expect(dispatch('abs', [buildLiteralFromJs(10)])).to.deep.eq(buildLiteralFromJs(10));
  });

  it('negative value', () => {
    expect(dispatch('abs', [buildLiteralFromJs(-20)])).to.deep.eq(buildLiteralFromJs(20));
  });
});

describe('ceiling', () => {
  it('fix value', () => {
    expect(dispatch('ceiling', [buildLiteralFromJs(10)])).to.deep.eq(buildLiteralFromJs(10));
  });

  it('positive low value', () => {
    expect(dispatch('ceiling', [buildLiteralFromJs(0.1)])).to.deep.eq(buildLiteralFromJs(1));
  });

  it('positive high value', () => {
    expect(dispatch('ceiling', [buildLiteralFromJs(999.9)])).to.deep.eq(buildLiteralFromJs(1000));
  });

  it('negative value', () => {
    expect(dispatch('ceiling', [buildLiteralFromJs(-2.5)])).to.deep.eq(buildLiteralFromJs(-3));
  });

  it('negative low value', () => {
    expect(dispatch('ceiling', [buildLiteralFromJs(-0.1)])).to.deep.eq(buildLiteralFromJs(-1));
  });

  it('negative high value', () => {
    expect(dispatch('ceiling', [buildLiteralFromJs(-999.9)])).to.deep.eq(buildLiteralFromJs(-1000));
  });
});

describe('distance', () => {
  it('returns error for unknown unit', () => {
    const expectedOptions = {
      function: 'distance',
      expected: ['km', 'mi'],
      received: 'ft',
    };
    expect(
      dispatch('distance', [buildGeolocationLiteral(51.5105474, -0.1358797), buildGeolocationLiteral(32.855160, -117.258836), buildLiteralFromJs('ft')]),
    ).to.deep.eq(buildErrorLiteral('ArgumentError', "Incorrect parameter value for function 'DISTANCE()'. Expected 'mi'/'km', received 'ft'", expectedOptions));
  });

  it('returns correct distance for Europe -> US', () => {
    expect(dispatch('distance', [buildGeolocationLiteral(51.5105474, -0.1358797), buildGeolocationLiteral(32.855160, -117.258836), buildLiteralFromJs('km')])).to.deep.eq(buildLiteralFromJs(8813.750642478108));
  });

  it('returns correct distance for longest distance possible', () => {
    expect(dispatch('distance', [buildGeolocationLiteral(0, 0), buildGeolocationLiteral(0, 180), buildLiteralFromJs('km')])).to.deep.eq(buildLiteralFromJs(20015.115070354455));
  });
});

describe('exp', () => {
  it('Integer Literal', () => {
    expect(dispatch('exp', [buildLiteralFromJs(1)])).to.deep.eq(buildLiteralFromJs(2.718281828459045));
  });
});

describe('floor', () => {
  it('fix value', () => {
    expect(dispatch('floor', [buildLiteralFromJs(10)])).to.deep.eq(buildLiteralFromJs(10));
  });

  it('positive low value', () => {
    expect(dispatch('floor', [buildLiteralFromJs(0.1)])).to.deep.eq(buildLiteralFromJs(0));
  });

  it('positive high value', () => {
    expect(dispatch('floor', [buildLiteralFromJs(999.9)])).to.deep.eq(buildLiteralFromJs(999));
  });

  it('negative value', () => {
    expect(dispatch('floor', [buildLiteralFromJs(-2.5)])).to.deep.eq(buildLiteralFromJs(-2));
  });

  it('negative low value', () => {
    expect(dispatch('floor', [buildLiteralFromJs(-0.1)])).to.deep.eq(buildLiteralFromJs(-0));
  });

  it('negative high value', () => {
    expect(dispatch('floor', [buildLiteralFromJs(-999.9)])).to.deep.eq(buildLiteralFromJs(-999));
  });
});

describe('geolocation', () => {
  it('returns correct geolocation', () => {
    expect(dispatch('geolocation', [buildLiteralFromJs(32.855160), buildLiteralFromJs(-117.258836)])).to.deep.eq(buildGeolocationLiteral(32.855160, -117.258836));
  });
});

describe('ln', () => {
  it('Integer Literal', () => {
    expect(dispatch('ln', [buildLiteralFromJs(5)])).to.deep.eq(buildLiteralFromJs(1.6094379124341003));
  });

  it('e', () => {
    expect(dispatch('ln', [buildLiteralFromJs(Math.E)])).to.deep.eq(buildLiteralFromJs(1));
  });
});

describe('log', () => {
  it('Integer Literal', () => {
    expect(dispatch('log', [buildLiteralFromJs(7)])).to.deep.eq(buildLiteralFromJs(0.8450980400142568));
  });

  it('10', () => {
    expect(dispatch('log', [buildLiteralFromJs(10)])).to.deep.eq(buildLiteralFromJs(1));
  });
});

describe('max', () => {
  it('2 elements', () => {
    expect(dispatch('max', [buildLiteralFromJs(1), buildLiteralFromJs(1000)])).to.deep.eq(buildLiteralFromJs(1000));
  });

  it('5 elements', () => {
    expect(
      dispatch('max', [
        buildLiteralFromJs(-7),
        buildLiteralFromJs(2),
        buildLiteralFromJs(-8),
        buildLiteralFromJs(-100),
        buildLiteralFromJs(10),
      ]),
    ).to.deep.eq(buildLiteralFromJs(10));
  });
});

describe('mceiling', () => {
  it('returns correct value for positive numbers', () => {
    expect(dispatch('mceiling', [buildLiteralFromJs(2.5)])).to.deep.eq(buildLiteralFromJs(3));
  });

  it('returns correct value for negative numbers', () => {
    expect(dispatch('mceiling', [buildLiteralFromJs(-2.5)])).to.deep.eq(buildLiteralFromJs(-2));
  });
});

describe('mfloor', () => {
  it('returns correct value for positive numbers', () => {
    expect(dispatch('mfloor', [buildLiteralFromJs(2.5)])).to.deep.eq(buildLiteralFromJs(2));
  });

  it('returns correct value for negative numbers', () => {
    expect(dispatch('mfloor', [buildLiteralFromJs(-2.5)])).to.deep.eq(buildLiteralFromJs(-3));
  });
});

describe('min', () => {
  it('2 elements', () => {
    expect(dispatch('min', [buildLiteralFromJs(1), buildLiteralFromJs(1000)])).to.deep.eq(buildLiteralFromJs(1));
  });

  it('5 elements', () => {
    expect(
      dispatch('min', [
        buildLiteralFromJs(-7),
        buildLiteralFromJs(2),
        buildLiteralFromJs(-8),
        buildLiteralFromJs(-100),
        buildLiteralFromJs(10),
      ]),
    ).to.deep.eq(buildLiteralFromJs(-100));
  });
});

describe('mod', () => {
  it('positive number without remainder', () => {
    expect(dispatch('mod', [buildLiteralFromJs(10), buildLiteralFromJs(2)])).to.deep.eq(buildLiteralFromJs(0));
  });

  it('positive number with remainder', () => {
    expect(dispatch('mod', [buildLiteralFromJs(10), buildLiteralFromJs(3)])).to.deep.eq(buildLiteralFromJs(1));
  });

  it('negative number without remainder', () => {
    expect(dispatch('mod', [buildLiteralFromJs(-15), buildLiteralFromJs(3)])).to.deep.eq(buildLiteralFromJs(-0));
  });

  it('negative number with remainder', () => {
    expect(dispatch('mod', [buildLiteralFromJs(-15), buildLiteralFromJs(6)])).to.deep.eq(buildLiteralFromJs(-3));
  });
});

describe('round', () => {
  it('positive number round up to full number', () => {
    expect(dispatch('round', [buildLiteralFromJs(1.5), buildLiteralFromJs(0)])).to.deep.eq(buildLiteralFromJs(2));
  });

  it('positive number round down to full number', () => {
    expect(dispatch('round', [buildLiteralFromJs(1.2345), buildLiteralFromJs(0)])).to.deep.eq(buildLiteralFromJs(1));
  });

  it('negative number round up to full number', () => {
    expect(dispatch('round', [buildLiteralFromJs(-1.5), buildLiteralFromJs(0)])).to.deep.eq(buildLiteralFromJs(-2));
  });

  it('positive number round up to 2 digits', () => {
    expect(dispatch('round', [buildLiteralFromJs(225.49823), buildLiteralFromJs(2)])).to.deep.eq(buildLiteralFromJs(225.50));
  });

  it('positive number down to 2 digits', () => {
    expect(dispatch('round', [buildLiteralFromJs(-225.495), buildLiteralFromJs(2)])).to.deep.eq(buildLiteralFromJs(-225.50));
  });
});

describe('sqrt', () => {
  it('square number', () => {
    expect(dispatch('sqrt', [buildLiteralFromJs(121)])).to.deep.eq(buildLiteralFromJs(11));
  });

  it('non square number', () => {
    expect(dispatch('sqrt', [buildLiteralFromJs(2)])).to.deep.eq(buildLiteralFromJs(1.4142135623730951));
  });
});

describe('subtract', () => {
  context('Number, Number', () => {
    it('adds correctly', () => {
      expect(dispatch('subtract', [buildLiteralFromJs(5), buildLiteralFromJs(3)])).to.deep.eq(buildLiteralFromJs(2));
    });
  });

  context('Text, Text', () => {
    it('returns ArgumentError', () => {
      const expected = buildErrorLiteral('ArgumentError', "Incorrect parameter type for function 'SUBTRACT()'. Expected Number, Date, Datetime, Time, received Text", { function: 'subtract', expected: ['number', 'date', 'datetime', 'time'], received: 'text' });
      expect(dispatch('subtract', [buildLiteralFromJs('Black'), buildLiteralFromJs('Jack')])).to.deep.eq(expected);
    });
  });

  context('Date, Number', () => {
    it('subtracts number of days', () => {
      expect(dispatch('subtract', [buildDateLiteral(2020, 2, 11), buildLiteralFromJs(5)])).to.deep.eq(buildDateLiteral(2020, 2, 6));
    });
  });

  context('Number, Date', () => {
    it('returns ArgumentError', () => {
      const expected = buildErrorLiteral('ArgumentError', "Incorrect parameter type for function 'SUBTRACT()'. Expected Number, received Date", { function: 'subtract', expected: 'number', received: 'date' });
      expect(dispatch('subtract', [buildLiteralFromJs(5), buildDateLiteral(2020, 2, 11)])).to.deep.eq(expected);
    });
  });

  context('Time, Number', () => {
    it('subtracts number of milliseconds', () => {
      expect(dispatch('subtract', [buildTimeLiteral(45005000), buildLiteralFromJs(5000)])).to.deep.eq(buildTimeLiteral(45000000));
    });
  });

  context('Number, Time', () => {
    it('returns ArgumentError', () => {
      const expected = buildErrorLiteral('ArgumentError', "Incorrect parameter type for function 'SUBTRACT()'. Expected Number, received Time", { function: 'subtract', expected: 'number', received: 'time' });
      expect(dispatch('subtract', [buildLiteralFromJs(5000), buildTimeLiteral(45000000)])).to.deep.eq(expected);
    });
  });

  context('Datetime, Number', () => {
    it('subtracts number of days', () => {
      expect(dispatch('subtract', [buildDatetimeLiteral(Date.UTC(2020, 2, 4, 17, 39, 0, 973)), buildLiteralFromJs(5)])).to.deep.eq(buildDatetimeLiteral(Date.UTC(2020, 1, 28, 17, 39, 0, 973)));
    });
  });

  context('Number, Datetime', () => {
    it('returns ArgumentError', () => {
      const expected = buildErrorLiteral('ArgumentError', "Incorrect parameter type for function 'SUBTRACT()'. Expected Number, received Datetime", { function: 'subtract', expected: 'number', received: 'datetime' });
      expect(dispatch('subtract', [buildLiteralFromJs(5), buildDatetimeLiteral(Date.UTC(2020, 1, 28, 17, 39, 0, 973))])).to.deep.eq(expected);
    });
  });

  context('Date, Date', () => {
    it('returns difference in days', () => {
      expect(dispatch('subtract', [buildDateLiteral(2020, 2, 16), buildDateLiteral(2020, 2, 11)])).to.deep.eq(buildLiteralFromJs(5));
    });
  });

  context('Time, Time', () => {
    it('returns difference in milliseconds', () => {
      expect(dispatch('subtract', [buildTimeLiteral(45005000), buildTimeLiteral(45000000)])).to.deep.eq(buildLiteralFromJs(5000));
    });
  });

  context('Datetime, DateTime', () => {
    it('returns difference in days', () => {
      const datetime1 = buildDatetimeLiteral(Date.UTC(2020, 2, 1, 17, 39, 0, 973));
      const datetime2 = buildDatetimeLiteral(Date.UTC(2020, 1, 28, 5, 39, 0, 973));
      expect(dispatch('subtract', [datetime1, datetime2])).to.deep.eq(buildLiteralFromJs(2.5));
    });
  });
});

// Text Functions

describe('begins', () => {
  it('begins with', () => {
    expect(dispatch('begins', [buildLiteralFromJs('a string'), buildLiteralFromJs('a')])).to.deep.eq(buildLiteralFromJs(true));
  });

  it('does not begin with', () => {
    expect(dispatch('begins', [buildLiteralFromJs('a string'), buildLiteralFromJs('b')])).to.deep.eq(buildLiteralFromJs(false));
  });
});

describe('br', () => {
  it('returns newline', () => {
    expect(dispatch('br', [])).to.deep.eq(buildLiteralFromJs('\n'));
  });
});

describe('casesafeid', () => {
  it('returns correct id for real example', () => {
    expect(dispatch('casesafeid', [buildLiteralFromJs('0033z00002f6o3T')])).to.deep.eq(buildLiteralFromJs('0033z00002f6o3TAAQ'));
  });

  it('returns correct id for comfan reference', () => {
    expect(dispatch('casesafeid', [buildLiteralFromJs('752S00000000Ktk')])).to.deep.eq(buildLiteralFromJs('752S00000000KtkIAE'));
  });
});

describe('contains', () => {
  it('contains', () => {
    expect(dispatch('contains', [buildLiteralFromJs('a string'), buildLiteralFromJs('string')])).to.deep.eq(buildLiteralFromJs(true));
  });

  it('does not contain', () => {
    expect(dispatch('contains', [buildLiteralFromJs('a string'), buildLiteralFromJs('integer')])).to.deep.eq(buildLiteralFromJs(false));
  });
});

describe('find', () => {
  const textToSearchIn = buildLiteralFromJs('search token in this text');

  it('returns 0 for empty search string', () => {
    expect(dispatch('find', [buildLiteralFromJs(''), textToSearchIn])).to.deep.eq(buildLiteralFromJs(0));
  });

  it('returns 0 if searchText is not found', () => {
    expect(dispatch('find', [buildLiteralFromJs('something different'), textToSearchIn])).to.deep.eq(buildLiteralFromJs(0));
  });

  it('returns 0 if startNum is 0', () => {
    expect(dispatch('find', [buildLiteralFromJs('token'), textToSearchIn, buildLiteralFromJs(0)])).to.deep.eq(buildLiteralFromJs(0));
  });

  it('returns 0 if startNum is negative', () => {
    expect(dispatch('find', [buildLiteralFromJs('token'), textToSearchIn, buildLiteralFromJs(-2)])).to.deep.eq(buildLiteralFromJs(0));
  });

  it('returns correct number for found string', () => {
    expect(dispatch('find', [buildLiteralFromJs('token'), textToSearchIn])).to.deep.eq(buildLiteralFromJs(8));
  });

  it('returns 0 if found string appears after startNum', () => {
    expect(dispatch('find', [buildLiteralFromJs('token'), textToSearchIn, buildLiteralFromJs(9)])).to.deep.eq(buildLiteralFromJs(0));
  });
});

describe('getsessionid', () => {
  it('returns correct getsessionid', () => {
    expect(dispatch('getsessionid', [])).to.deep.eq(buildLiteralFromJs('00D3z000001eRlg!AQMAQC3Y4aM9sFux6SRWhyFcOUKin4taGaBxNMU8TN_R_1R0Y7ArI95eSyzQZVIlrnV_unTbmwHZlXex8xhlXz2kXZNP49Fa'));
  });
});

describe('hyperlink', () => {
  context('no target', () => {
    it('returns correct hyperlink', () => {
      const expected = '<a href="http://www.bbc.co.uk">BBC News</a>';
      expect(dispatch('hyperlink', [buildLiteralFromJs('http://www.bbc.co.uk'), buildLiteralFromJs('BBC News')])).to.deep.eq(buildLiteralFromJs(expected));
    });
  });

  context('target _blank', () => {
    it('returns correct hyperlink', () => {
      const expected = '<a href="http://www.bbc.co.uk" target="_blank">BBC News</a>';
      expect(dispatch('hyperlink', [buildLiteralFromJs('http://www.bbc.co.uk'), buildLiteralFromJs('BBC News'), buildLiteralFromJs('_blank')])).to.deep.eq(buildLiteralFromJs(expected));
    });
  });
});

describe('image', () => {
  context('no dimensions', () => {
    it('returns correct image', () => {
      const expected = '<img src="https://www.gravatar.com/avatar/1d33920589a79039ca137ee6ac7ce6c2" alt="Leif Gravatar"/>';
      expect(dispatch('image', [buildLiteralFromJs('https://www.gravatar.com/avatar/1d33920589a79039ca137ee6ac7ce6c2'), buildLiteralFromJs('Leif Gravatar')])).to.deep.eq(buildLiteralFromJs(expected));
    });
  });

  context('height and width defined', () => {
    it('returns correct image', () => {
      const expected = '<img src="https://www.gravatar.com/avatar/1d33920589a79039ca137ee6ac7ce6c2" alt="Leif Gravatar" height="100" width="200"/>';
      expect(dispatch('image', [
        buildLiteralFromJs('https://www.gravatar.com/avatar/1d33920589a79039ca137ee6ac7ce6c2'),
        buildLiteralFromJs('Leif Gravatar'),
        buildLiteralFromJs(100),
        buildLiteralFromJs(200),
      ])).to.deep.eq(buildLiteralFromJs(expected));
    });
  });
});

describe('includes', () => {
  it('returns correct result for selected value', () => {
    const field = buildMultipicklistLiteral(['Golf', 'Computer'], ['Golf', 'Swimming', 'Horseback Riding', 'Computer']);
    expect(dispatch('includes', [field, buildLiteralFromJs('Golf')])).to.deep.eq(buildLiteralFromJs(true));
  });

  it('returns correct result for non-selected value', () => {
    const field = buildMultipicklistLiteral(['Golf', 'Computer'], ['Golf', 'Swimming', 'Horseback Riding', 'Computer']);
    expect(dispatch('includes', [field, buildLiteralFromJs('Swimming')])).to.deep.eq(buildLiteralFromJs(false));
  });
});

describe('ispickval', () => {
  it('returns correct ispickval', () => {
    const field = buildPicklistLiteral('Active', ['Active', 'Inactive']);
    const text = buildLiteralFromJs('Active');

    expect(dispatch('ispickval', [field, text])).to.deep.eq(buildLiteralFromJs(true));
  });
});

describe('left', () => {
  it('returns correct string', () => {
    expect(dispatch('left', [buildLiteralFromJs('12345'), buildLiteralFromJs(3)])).to.deep.eq(buildLiteralFromJs('123'));
  });

  it('returns correct string for negative input', () => {
    expect(dispatch('left', [buildLiteralFromJs('12345'), buildLiteralFromJs(-1)])).to.deep.eq(buildLiteralFromJs(''));
  });
});

describe('len', () => {
  it('returns correct length', () => {
    expect(dispatch('len', [buildLiteralFromJs('12345')])).to.deep.eq(buildLiteralFromJs(5));
  });
});

describe('lower', () => {
  it('returns correct string', () => {
    expect(dispatch('lower', [buildLiteralFromJs('MYCOMPANY.COM')])).to.deep.eq(buildLiteralFromJs('mycompany.com'));
  });
});

describe('lpad', () => {
  it('no pad string given', () => {
    expect(dispatch('lpad', [buildLiteralFromJs('my_company.com'), buildLiteralFromJs(20)])).to.deep.eq(buildLiteralFromJs('my_company.com'));
  });

  it('string longer than padded length', () => {
    expect(dispatch('lpad', [buildLiteralFromJs('my_company.com'), buildLiteralFromJs(14), buildLiteralFromJs('z')])).to.deep.eq(buildLiteralFromJs('my_company.com'));
  });

  it('padded length longer than string', () => {
    expect(dispatch('lpad', [buildLiteralFromJs('my_company.com'), buildLiteralFromJs(15), buildLiteralFromJs('z')])).to.deep.eq(buildLiteralFromJs('zmy_company.com'));
  });

  it('padded length shorter than string', () => {
    expect(dispatch('lpad', [buildLiteralFromJs('my_company.com'), buildLiteralFromJs(2), buildLiteralFromJs('z')])).to.deep.eq(buildLiteralFromJs('my'));
  });
});

describe('mid', () => {
  it('returns correct string', () => {
    expect(dispatch('mid', [buildLiteralFromJs('12345'), buildLiteralFromJs(2), buildLiteralFromJs(3)])).to.deep.eq(buildLiteralFromJs('234'));
  });
});

describe('right', () => {
  it('returns correct string', () => {
    expect(dispatch('right', [buildLiteralFromJs('12345'), buildLiteralFromJs(3)])).to.deep.eq(buildLiteralFromJs('345'));
  });

  it('returns correct string for negative input', () => {
    expect(dispatch('left', [buildLiteralFromJs('12345'), buildLiteralFromJs(-1)])).to.deep.eq(buildLiteralFromJs(''));
  });
});

describe('rpad', () => {
  it('no pad string given', () => {
    expect(dispatch('rpad', [buildLiteralFromJs('my_company.com'), buildLiteralFromJs(20)])).to.deep.eq(buildLiteralFromJs('my_company.com'));
  });

  it('string longer than padded length', () => {
    expect(dispatch('rpad', [buildLiteralFromJs('my_company.com'), buildLiteralFromJs(14), buildLiteralFromJs('z')])).to.deep.eq(buildLiteralFromJs('my_company.com'));
  });

  it('padded length longer than string', () => {
    expect(dispatch('rpad', [buildLiteralFromJs('my_company.com'), buildLiteralFromJs(15), buildLiteralFromJs('z')])).to.deep.eq(buildLiteralFromJs('my_company.comz'));
  });

  it('padded length shorter than string', () => {
    expect(dispatch('rpad', [buildLiteralFromJs('my_company.com'), buildLiteralFromJs(2), buildLiteralFromJs('z')])).to.deep.eq(buildLiteralFromJs('my'));
  });
});

describe('substitute', () => {
  it('returns correct result for no replace', () => {
    expect(dispatch('substitute', [buildLiteralFromJs('Beer'), buildLiteralFromJs('Water'), buildLiteralFromJs('Wine')])).to.deep.eq(buildLiteralFromJs('Beer'));
  });

  it('returns correct result for single replace', () => {
    expect(dispatch('substitute', [buildLiteralFromJs('50% Coupon'), buildLiteralFromJs('Coupon'), buildLiteralFromJs('Discount')])).to.deep.eq(buildLiteralFromJs('50% Discount'));
  });

  it('returns correct result for mutli replace', () => {
    expect(dispatch('substitute', [buildLiteralFromJs('Wake me up before you go go'), buildLiteralFromJs('go'), buildLiteralFromJs('leave')])).to.deep.eq(buildLiteralFromJs('Wake me up before you leave leave'));
  });

  it('returns correct result for conflicting regex characters', () => {
    expect(dispatch('substitute', [buildLiteralFromJs('('), buildLiteralFromJs('('), buildLiteralFromJs('[')])).to.deep.eq(buildLiteralFromJs('['));
  });
});

describe('text', () => {
  context('Number', () => {
    it('returns correct text', () => {
      expect(dispatch('text', [buildLiteralFromJs(1)])).to.deep.eq(buildLiteralFromJs('1'));
    });
  });

  context('Date', () => {
    it('returns correct text', () => {
      expect(dispatch('text', [buildDateLiteral(2020, 2, 11)])).to.deep.eq(buildLiteralFromJs('2020-02-11'));
    });
  });

  context('Datetime', () => {
    it('returns correct text', () => {
      expect(dispatch('text', [buildDatetimeLiteral(Date.UTC(2020, 1, 11, 17, 39, 0, 973))])).to.deep.eq(buildLiteralFromJs('2020-02-11 17:39:00Z'));
    });
  });
});

describe('trim', () => {
  it('no trailing spaces', () => {
    expect(dispatch('trim', [buildLiteralFromJs('a string')])).to.deep.eq(buildLiteralFromJs('a string'));
  });

  it('trailing spaces', () => {
    expect(dispatch('trim', [buildLiteralFromJs('a string ')])).to.deep.eq(buildLiteralFromJs('a string'));
  });

  it('leading spaces', () => {
    expect(dispatch('trim', [buildLiteralFromJs('  a string')])).to.deep.eq(buildLiteralFromJs('a string'));
  });

  it('trailing and leading spaces', () => {
    expect(dispatch('trim', [buildLiteralFromJs('  a string  ')])).to.deep.eq(buildLiteralFromJs('a string'));
  });
});

describe('upper', () => {
  it('returns correct string', () => {
    expect(dispatch('upper', [buildLiteralFromJs('mycompany.com')])).to.deep.eq(buildLiteralFromJs('MYCOMPANY.COM'));
  });
});

describe('value', () => {
  context('Parsable', () => {
    it('returns correct value for integer', () => {
      expect(dispatch('value', [buildLiteralFromJs('1')])).to.deep.eq(buildLiteralFromJs(1));
    });

    it('returns correct value for float', () => {
      expect(dispatch('value', [buildLiteralFromJs('3.14')])).to.deep.eq(buildLiteralFromJs(3.14));
    });
  });

  context('Not Parsable', () => {
    it('returns null', () => {
      expect(dispatch('value', [buildLiteralFromJs('Number Kaputt')])).to.deep.eq(buildLiteralFromJs(null));
    });
  });
});

// Advanced Functions

describe.skip('currencyrate', () => {
  it('returns correct currencyrate', () => {
    // TODO implement test for sf$currencyrate
    expect(dispatch('currencyrate', [null])).to.deep.eq(null);
  });
});

describe('regex', () => {
  it('returns true for match', () => {
    const text = buildLiteralFromJs('999-99-9999');
    const regexText = buildLiteralFromJs('[0-9]{3}-[0-9]{2}-[0-9]{4}');
    expect(dispatch('regex', [text, regexText])).to.deep.eq(buildLiteralFromJs(true));
  });

  it('returns false for non-match', () => {
    const text = buildLiteralFromJs('something else');
    const regexText = buildLiteralFromJs('[0-9]{3}-[0-9]{2}-[0-9]{4}');
    expect(dispatch('regex', [text, regexText])).to.deep.eq(buildLiteralFromJs(false));
  });

  it('matches complete string', () => {
    const text = buildLiteralFromJs('According to Marc Benioff, the social enterprise increases customer success.');
    const regexText = buildLiteralFromJs('.*Marc Benioff.*');
    expect(dispatch('regex', [text, regexText])).to.deep.eq(buildLiteralFromJs(true));
  });

  it('does not match partial string', () => {
    const text = buildLiteralFromJs('According to Marc Benioff, the social enterprise increases customer success.');
    const regexText = buildLiteralFromJs('Marc Benioff');
    expect(dispatch('regex', [text, regexText])).to.deep.eq(buildLiteralFromJs(false));
  });
});
