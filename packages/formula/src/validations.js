import ArgumentError from './errors/ArgumentError';

export const minNumOfParams = (expectedMinNumOfParams) => (fnName) => (params) => {
  if (params.length < expectedMinNumOfParams) {
    ArgumentError.throwIncorrectNumberOfArguments(fnName, expectedMinNumOfParams, params.length);
  }
};

export const maxNumOfParams = (expectedMaxNumOfParams) => (fnName) => (params) => {
  if (params.length > expectedMaxNumOfParams) {
    ArgumentError.throwIncorrectNumberOfArguments(fnName, expectedMaxNumOfParams, params.length);
  }
};

export const paramTypes = (...paramTypeList) => (fnName) => (params) => {
  const comparableArray = params.map((literal, index) => [
    literal.dataType, paramTypeList[index] || paramTypeList[paramTypeList.length - 1],
  ]);

  // fill with last element of params, parameterlist is smaller than params

  comparableArray.forEach(([received, expected]) => {
    // allow null input in all functions
    if (received !== 'null') {
      if (Array.isArray(expected)) {
        if (expected.indexOf(received) === -1) {
          ArgumentError.throwWrongType(fnName, expected, received);
        }
      } else if (received !== expected) {
        ArgumentError.throwWrongType(fnName, expected, received);
      }
    }
  });
};

export const sameParamType = () => (fnName) => (params) => {
  if (params.length > 0) {
    params.filter((param) => param.dataType !== 'null').reduce((acc, current) => {
      if (acc.dataType !== current.dataType) {
        ArgumentError.throwWrongType(fnName, acc.dataType, current.dataType);
      }
      return current;
    });
  }
};

// special validation, to assure that all cases in a CASE statement match the input data type
export const caseParams = () => (fnName) => (params) => {
  const expectedType = params[0].dataType === 'picklist' ? 'text' : params[0].dataType;

  const cases = params.filter((_elem, index) => (
    index % 2 === 1 && index !== (params.length - 1)
  ));

  const differentCase = cases.find((elem) => elem.dataType !== expectedType);

  if (differentCase) {
    ArgumentError.throwWrongType(fnName, expectedType, differentCase.dataType);
  }
};
