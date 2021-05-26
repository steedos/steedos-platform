import FormulonRuntimeError from './FormulonRuntimeError';

export default class ReferenceError extends FormulonRuntimeError {
  constructor(message, options) {
    super(message, 'ReferenceError', options);
  }
}
