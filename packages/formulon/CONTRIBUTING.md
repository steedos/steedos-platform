# Contributing to Formulon

## Ways of Helping out

### Finding differences in Salesforce Formula behaviour and Formulon

Formulon imitates the behaviour of the original Salesforce Formula implementation. It will not always yield the same results.

If you come a across a discrepancy, [raise an issue](https://github.com/leifg/formulon/issues/new) with the formula and the expected result (ideally without any variables)

### Implementing missing behaviour

At this point not all formula functions have been implemented. For every formula there is, there is an issue, so go ahead and pick what you want to implement. Here is a detailed step by step guide for implementing new behavior:

Check functions.js to see if the function you want to implement already has a stub (should just throw NotImplementedError).

#### If there is not implementation stub

- Add function (name is lower case of salesforce function) to `functionDispatcher.js` (alphabetically sorted).
- Add appropriate validations (e.g. `[minNumOfParams(2), maxNumOfParams(2), paramTypes('text', 'text')]`
- Add test stub for function to `functions.spec.js` (sorted by category then alphabetically)

  ```javascript
  describe.skip('<function_name>', () => {
    it('returns correct value', () => {
      // TODO implement test for sf$<function_name>
      expect(dispatch(<function_name>, [null])).to.deep.eq(null);
    })
  })
  ```

- Add implemention stub to `functions.js` (sorted by category then alphabetically) that throws `NotImplementedError`

  ```javascript
  /* eslint-disable no-unused-vars */
  export const sf$<function_name> = (_arguments) => {
    NotImplementedError.throwError('<function_name>')
  }
  /* eslint-enable no-unused-vars */
  ```

For implementation move on to next section

#### If there is a implementation stub

- remove `.skip` from unit test
- Implement tests and the feature (ideally in this order). Look at other tests and implementation to get a feeling on how to implement the individual features.
- Submit a PR referencing the issue number

## How to Get in Touch

- Twitter - [@leifg](https://twitter.com/leifg)
- Email - formulon (at) leif.io

## License

By contributing to Formulon, you agree that your contributions will be licensed under its MIT license.
