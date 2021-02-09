import FormulonRuntimeError from './FormulonRuntimeError';

const capitalize = (s) => {
  if (Array.isArray(s)) {
    return s.map((elem) => capitalize(elem)).join(', ');
  }

  if (typeof s !== 'string') return '';

  return s.charAt(0).toUpperCase() + s.slice(1);
};

export default class ArgumentError extends FormulonRuntimeError {
  constructor(message, options) {
    super(message, 'ArgumentError', options);
  }

  static throwWrongType(fnName, expected, received) {
    const options = {
      function: fnName,
      expected,
      received,
    };

    const receivedStr = received || 'Non-Salesforce';

    throw new ArgumentError(`Incorrect parameter type for function '${fnName.toUpperCase()}()'. Expected ${capitalize(expected)}, received ${capitalize(receivedStr)}`, options);
  }

  static throwIncorrectNumberOfArguments(fnName, expected, received) {
    const options = {
      function: fnName,
      expected,
      received,
    };

    throw new ArgumentError(`Incorrect number of parameters for function '${fnName.toUpperCase()}()'. Expected ${expected}, received ${received}`, options);
  }
}
