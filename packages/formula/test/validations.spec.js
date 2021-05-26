/* global describe it context */

import { expect } from 'chai';
import { buildLiteralFromJs, buildPicklistLiteral } from '../src/utils';
import {
  caseParams,
  maxNumOfParams,
  minNumOfParams,
  paramTypes,
  sameParamType,
} from '../src/validations';
import ArgumentError from '../src/errors/ArgumentError';

describe('maxNumOfParams', () => {
  context('exact length', () => {
    it('throws no error', () => {
      const params = [buildLiteralFromJs(1), buildLiteralFromJs(2)];
      const fn = () => maxNumOfParams(2)('mod')(params);
      expect(fn()).to.eq(undefined);
    });
  });

  context('less parameters than expected', () => {
    it('throws no error', () => {
      const params = [buildLiteralFromJs(1), buildLiteralFromJs(2)];
      const fn = () => maxNumOfParams(3)('if')(params);
      expect(fn()).to.eq(undefined);
    });
  });

  context('more parameters than expected', () => {
    it('throws ArgumentError', () => {
      const params = [buildLiteralFromJs(1), buildLiteralFromJs(2)];
      const fn = () => maxNumOfParams(1)('abs')(params);
      expect(fn).to.throw(ArgumentError, "Incorrect number of parameters for function 'ABS()'. Expected 1, received 2");
    });
  });
});

describe('minNumOfParams', () => {
  context('exact length', () => {
    it('throws no error', () => {
      const params = [buildLiteralFromJs(1), buildLiteralFromJs(2)];
      const fn = () => minNumOfParams(2)('mod')(params);
      expect(fn()).to.eq(undefined);
    });
  });

  context('less parameters than expected', () => {
    it('throws ArgumentError', () => {
      const params = [buildLiteralFromJs(1), buildLiteralFromJs(2)];
      const fn = () => minNumOfParams(3)('if')(params);
      expect(fn).to.throw(ArgumentError, "Incorrect number of parameters for function 'IF()'. Expected 3, received 2");
    });
  });

  context('more parameters than expected', () => {
    it('throws no error', () => {
      const params = [buildLiteralFromJs(1), buildLiteralFromJs(2)];
      const fn = () => minNumOfParams(1)('abs')(params);
      expect(fn()).to.eq(undefined);
    });
  });
});

describe('paramTypes', () => {
  context('length matches', () => {
    context('types match', () => {
      context('single type expectatiosn', () => {
        it('throws no error', () => {
          const params = [buildLiteralFromJs('long')];
          const fn = () => paramTypes('text')('len')(params);
          expect(fn()).to.eq(undefined);
        });

        it('throws no error with null input', () => {
          const params = [buildLiteralFromJs(null)];
          const fn = () => paramTypes('text')('len')(params);
          expect(fn()).to.eq(undefined);
        });
      });

      context('multi type expectatiosn', () => {
        it('throws no error', () => {
          const params = [buildLiteralFromJs(1), buildLiteralFromJs(2)];
          const fn = () => paramTypes(['date', 'number'], ['date', 'number'])('add')(params);
          expect(fn()).to.eq(undefined);
        });
      });
    });

    context('types do not match', () => {
      context('single type expectatiosn', () => {
        it('throws an error for text != number', () => {
          const params = [buildLiteralFromJs(1234)];
          const fn = () => paramTypes('text')('len')(params);
          expect(fn).to.throw(ArgumentError, "Incorrect parameter type for function 'LEN()'. Expected Text, received Number");
        });

        it('throws an error for non-literal input', () => {
          const params = ['regular string'];
          const fn = () => paramTypes('text')('trim')(params);
          expect(fn).to.throw(ArgumentError, "Incorrect parameter type for function 'TRIM()'. Expected Text, received Non-Salesforce");
        });
      });

      context('multi type expectatiosn', () => {
        it('throws an error for checkbox != number, date', () => {
          const params = [buildLiteralFromJs(true), buildLiteralFromJs(false)];
          const fn = () => paramTypes(['date', 'number'], ['date', 'number'])('add')(params);
          expect(fn).to.throw(ArgumentError, "Incorrect parameter type for function 'ADD()'. Expected Date, Number, received Checkbox");
        });
      });
    });
  });

  context('expected length > received length', () => {
    context('types match', () => {
      context('single type expectatiosn', () => {
        it('throws no error', () => {
          const params = [buildLiteralFromJs('LGENSERT'), buildLiteralFromJs(3)];
          const fn = () => paramTypes('text', 'number', 'text')('lpad')(params);
          expect(fn()).to.eq(undefined);
        });
      });
    });

    context('types do not match', () => {
      context('single type expectatiosn', () => {
        it('throws an error for text != number', () => {
          const params = [buildLiteralFromJs('LGENSERT'), buildLiteralFromJs('3')];
          const fn = () => paramTypes('text', 'number', 'text')('lpad')(params);
          expect(fn).to.throw(ArgumentError, "Incorrect parameter type for function 'LPAD()'. Expected Number, received Text");
        });

        it('throws an error for non-literal input', () => {
          const params = ['regular string'];
          const fn = () => paramTypes(['text'])('trim')(params);
          expect(fn).to.throw(ArgumentError, "Incorrect parameter type for function 'TRIM()'. Expected Text, received Non-Salesforce");
        });
      });
    });
  });

  context('expected length < received length', () => {
    context('types match', () => {
      context('single type expectatiosn', () => {
        it('throws no error', () => {
          const params = [buildLiteralFromJs(1), buildLiteralFromJs(3)];
          const fn = () => paramTypes('number')('max')(params);
          expect(fn()).to.eq(undefined);
        });
      });
    });

    context('types do not match', () => {
      context('single type expectatiosn', () => {
        it('throws an error for text != number', () => {
          const params = [buildLiteralFromJs(1), buildLiteralFromJs('3')];
          const fn = () => paramTypes('number')('max')(params);
          expect(fn).to.throw(ArgumentError, "Incorrect parameter type for function 'MAX()'. Expected Number, received Text");
        });
      });
    });
  });
});

describe('sameParamType', () => {
  context('same param type', () => {
    it('does not throw an error', () => {
      const params = [buildLiteralFromJs(1), buildLiteralFromJs(2), buildLiteralFromJs(3)];
      const fn = () => sameParamType()('equal')(params);
      expect(fn()).to.eq(undefined);
    });

    context('only one param', () => {
      const params = [buildLiteralFromJs(1)];
      const fn = () => sameParamType()('equal')(params);
      expect(fn()).to.eq(undefined);
    });

    context('no param', () => {
      const params = [];
      const fn = () => sameParamType()('br')(params);
      expect(fn()).to.eq(undefined);
    });
  });

  context('different param type', () => {
    it('throws an ArgumentError', () => {
      const params = [buildLiteralFromJs(1), buildLiteralFromJs(2), buildLiteralFromJs('3')];
      const fn = () => sameParamType()('equal')(params);
      expect(fn).to.throw(ArgumentError, "Incorrect parameter type for function 'EQUAL()'. Expected Number, received Text");
    });
  });

  context('includes null', () => {
    it('throws an ArgumentError', () => {
      const params = [buildLiteralFromJs(null), buildLiteralFromJs(2), buildLiteralFromJs(3)];
      const fn = () => sameParamType()('equal')(params);
      expect(fn()).to.eq(undefined);
    });
  });
});

describe('caseParams', () => {
  context('types match up', () => {
    it('throws no error', () => {
      const params = [buildLiteralFromJs(1), buildLiteralFromJs(1), buildLiteralFromJs('1'), buildLiteralFromJs(2), buildLiteralFromJs('2'), buildLiteralFromJs('somethign else')];
      const fn = () => caseParams()('case')(params);
      expect(fn()).to.eq(undefined);
    });

    context('picklist', () => {
      it('throws no error', () => {
        const params = [buildPicklistLiteral('Active', ['Active', 'Inactive']), buildLiteralFromJs('Active'), buildLiteralFromJs('1'), buildLiteralFromJs('Inactive'), buildLiteralFromJs('2'), buildLiteralFromJs('somethign else')];
        const fn = () => caseParams()('case')(params);
        expect(fn()).to.eq(undefined);
      });
    });
  });

  context('types do not match', () => {
    it('throws ArgumentError', () => {
      const params = [buildLiteralFromJs(1), buildLiteralFromJs(1), buildLiteralFromJs('1'), buildLiteralFromJs('2'), buildLiteralFromJs('2'), buildLiteralFromJs('somethign else')];
      const fn = () => caseParams()('case')(params);
      expect(fn).to.throw(ArgumentError, "Incorrect parameter type for function 'CASE()'. Expected Number, received Text");
    });

    context('picklist', () => {
      it('throws ArgumentError', () => {
        const params = [buildPicklistLiteral('Active', ['Active', 'Inactive']), buildLiteralFromJs('Active'), buildLiteralFromJs('1'), buildLiteralFromJs(2), buildLiteralFromJs('2'), buildLiteralFromJs('somethign else')];
        const fn = () => caseParams()('case')(params);
        expect(fn).to.throw(ArgumentError, "Incorrect parameter type for function 'CASE()'. Expected Text, received Number");
      });
    });
  });
});
