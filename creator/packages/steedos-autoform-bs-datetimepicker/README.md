aldeed:autoform-bs-datetimepicker
=========================

An add-on Meteor package for [aldeed:autoform](https://github.com/aldeed/meteor-autoform). Provides a single custom input type, "bootstrap-datetimepicker", which renders an input using the [bootstrap-datetimepicker](http://eonasdan.github.io/bootstrap-datetimepicker/) plugin.

## Prerequisites

Bootstrap and the plugin library must be installed separately.

In a Meteor app directory, enter:

```bash
$ meteor add twbs:bootstrap
$ meteor add tsega:bootstrap3-datetimepicker@=3.1.3_3
$ meteor add aldeed:autoform
```

If you need to use the `timezoneId` attribute to get the Date in some timezone other than the local client timezone, you must also add `moment-timezone`:

```bash
$ meteor add mrt:moment-timezone
```

## Installation

In a Meteor app directory, enter:

```bash
$ meteor add aldeed:autoform-bs-datetimepicker
```

## Usage

Specify "bootstrap-datetimepicker" for the `type` attribute of any input. This can be done in a number of ways:

In the schema, which will then work with a `quickForm` or `afQuickFields`:

```js
{
  date: {
    type: Date,
    autoform: {
      afFieldInput: {
        type: "bootstrap-datetimepicker"
      }
    }
  }
}
```

Or on the `afFieldInput` component or any component that passes along attributes to `afFieldInput`:

```js
{{> afQuickField name="typeTest" type="bootstrap-datetimepicker"}}

{{> afFormGroup name="typeTest" type="bootstrap-datetimepicker"}}

{{> afFieldInput name="typeTest" type="bootstrap-datetimepicker"}}
```

## Choosing a Timezone

By default, the field's value will be a `Date` object representing the selected date and time in the browser's timezone (i.e., based on the user's computer time settings). In most cases, you probably want the `Date` object relative to some other timezone that you have previously stored. For example, if the form is setting the start date of an event, you want the date to be relative to the event venue's timezone. You can specify a different IANA timezone ID by adding a `timezoneId` attribute.

```js
{
  date: {
    type: Date,
    autoform: {
      afFieldInput: {
        type: "bootstrap-datetimepicker",
        timezoneId: "America/New_York"
      }
    }
  }
}
```

Or:

```js
{{> afFieldInput name="typeTest" type="bootstrap-datetimepicker" timezoneId="America/New_York"}}
```

## Automatic Type Conversions

This input type is intended to be used with `type: Date` schema keys, but it also works with other schema types. Here's a list:

* `Date`: Value is stored as a `Date` object representing the selected date and time in the timezone you specified with the `timezoneId` attribute. By default, the timezone is that of the browser (i.e., the user's computer time settings).
* `String`: Value is stored as a string representation of the selected date in ISO format, e.g., "2014-11-25T00:00:00".
* `Number`: Value is stored as the result of calling `getTime()` on the `Date` object (representing the selected date and time in the timezone you specified).
* `Array`: If the schema expects an array of `Date` or `String` or `Number`, the value is converted to a one-item array and stored.

To provide bootstrap-datetimepicker options, set a `dateTimePickerOptions` attribute equal to a helper that returns the options object.

## Customizing Appearance

If you want to customize the appearance of the input, for example to use an input group with date/time icons, use the [aldeed:template-extension](https://atmospherejs.com/aldeed/template-extension) package to replace the "afBootstrapDateTimePicker" template, like this:

```html
<template name="dpReplacement">
  <div class='input-group date'>
    <input type="text" value="" {{atts}}/>
    <span class="input-group-addon">
      <span class="glyphicon glyphicon-calendar"></span>
    </span>
  </div>
</template>
```

```js
Template.dpReplacement.replaces("afBootstrapDateTimePicker");
```

## Demo

[Live](http://autoform.meteor.com/types)

## Contributing

Anyone is welcome to contribute. Fork, make your changes, and then submit a pull request.

[![Support via Gratipay](https://cdn.rawgit.com/gratipay/gratipay-badge/2.1.3/dist/gratipay.png)](https://gratipay.com/aldeed/)
