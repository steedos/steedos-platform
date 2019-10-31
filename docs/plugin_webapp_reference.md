---
title: Web App Reference
---

## PluginClass

The PluginClass interface defines two methods used by the Steedos web app to `initialize` and `uninitialize` your plugin:

```javascript
class PluginClass {
    /**
    * initialize is called by the webapp when the plugin is first loaded.
    * Receives the following:
    * - registry - an instance of the registry tied to your plugin id
    * - store - the Redux store of the web app.
    */
    initialize(registry, store)

    /**
    * uninitialize is called by the webapp if your plugin is uninstalled
    */
    uninitialize()
}
```

Your plugin should implement this class and register it using the global `registerPlugin` method defined on the window by the webapp:

```javascript
window.registerPlugin('myplugin', new PluginClass());
```

Use the provided [registry](#registry) to register components, post type overrides and callbacks. Use the store to access the global state of the web app, but note that you should use the registry to register any custom reducers your plugin might require.

### Example

The entry point `index.js` of your application might contain:

```javascript
import UserPopularity from './components/profile_popover/user_popularity';
import SomePost from './components/some_post';
import MenuIcon from './components/menu_icon';
import {openExampleModal} from './actions';

class PluginClass {
    initialize(registry, store) {
        registry.registerPopoverUserAttributesComponent(
            UserPopularity,
        );
        registry.registerPostTypeComponent(
            'custom_somepost',
            SomePost,
        );
        registry.registerMainMenuAction(
            'Plugin Menu Item',
            () => store.dispatch(openExampleModal()),
            mobile_icon: MenuIcon,
        );
    }

    uninitialize() {
        // No clean up required.
    }
}

window.registerPlugin('myplugin', new PluginClass());
```

This will add a custom `UserPopularity` component to the profile popover, render a custom `SomePost` component for any post with the type `custom_somepost`, and insert a custom main menu item.

## Registry

An instance of the plugin registry is passed to each plugin via the `initialize` callback.

- registerObjectHomeComponent(object_name, component)

### registerObjectHomeComponent

```js
/**
    * Register a component that show a dashboard
*/
registerRootComponent('dashboard', component)
```

## Exported Libraries and Functions

The web app exports a number of libraries and functions on the [window](https://developer.mozilla.org/en-US/docs/Web/API/Window) object for plugins to use. To avoid bloating your plugin, we recommend depending on these using [Webpack externals](https://webpack.js.org/configuration/externals/) or importing them manually from the window. Below is a list of the exposed libraries and functions:

| Library | Exported Name | Description |
| ------- | ------------- | ----------- |
| react | window.React | [ReactJS](https://reactjs.org/) |
| react-dom | window.ReactDOM | [ReactDOM](https://reactjs.org/docs/react-dom.html) |
| redux | window.Redux | [Redux](https://redux.js.org/) |
| react-redux | window.ReactRedux | [React bindings for Redux](https://github.com/reactjs/react-redux) |
| react-bootstrap | window.ReactBootstrap | [Bootstrap for React](https://react-bootstrap.github.io/) |
| prop-types | window.PropTypes | [PropTypes](https://www.npmjs.com/package/prop-types) |
| @steedos/react | window.ReactSteedos | Steedos react components and utility functions |
| @salesforce/design-system-react | window.ReactDesignSystem | Salesforce react components and utility functions |

### ReactSteedos

Contains the following utility functions:

#### absoluteUrl(url)

返回绝对路径

#### Usage Example

```javascript
const React = window.react;
const ReactSteedos = window['ReactSteedos']; // import the post utilities
import PropTypes from 'prop-types';

export default class DashboardComponent extends React.PureComponent {

    // ...

    render() {


        return (
            <ReactSteedos.Dashboard/>
        );
    }
}
```
