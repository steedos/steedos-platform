import FormulonRuntimeError from './FormulonRuntimeError';

export default class NoFunctionError extends FormulonRuntimeError {
  constructor(message, options) {
    super(message, 'NoFunctionError', options);
  }
}
