import FormulonRuntimeError from './FormulonRuntimeError';

export default class NotImplementedError extends FormulonRuntimeError {
  constructor(message, options) {
    super(message, 'NotImplementedError', options);
  }

  static throwError(fnName) {
    throw new NotImplementedError(`Function ${fnName} not implemented yet.`, { name: fnName });
  }
}
