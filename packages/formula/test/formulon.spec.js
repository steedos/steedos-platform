/* global describe it context */

import { expect } from 'chai';
import { extract, parse } from '../src/formulon';
import { buildLiteralFromJs } from '../src/utils';

describe('Formulon', () => {
  describe('parse', () => {
    context('success', () => {
      context('no identifiers', () => {
        it('returns correct result for addition', () => {
          expect(parse('1 + 2')).to.deep.eq(buildLiteralFromJs(3));
        });

        it('returns correct result for subtraction', () => {
          expect(parse('1 - 2')).to.deep.eq(buildLiteralFromJs(-1));
        });

        it('returns correct result longer subtraction', () => {
          expect(parse('5 - 2 - 4')).to.deep.eq(buildLiteralFromJs(-1));
        });

        it('returns correct result longer addition', () => {
          expect(parse('1 + 2 + 4')).to.deep.eq(buildLiteralFromJs(7));
        });

        it('returns correct result longer multiplication', () => {
          expect(parse('2 * 3 * 4')).to.deep.eq(buildLiteralFromJs(24));
        });

        it('returns correct result for mixed multiplication and addition', () => {
          expect(parse('5 + 7 * 8')).to.deep.eq(buildLiteralFromJs(61));
        });

        it('returns correct result longer multiplication and addition with negative number', () => {
          expect(parse('-5 + 7 * 8')).to.deep.eq(buildLiteralFromJs(51));
        });

        it('returns correct result longer multiplication and addition with negative number', () => {
          expect(parse('(5 + 7) * 8')).to.deep.eq(buildLiteralFromJs(96));
        });

        it('returns correct result longer division', () => {
          expect(parse('36 / 2 / 3')).to.deep.eq(buildLiteralFromJs(6));
        });

        it('returns correct result longer division', () => {
          expect(parse('36 / 2')).to.deep.eq(buildLiteralFromJs(18));
        });

        it('returns correct result longer subtraction and addition', () => {
          expect(parse('8 - 4 + 2')).to.deep.eq(buildLiteralFromJs(6));
        });

        it('returns correct result longer multiplication and divison', () => {
          expect(parse('12 / 2 * 3')).to.deep.eq(buildLiteralFromJs(18));
        });

        it('returns correct result for function with variable argument list', () => {
          expect(parse('CASE(1, 1, "January", 2, "February", "None")')).to.deep.eq(buildLiteralFromJs('January'));
        });

        it('returns correct result for logical operations', () => {
          expect(parse('1 > 2')).to.deep.eq(buildLiteralFromJs(false));
        });

        it('returns correct result for flow control', () => {
          expect(parse('IF(1 > 2, "greater", "smaller")')).to.deep.eq(buildLiteralFromJs('smaller'));
        });

        it('returns correct result for multiple logicals', () => {
          expect(parse('"a" == "b" || "a" == "a"')).to.deep.eq(buildLiteralFromJs(true));
        });

        it('returns correct result for mixed logicals and arithmetics', () => {
          expect(parse('2 == 1 + 2 || 4 == 2 + 2')).to.deep.eq(buildLiteralFromJs(true));
        });

        it('returns correct result for single quotes', () => {
          expect(parse("'a' + 'b'")).to.deep.eq(buildLiteralFromJs('ab'));
        });

        it('returns correct result for string concatenation', () => {
          expect(parse("'a' & 'b'")).to.deep.eq(buildLiteralFromJs('ab'));
        });
      });

      context('coerce inputs', () => {
        context('number', () => {
          it('rounds variables accordingly', () => {
            const var1 = {
              type: 'literal',
              dataType: 'number',
              value: 1.35,
              options: {
                length: 1,
                scale: 1,
              },
            };

            const var2 = {
              type: 'literal',
              dataType: 'number',
              value: 2.35,
              options: {
                length: 1,
                scale: 1,
              },
            };

            expect(parse('var1 + var2', { var1, var2 })).to.deep.eq(buildLiteralFromJs(3.8));
          });
        });

        context('text', () => {
          it('cuts off text', () => {
            const input = {
              type: 'literal',
              dataType: 'text',
              value: 'first second',
              options: {
                length: 5,
              },
            };

            expect(parse('a_text', { a_text: input })).to.deep.eq(buildLiteralFromJs('first'));
          });
        });
      });

      context('with identifiers', () => {
        context('string', () => {
          const substitutions = {
            Custom_field__c: {
              value: '',
              dataType: 'text',
              options: {
                length: 0,
              },
            },
          };

          it('returns correct result', () => {
            expect(parse('Custom_field__c', substitutions)).to.deep.eq(buildLiteralFromJs(''));
          });
        });

        context('arithmetics', () => {
          const substitutions = {
            Custom_field__c: {
              value: 2,
              dataType: 'number',
              options: {
                length: 8,
                scale: 0,
              },
            },
          };

          it('returns correct result', () => {
            expect(parse('1 + Custom_field__c', substitutions)).to.deep.eq(buildLiteralFromJs(3));
          });
        });
      });
    });

    context('error', () => {
      context('empty input', () => {
        const expected = buildLiteralFromJs('');

        context('null input', () => {
          it('returns empty string', () => {
            expect(parse(null)).to.deep.eq(expected);
          });
        });

        context('undefined input', () => {
          it('returns empty string', () => {
            expect(parse(undefined)).to.deep.eq(expected);
          });
        });

        context('empty string input', () => {
          it('returns empty string', () => {
            expect(parse('')).to.deep.eq(expected);
          });
        });

        context('whitespace only input', () => {
          it('returns empty string', () => {
            expect(parse('   ')).to.deep.eq(expected);
          });
        });
      });

      context('no substitutions for existing identifier', () => {
        it('returns error object with ReferenceError', () => {
          const expected = {
            type: 'error',
            errorType: 'ReferenceError',
            identifier: 'Custom_field__c',
            message: 'Field Custom_field__c does not exist. Check spelling.',
          };
          expect(parse('1 + Custom_field__c', {})).to.deep.eq(expected);
        });
      });

      context('unknown function call', () => {
        it('returns error object with ReferenceError', () => {
          const expected = {
            type: 'error',
            errorType: 'NoFunctionError',
            function: 'missing',
            message: 'Unknown function MISSING. Check spelling.',
          };
          expect(parse('MISSING(1)', {})).to.deep.eq(expected);
        });
      });

      context('parse error', () => {
        it('returns error object with SyntaxError', () => {
          const expected = {
            type: 'error',
            errorType: 'SyntaxError',
            message: 'Syntax error.',
          };
          expect(parse('Custom_field__c +', {})).to.deep.eq(expected);
        });
      });

      context('wrong number of parameters', () => {
        it('returns error object with ReferenceError', () => {
          const expected = {
            type: 'error',
            errorType: 'ArgumentError',
            message: "Incorrect number of parameters for function 'IF()'. Expected 3, received 1",
            function: 'if',
            expected: 3,
            received: 1,
          };
          expect(parse('IF(FALSE)', {})).to.deep.eq(expected);
        });
      });

      context('runtime error in inner call', () => {
        it('exposes the inner error', () => {
          const expected = {
            type: 'error',
            errorType: 'ArgumentError',
            message: "Incorrect number of parameters for function 'CASE()'. Expected 4, received 1",
            function: 'case',
            expected: 4,
            received: 1,
          };
          expect(parse('AND(CASE(1), TRUE)', {})).to.deep.eq(expected);
        });
      });
    });
  });

  describe('extract', () => {
    context('no identifiers', () => {
      const formula = '1.5 + 2';

      it('returns empty array', () => {
        const expected = [];
        expect(extract(formula)).to.deep.equal(expected);
      });
    });

    context('one identifier', () => {
      const formula = '1.5 + Name';

      it('returns array with identifiers', () => {
        const expected = ['Name'];
        expect(extract(formula)).to.deep.equal(expected);
      });
    });

    context('multiple identifiers', () => {
      const formula = 'Argument1 - Argument2 + Name';

      it('returns array with identifiers', () => {
        const expected = ['Argument1', 'Argument2', 'Name'];
        expect(extract(formula)).to.deep.equal(expected);
      });
    });

    context('redundant identifiers', () => {
      const formula = 'Name * Name';

      it('returns array unique identifiers', () => {
        const expected = ['Name'];
        expect(extract(formula)).to.deep.equal(expected);
      });
    });

    context('parameterless function name', () => {
      const formula = 'DATE()';

      it('returns empty array', () => {
        const expected = [];
        expect(extract(formula)).to.deep.equal(expected);
      });
    });

    context('empty input', () => {
      const expected = [];

      context('null input', () => {
        it('returns empty string', () => {
          expect(extract(null)).to.deep.eq(expected);
        });
      });

      context('undefined input', () => {
        it('returns empty string', () => {
          expect(extract(undefined)).to.deep.eq(expected);
        });
      });

      context('empty string input', () => {
        it('returns empty string', () => {
          expect(extract('')).to.deep.eq(expected);
        });
      });

      context('whitespace only input', () => {
        it('returns empty string', () => {
          expect(extract('   ')).to.deep.eq(expected);
        });
      });
    });
  });
});
