# check-npm-versions

Enforces "peer" npm dependencies in Meteor 1.3 Atmosphere packages.

Use this package if you are writing an Atmosphere package that depends on a given npm package is installed at the app level of projects you are installed in.

For example, if you are depending on a npm-distributed React component, you don't want to `Npm.depends()` on the npm package in your Atmosphere package, as this will mean a second copy of React will be shipped client-side as a sub-dependency of your package. Instead, you can do:

```js
import { checkNpmVersions } from 'meteor/tmeasday:check-npm-versions';
checkNpmVersions({
  'griddle-react': '0.3.x'
}, 'my:griddle-package');

const Griddle = require('griddle-react');
```

This will prompt the user with an warning message if they do not install `griddle-react` at a correct version directly in their application. If they install no version at all, your `require` statement will subsequently fail.

In your install instructions, you'll still want to tell them to `npm install --save griddle-react` --- this will just tell them what's wrong if they do not.

Note that you must use `require` rather than `import`, unless you do the check in a separate file, as `import` is hoisted to the top of the file (and thus will error before the call to `checkNpmVersions`, which means the user won't see the helpful warning telling them what to do).