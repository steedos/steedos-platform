export default class FormulonRuntimeError extends Error {
  constructor(message, errorType, options) {
    super(message);
    this.errorType = errorType;
    this.options = options;
  }
}
