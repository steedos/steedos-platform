# Design System for React

### Accessible, localization-friendly, presentational React components

## Install

```
$ npm install @salesforce-ux/design-system @salesforce/design-system-react
```

## Getting Started

Welcome to the project! :wave: This library is the [React](https://facebook.github.io/react/) implementation of the [Salesforce Lightning Design System](https://www.lightningdesignsystem.com/). This library has a peer dependency on `@salesforce-ux/design-system`, `react`, and `react-dom`.

* [Getting Started](https://react.lightningdesignsystem.com/getting-started/)
* [Documentation and interactive examples](https://react.lightningdesignsystem.com)

### Quick Setup (CommonJS)

A CommonJS-compatible version has been included within the NPM package to allows usage without transpiling. Use the following named `import` syntax to access CommonJS components from `/lib/index.js`:

```
import { Button } from '@salesforce/design-system-react';

<Button label="Hello Button" />
```

### Recommended Usage (ES6 modules)

Recommended usage requires that your babel presets are set up correctly. `create-react-app` and environments that do not transpile code within `node_modules` are not compatible with the component import below. All the examples on the [documentation site](https://react.lightningdesignsystem.com/) use this syntax. You can use the Babel preset, `@salesforce/babel-preset-design-system-react`, to get started. [This preset](npmjs.com/package/@salesforce-ux/babel-preset-design-system-react) will keep Babel compatible with Design System React and allow ES6 module benefits such as tree-shaking.

```
import Button from '@salesforce/design-system-react/components/button';

<Button label="Hello Button" />
```

#### Transpile with `.babelrc` settings

```json
{
  "presets": ["@salesforce/babel-preset-design-system-react"]
}
```

## Licenses

* Source code is licensed under [BSD 3-Clause](https://git.io/sfdc-license)
* All icons and images are licensed under [Creative Commons Attribution-NoDerivatives 4.0](https://github.com/salesforce/licenses/blob/master/LICENSE-icons-images.txt)
* The Salesforce Sans font is licensed under our [font license](https://github.com/salesforce/licenses/blob/master/LICENSE-font.txt)

## Got feedback?

If you have support questions, please post a question to [StackOverflow](https://stackoverflow.com/questions/tagged/design-system-react) and tag with `design-system-react`. If you find any bugs, create a [GitHub Issue](https://github.com/salesforce/design-system-react/issues).
