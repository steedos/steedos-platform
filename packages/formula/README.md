# Formulon

**DISCLAIMER:** Under heavy development, far from feature complete. See [Contributing](CONTRIBUTING.md) for details

[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)

[![Dependency Status](https://david-dm.org/leifg/formulon.svg)](https://david-dm.org/leifg/formulon)
[![devDependency Status](https://david-dm.org/leifg/formulon/dev-status.svg)](https://david-dm.org/leifg/formulon#info=devDependencies)

[![Circle CI](https://circleci.com/gh/leifg/formulon.svg?style=svg)](https://circleci.com/gh/leifg/formulon)

Formulon is a Parser for [Salesforce Formulas](https://help.salesforce.com/apex/HTViewHelpDoc?id=customize_functions.htm) completely written in ECMA Script 2015.

## Usage

### parse

This method will return a object holding value and its metadata

```javascript
import { parse } from 'formulon'
```

#### Examples

```javascript
parse('IF(TRUE, "True String", "False String")')
// {
//  type: 'literal',
//  value: 'True String',
//  dataType: 'text',
//  options: { length: 11 }
// }
```

`type`: Metadata from the parser (always `literal`)
`value`: The actual value of the result
`dataType`: The type of the return (currently `number`, `text`, or `checkbox`)
`options`: different options per data type

#### Data Types

Currently the following data types are supported (naming is taken from the Salesforce Field Types):

- Number (Integer or Float depending on the options)
- Text
- Checkbox (TRUE or FALSE)

#### Options

Options depend on the data type:

##### Number

- Length: Number of digits to the left of the decimal point
- Scale: Number of digits to the right of the decimal point

##### Text

- Length: Number of characters

##### Checkbox

*no options*

#### Errors

Whenever an error occurs, an according object is returned:

```javascript
parse('IF(TRUE)')
// {
//   type: 'error',
//   errorType: 'ArgumentError',
//   message: "Incorrect number of parameters for function 'IF()'. Expected 3, received 1",
//   function: 'if',
//   expected: 3,
//   received: 1,
// }
```

#### Identifiers (Variables)

It's possible to specify formulas that contain variables. In that case pass the value of the variable in as a second argument:

```javascript
parse('IF(Variable__c, "True String", "False String")', {Variable__c: {type: 'literal', dataType: 'checkbox', value: true}})
// {
//  type: 'literal',
//  value: 'True String',
//  dataType: 'text',
//  options: { length: 11 }
// }
```

You'll have to provide the variable in the form:

```javascript
{
  type: 'literal',
  value: <the actual value as a JS type>,
  dataType: <the salesforce field type specified above>,
  options: <salesforce field options>
}
```

### extract

Utility function that returns a list of used variables

```javascript
extract('IF(Variable__c, Variable__c, AnotherVariable__c)')
// [ 'Variable__c', 'AnotherVariable__c' ]
```

## Contributors

Formulon exists thanks to the following people who have contributed.

- [Jordan Henderson](https://github.com/jordanhenderson)
- [Leif Gensert](https://github.com/leifg)

## 功能说明
- 此包用于系统的公式计算功能