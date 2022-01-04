Meteor status
=============

Display the app connection status with the server

## Installation

```bash
$ meteor add francocatena:status
```

## Usage

Just insert `{{> status}}` and you are ready

This is what it looks like when the connection between the server and the client is lost:

![Disconnected status in english](https://raw.githubusercontent.com/francocatena/meteor-status/master/docs/example_en.png)

## Templates

The status component can be generated using a specific template by providing a template name

```javascript
Meteor.startup(function () {
  Status.setTemplate('semantic_ui')
})
```

### Available templates

- [bootstrap3](http://getbootstrap.com/) (default)
- [semantic_ui](http://semantic-ui.com/) (thanks [Sivli Kestanous](https://github.com/Kestanous))
- [materialize](http://materializecss.com/) (thanks [Gabriel](https://github.com/kainlite))
- [uikit](http://getuikit.com/) (thanks [hack1m](https://github.com/hack1m))
- [foundation](http://foundation.zurb.com/) (thanks [hack1m](https://github.com/hack1m))

### Creating a custom template

To define a custom template simply create a template with the name 'status\_' + templateName

For example:

```html
<template name="status_skeleton">
</template>
```

And then use it like this:

```javascript
Status.setTemplate('skeleton')
```

You can also set the main classes (or other options) in the provided templates

```javascript
Status.setTemplate('bootstrap3', { classes: 'alert-danger' })
```

For examples see the
[templates](https://github.com/francocatena/meteor-status/tree/master/templates) folder

## Translate

If you want to display the messages in another language

```javascript
Meteor.startup(function () {
  TAPi18n.setLanguage('fr')
})
```

If you are **not** using tap:i18n you should create an empty file for the language:

```bash
$ mkdir -p i18n && touch i18n/fr.i18n.json
```

And voilà:

![Disconnected status in french](https://raw.githubusercontent.com/francocatena/meteor-status/master/docs/example_fr.png)

### Available translations

- English (default)
- Spanish
- French (thanks to [Arthur Tayrac](https://github.com/crmfrsh) and [Maxence Aïci](https://github.com/mininao))
- Italian (thanks to [alexdown](https://github.com/alexdown))
- Turkish (thanks to [fuatsengul](https://github.com/fuatsengul))
- German (thanks to [xanatas](https://github.com/xanatas))
- Portuguese (thanks to [Rodrigo Nascimento](https://github.com/rodrigok))
- Dutch (thanks to [David Soff](https://github.com/Davidrums))
- Traditional Chinese (thanks to [Henry Hsiao](https://github.com/hehsiao))
- Danish (thanks to [132041](https://github.com/132041))
- Simplified Chinese (thanks to [Bing Zou](https://github.com/xigua) and [Micjoyce](https://github.com/Micjoyce))
- Czech (thanks to [Rostislav Postrednik](https://github.com/postrednik))
- Russian (thanks to [navi8602](https://github.com/navi8602))
- Malay (thanks to [hack1m](https://github.com/hack1m))
- Indonesian (thanks to [hack1m](https://github.com/hack1m))
- Vietnamese (thanks to [phund](https://github.com/phund))
- Estonian (thanks to [Kris Haamer](https://github.com/krishaamer))

## Contributors

- [Mark](https://github.com/erasaur)
