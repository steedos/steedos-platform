[![Build Status](https://travis-ci.org/aldeed/meteor-autoform.svg)](https://travis-ci.org/aldeed/meteor-autoform)

AutoForm
=========================

AutoForm is a Meteor package that adds UI components and helpers to easily create basic forms with automatic insert and update events, and automatic reactive validation. This package requires and automatically installs the [simple-schema](https://github.com/aldeed/meteor-simple-schema) package. You can optionally use it with the [collection2](https://github.com/aldeed/meteor-collection2) package, which you have to add to your app yourself.

## NOTE: AutoForm 5.0

AutoForm 5.0 is now available and has many compatibility breaks, but also many fixes and improvements. This release includes a lot of internal refactoring, so it's a good idea to thoroughly test all your forms after updating to 5.0+. Be sure to check out the [change log](https://github.com/aldeed/meteor-autoform/blob/master/CHANGELOG.md) for full details.

**Add-on Package Authors**: Please test your package against AutoForm 5.0, and then release an update in which you change your `api.use` to `api.use('aldeed:autoform@4.0.0 || 5.0.0');`

## Table of Contents
<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
**Table of Contents**  *generated with [DocToc](https://github.com/thlorenz/doctoc)*

- [Installation](#installation)
  - [Community Add-On Packages](#community-add-on-packages)
- [Demo](#demo)
- [Example](#example)
  - [A Basic Insert Form](#a-basic-insert-form)
  - [A Basic Update Form](#a-basic-update-form)
  - [A Custom Insert Form](#a-custom-insert-form)
  - [Another Custom Insert Form](#another-custom-insert-form)
- [Component and Helper Reference](#component-and-helper-reference)
  - [autoForm](#autoform)
  - [quickForm](#quickform)
  - [afFieldInput](#affieldinput)
  - [afFieldMessage](#affieldmessage)
  - [afFieldIsInvalid](#affieldisinvalid)
  - [afFormGroup](#afformgroup)
  - [afQuickField](#afquickfield)
    - [afQuickField Examples](#afquickfield-examples)
  - [afFieldValueIs and afFieldValueContains](#affieldvalueis-and-affieldvaluecontains)
  - [afFieldNames](#affieldnames)
  - [afQuickFields](#afquickfields)
- [Objects and Arrays](#objects-and-arrays)
  - [afObjectField](#afobjectfield)
  - [afArrayField](#afarrayfield)
  - [afEachArrayItem](#afeacharrayitem)
  - [afArrayFieldIsFirstVisible and afArrayFieldIsLastVisible](#afarrayfieldisfirstvisible-and-afarrayfieldislastvisible)
- [Form Types](#form-types)
  - [insert](#insert)
  - [update](#update)
  - [update-pushArray](#update-pusharray)
  - [method](#method)
  - [method-update](#method-update)
  - [normal](#normal)
  - [disabled](#disabled)
  - [readonly](#readonly)
- [Public API](#public-api)
- [Non-Collection Forms](#non-collection-forms)
  - [An Example Contact Form](#an-example-contact-form)
- [Fine Tuning Validation](#fine-tuning-validation)
- [Manual Validation](#manual-validation)
- [Resetting Validation](#resetting-validation)
- [The Form Document](#the-form-document)
  - [Getting Current Field Values](#getting-current-field-values)
- [Callbacks/Hooks](#callbackshooks)
  - [formToDoc and docToForm](#formtodoc-and-doctoform)
- [Putting Field Attribute Defaults in the Schema](#putting-field-attribute-defaults-in-the-schema)
- [Complex Schemas](#complex-schemas)
- [Dates](#dates)
  - [type=date](#typedate)
  - [type=datetime](#typedatetime)
  - [type=datetime-local](#typedatetime-local)
- [Theme Templates](#theme-templates)
  - [Using a Different Template](#using-a-different-template)
  - [Creating a Custom Template](#creating-a-custom-template)
- [Defining Custom Input Types](#defining-custom-input-types)
- [Common Questions](#common-questions)
  - [Should the value of `schema` and `collection` have quotation marks around it?](#should-the-value-of-schema-and-collection-have-quotation-marks-around-it)
  - [Which components should I use?](#which-components-should-i-use)
  - [Can I reuse the same `quickForm` or `autoForm` for both inserts and updates?](#can-i-reuse-the-same-quickform-or-autoform-for-both-inserts-and-updates)
  - [How can I show an asterisk after the label for required fields?](#how-can-i-show-an-asterisk-after-the-label-for-required-fields)
  - [What are the various ways I can specify options for a select, radio group, or checkbox group?](#what-are-the-various-ways-i-can-specify-options-for-a-select-radio-group-or-checkbox-group)
    - [Use allowed values array from the schema as both the label and the value](#use-allowed-values-array-from-the-schema-as-both-the-label-and-the-value)
    - [Set options in the schema](#set-options-in-the-schema)
    - [Calculate options in the schema](#calculate-options-in-the-schema)
    - [Use a helper](#use-a-helper)
  - [Can I put HTML in my error messages?](#can-i-put-html-in-my-error-messages)
- [Examples](#examples)
- [Troubleshooting](#troubleshooting)
- [Contributing](#contributing)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## Installation

In a Meteor app directory, enter:

```
$ meteor add aldeed:autoform
```

### Community Add-On Packages

*Submit a pull request to add your package to this list!*

#### Custom Input Types

Dates and times:

* [aldeed:autoform-bs-datepicker](https://atmospherejs.com/aldeed/autoform-bs-datepicker)
* [aldeed:autoform-bs-datetimepicker](https://atmospherejs.com/aldeed/autoform-bs-datetimepicker)
* [miguelalarcos:afwrap-xdatetime](https://atmospherejs.com/miguelalarcos/afwrap-xdatetime)
* [notorii:autoform-datetimepicker](https://atmospherejs.com/notorii/autoform-datetimepicker)
* [lukemadera:autoform-pikaday](https://atmospherejs.com/lukemadera/autoform-pikaday)
* [antalakas:autoform-bs-daterangepicker](https://atmospherejs.com/antalakas/autoform-bs-daterangepicker)
* [drewy:autoform-datetimepicker](https://atmospherejs.com/drewy/autoform-datetimepicker)
* [bookmd:autoform-time-from-now](https://atmospherejs.com/bookmd/autoform-time-from-now)

Selects:

* [aldeed:autoform-select2](https://atmospherejs.com/aldeed/autoform-select2)
* [aldeed:autoform-bs-button-group-input](https://atmospherejs.com/aldeed/autoform-bs-button-group-input)
* [comerc:autoform-selectize](https://atmospherejs.com/comerc/autoform-selectize)
* [vazco:universe-autoform-select](https://atmospherejs.com/vazco/universe-autoform-select)
* [lukemadera:autoform-autocomplete](https://atmospherejs.com/lukemadera/autoform-autocomplete)

WYSIWYGs:

* [mpowaga:autoform-summernote](https://atmospherejs.com/mpowaga/autoform-summernote)
* [donchess:autoform-froala](https://atmospherejs.com/donchess/autoform-froala)
* [vimes1984:autoform-textangular](https://atmospherejs.com/vimes1984/autoform-textangular)

Markdowns:

* [q42:autoform-markdown](https://atmospherejs.com/q42/autoform-markdown)

Autocompletes:

* [comerc:autoform-placecomplete](https://atmospherejs.com/comerc/autoform-placecomplete)
* [miguelalarcos:afwrap-xautocomplete](https://atmospherejs.com/miguelalarcos/afwrap-xautocomplete)
* [comerc:autoform-typeahead](https://atmospherejs.com/comerc/autoform-typeahead)
* [lukemadera:autoform-googleplace](https://atmospherejs.com/lukemadera/autoform-googleplace)
* [lukemadera:autoform-autocomplete](https://atmospherejs.com/lukemadera/autoform-autocomplete)

Files:

* [cfs:autoform](https://atmospherejs.com/cfs/autoform)
* [yogiben:autoform-file](https://atmospherejs.com/yogiben/autoform-file)
* [naxio:autoform-file](https://atmospherejs.com/naxio/autoform-file)
* [elevatedevdesign:autoform-slingshot](https://github.com/ElevateDev/meteor-autoform-slingshot)

Maps:

* [yogiben:autoform-map](https://atmospherejs.com/yogiben/autoform-map)

Ranges/Sliders:

* [elevatedevdesign:autoform-nouislider](https://github.com/ElevateDev/meteor-autoform-nouislider)

Payments

* [elevatedevdesign:autoform-jquery-payments](https://github.com/ElevateDev/meteor-autoform-jquery-payments)

Other:

* [comerc:autoform-contenteditable2](https://atmospherejs.com/comerc/autoform-contenteditable2)
* [hausor:autoform-bs-minicolors](https://atmospherejs.com/hausor/autoform-bs-minicolors)

#### Themes

* [meteoric:autoform-ionic](https://github.com/meteoric/autoform-ionic)
* [fabienb4:autoform-semantic-ui](https://atmospherejs.com/fabienb4/autoform-semantic-ui)
* [gildaspk:autoform-materialize](https://atmospherejs.com/gildaspk/autoform-materialize)
* [poetic:react-autoform-material-ui](https://atmospherejs.com/poetic/react-autoform-material-ui)

#### Admin Panels

* [yogiben:admin](https://atmospherejs.com/yogiben/admin)
* [kaoskeya:admin](https://atmospherejs.com/kaoskeya/admin)
* [vimes1984:foundation-angular-admin](https://atmospherejs.com/vimes1984/foundation-angular-admin)
* [tooit:content-types](https://github.com/tooit/meteor-content-types)

#### Content Management Systems

* [orionjs:core](https://atmospherejs.com/orionjs)

#### Components

* [comerc:autoform-bs-more](https://atmospherejs.com/comerc/autoform-bs-more)
* [forwarder:autoform-wizard](https://atmospherejs.com/forwarder/autoform-wizard)
* [planifica:wizard](https://atmospherejs.com/planifica/wizard)
* [yogiben:autoform-modals](https://atmospherejs.com/yogiben/autoform-modals)

#### Other

* [comerc:autoform-fixtures](https://github.com/comerc/meteor-autoform-fixtures/)
* [tooit:content-types](https://atmospherejs.com/tooit/content-types)
* [tooit:content-types-bootstrap3](https://atmospherejs.com/tooit/content-types-bootstrap3)

## Demo

[Live](http://autoform.meteor.com)

[Source](https://github.com/aldeed/autoform-demo)

## Example

Let's say you have the following Mongo.Collection instance, with schema support
provided by the collection2 package. (Adding `autoform` to your app does not add
`collection2` by default so you need to run `meteor add aldeed:collection2` for this example
to work.)

```js
Books = new Mongo.Collection("books");
Books.attachSchema(new SimpleSchema({
  title: {
    type: String,
    label: "Title",
    max: 200
  },
  author: {
    type: String,
    label: "Author"
  },
  copies: {
    type: Number,
    label: "Number of copies",
    min: 0
  },
  lastCheckedOut: {
    type: Date,
    label: "Last date this book was checked out",
    optional: true
  },
  summary: {
    type: String,
    label: "Brief summary",
    optional: true,
    max: 1000
  }
}));
```

*Be sure to define proper insert security for untrusted code if you've removed the `insecure` package. Call allow/deny or use [ongoworks:security](https://atmospherejs.com/ongoworks/security).*

### A Basic Insert Form

```html
<template name="insertBookForm">
  {{> quickForm collection="Books" id="insertBookForm" type="insert"}}
</template>
```

That's it! This gives you:

* An autogenerated form that uses bootstrap3 classes.
* Appropriate HTML5 fields for all keys in the "Books" collection schema.
* A submit button that gathers the entered values and inserts them into
the "Books" collection.
* Form validation based on the schema attached to the "Books" collection. By default the form
is validated when the user submits. If anything is invalid, the form is
continually re-validated on keyup (throttled) as the user fixes the issues.
* Default validation error messages that appear under the fields, and can be
customized and translated.

### A Basic Update Form

An update form is similar to an insert form, except you need to provide the
document with the original values to be updated:

```html
<template name="updateBookForm">
  {{> quickForm collection="Books" doc=this id="updateBookForm" type="update"}}
</template>
```

This example uses `doc=this`, assuming that you use something like iron:router's `data` function to set the template's data context to the book document. This is a common way to do it, but you could also use a helper function that returns the document.

*Be sure to define proper update security for untrusted code if you've removed the `insecure` package. Call allow/deny or use [ongoworks:security](https://atmospherejs.com/ongoworks/security).*

### A Custom Insert Form

If you want to customize autogenerated forms for *all* forms, you can easily
do so by writing your own templates. Refer to the templates section. However,
sometimes a certain form has a complex schema or unique UI requirements, in
which case you can use `autoForm` rather than `quickForm`, allowing you to
define fields individually.

Here's an example:

```html
<template name="insertBookForm">
  {{#autoForm collection="Books" id="insertBookForm" type="insert"}}
    <fieldset>
      <legend>Add a Book</legend>
      {{> afQuickField name='title'}}
      {{> afQuickField name='author'}}
      {{> afQuickField name='summary' rows=6}}
      {{> afQuickField name='copies'}}
      {{> afQuickField name='lastCheckedOut'}}
    </fieldset>
    <button type="submit" class="btn btn-primary">Insert</button>
  {{/autoForm}}
</template>
```

In this example, we added `rows=6` to the "summary" field, which will cause it
to be rendered as a `textarea` instead of a normal text input field.

### Another Custom Insert Form

In the previous example of a custom insert form, we saw how `afQuickField` can
be used to render a field with simple customizations. Now let's say we need to
fully customize one of the fields. To do this, you can use the following more
specific templates and helpers:

* afFieldIsInvalid
* afFieldInput
* afFieldMessage

Here's an example:

```html
<template name="insertBookForm">
  {{#autoForm collection="Books" id="insertBookForm" type="insert"}}
  <fieldset>
    <legend>Add a Book</legend>
    {{> afQuickField name='title'}}
    {{> afQuickField name='author'}}
    {{> afQuickField name='summary' rows=6}}
    {{> afQuickField name='copies'}}
    {{> afQuickField name='lastCheckedOut'}}
    <div class="form-group{{#if afFieldIsInvalid name='cost'}} has-error{{/if}}">
      <div class="input-group">
        <span class="input-group-addon">$</span>
        {{> afFieldInput name='cost'}}
        <span class="input-group-addon">/each</span>
      </div>
      {{#if afFieldIsInvalid name='cost'}}
      <span class="help-block">{{afFieldMessage name='cost'}}</span>
      {{/if}}
    </div>
  </fieldset>
  <button type="submit" class="btn btn-primary">Insert</button>
  {{/autoForm}}
</template>
```

We added a `cost` field to our form and customized it to display as an input
group with add-ons.

## Component and Helper Reference

NOTE: The `afDeleteButton` component that used to be part of autoform is now available as [a separate package](https://github.com/aldeed/meteor-delete-button).

### autoForm

Use this component as a block instead of `<form>` elements to wrap your form and
gain all the advantages of the autoform package.

The following attributes are recognized:

* `collection`: Required if `schema` is not set. Set to one of the following:
    * The name of a helper function (no quotation marks) that returns an
instance of `Mongo.Collection` that has a schema defined.
    * The name (in quotation marks) of a `Mongo.Collection` instance that has
a schema defined and is in the `window` namespace.
* `schema`: Required if `collection` is not set. This schema will be used to generate
and validate the form prior to submission, so you can specify this along with a
`collection` if you want to use a schema that is slightly different from
the one your collection uses. However, the final object will still have to pass
validation against the collection schema. Set to one of the following:
    * The name of a helper function (no quotation marks) that returns an
instance of `SimpleSchema`.
    * The name (in quotation marks) of a `SimpleSchema` instance that is in
the `window` namespace.
* `id`: Required. This is used as the `id` attribute on the rendered `form`
element, so it must be unique within your entire application. It's required
because we use it to set up a form-specific validation context and to preserve
input values when a "hot code push" happens.
* `doc`: Required for an update form, and must have at least an `_id` property. Pass the current document
object, retrieved with a call to `findOne()` for example. For an insert form,
you can also use this attribute to pass an object that has default form values
set (the same effect as setting a `value` attribute on each field within the form).
* `validation`: Optional. See the "Fine Tuning Validation" section.
* `template`: Optional. See the "Templates" section.
* `type`: Optional. The form type. Default if not provided is "normal". See [Form Types](#form-types).
* `meteormethod`: Optional. When `type` is "method" or "method-update", indicate the name of the
Meteor method in this attribute.
* `ddp`: Optional. When `type` is "method" or "method-update", provide an alternative DDP Connection that should be used to call the Meteor method in this attribute.
* `resetOnSuccess`: Optional. The form is automatically reset
for you after a successful submission action. You can skip this by setting this
attribute to `false`.
* `autosave`: Optional. Set to `true` to enable automatic form submission for a `type="update"` form. Whenever the `form change` event is emitted, the change will be automatically saved to the database.
* `autosaveOnKeyup`: Optional. Set to `true` to enable automatic form submission for a `type="update` form on `keyup` event. Whenever a `keyup` event is emitted on a form field, the change will be automatically saved to the database (throttled to 500ms). **It's best to set `trimStrings=false` when using this option. If you don't, spaces may be deleted while typing.**
* `filter`: Optional. Set to `false` for an insert or update form to skip filtering out unknown properties when cleaning the form document.
* `autoConvert`: Optional. Set to `false` for an insert or update form to skip autoconverting property values when cleaning the form document.
* `removeEmptyStrings`: Optional. Set to `false` for an insert or update form to keep empty string values when cleaning the form document.
* `trimStrings`: Optional. Set to `false` for an insert or update form to keep leading and trailing spaces for string values when cleaning the form document.
* `setArrayItems`: Optional. Set to `true` for an update form that is updating specific array items. Note that there is a quirk of MongoDB that will create objects instead of arrays when this is set to `true`, if there is not already an array in the database. So if you set this to `true`, be sure that the corresponding array property is never `null` or missing in the database. It must always be an array with 0 or more items.
* `preserveForm`: Optional. Set to `false` to disable preserving of form values across hot refreshes. This can sometimes help resolve issues with sticky form values.
* Any additional attributes are passed along to the `<form>` element, meaning that you can add classes, etc. When providing a boolean attribute, set it to `true` (no quotation marks) or a helper that returns `true`.

### quickForm

Use this component to generate an entire form in one line. It takes and requires
all the same attributes as `autoForm`. In addition, it recognizes the following
attributes:

* `type`: Two additional type values are supported: "readonly" and "disabled".
* `buttonClasses`: Set the class attribute for the rendered submit button. Some templates may provide a default class if you don't set this.
* `buttonContent`: The submit button content. If you don't set this, "Submit" is used. If you set this to `false`, no submit button is rendered.
* `fields`: Optional. Bind an array or specify a comma-delimited string of field
names to include. Only the listed fields (and their subfields, if any) will be
included, and they'll appear in the order you specify.
* `omitFields`: Optional. Bind an array or specify a comma-delimited string of field
names to omit from the generated form. All first-level schema fields *except* the
fields listed here (and their subfields, if any) will be included.

Any other attributes you specify will be output as attributes of the `<form>` element, just like when using the `autoForm` component. When providing a boolean attribute, set it to `true` (no quotation marks) or a helper that returns `true`.

See [this demo](http://autoform.meteor.com/qfdetails) for examples of what happens when you specify various types of fields in the `fields` or `omitFields` attributes.

### afFieldInput

Renders an input control for the field. The type of control depends on what you set the `type` attribute to. All of the HTML5 input types plus a few more are built in. Here is the full list of included input types:

* boolean-checkbox
* boolean-radios
* boolean-select
* button
* color
* contenteditable
* date
* datetime
* datetime-local
* email
* file
* hidden
* image
* month
* number
* password
* radio
* range
* reset
* search
* select
* select-checkbox
* select-checkbox-inline
* select-multiple
* select-radio
* select-radio-inline
* submit
* tel
* text
* textarea
* time
* url
* week

There are add-on packages that provide additional input types (widgets, UI controls).

If you don't include a `type` attribute, the following logic is used to automatically select an appropriate type:

* If you supply the `options` attribute, a `select` input is used. If your schema expects an array for the field, then it is a `select-multiple` input. If you prefer radios or checkboxes (for example, if it is a short list of options), then add `noselect=true` attribute or simply set the `type` to `select-checkbox`, `select-checkbox-inline`, `select-radio`, or `select-radio-inline`.
* Otherwise if the schema type is `String` and you include the `rows` attribute, a `textarea` is used.
* Otherwise if the schema type is `Number`, a `number` type is used.
* Otherwise if the schema type is `Date`, a `date` type is used.
* Otherwise if the schema type is `Boolean`, the `boolean-checkbox` type is used. You may want to specify a `type` of `boolean-radios` or `boolean-select` instead. If you do so, use the `trueLabel`, `falseLabel`, and `nullLabel` attributes to set the labels used in the radio or select control.
* Otherwise a `text` type is used.

The following attributes are recognized:

* `name`: Required. The name of the schema key this field is for.
* `template` (default="bootstrap3"): Specify the name of a different built-in or
custom theme template to use.
* `options`: An array of options objects (see below). By specifying options, you cause the generated DOM
element to be a `select` element with these options, unless you also use
`noselect`. To use the `allowedValues` from the schema as the options, set
`options="allowed"`. To specify a label to be displayed when there is no
option selected, set `firstOption="(My Select One Label)"`.
* `firstOption`: Use with the `options` attribute to specify a string to use for the first option of a `select` input, which shows when nothing has been selected yet. For example, `firstOption="(You Should Really Pick Something From This List)"`. There is a default first option "(Select One)". If you don't want any default option, then do `firstOption=false`, but make sure your `select` input has a default `value` or this will result in a confusing UX where it looks like the first option is selected but it isn't.
* `capitalize`: Used only when you've set `options="allowed"`. Set this to `true`
to capitalize the labels generated from `allowedValues`.
* `noselect`: Use in conjunction with `options` attribute. Set this attribute
to `true` to render radios or checkboxes for the `options` instead of `select`.
* `trueLabel`: Set to the string that should be used as the label for the `true`
option for an input with type `boolean-select` or `boolean-radios`.
* `falseLabel`: Set to the string that should be used as the label for the `false`
option for an input with type `boolean-select` or `boolean-radios`.
* `nullLabel`: Set to the string that should be used as the label for the empty value option for an input with type `boolean-select` or `boolean-radios`.
* `value`: Set a specific, potentially reactive, value for the input. If you have also provided a `doc` attribute on the `autoForm` or `quickForm`, this value will override the value from the `doc` object.
* `defaultValue`: Set a reactive default value for the input. If you have also provided a `doc` attribute on the `autoForm` or `quickForm`, this value will be used only when the `doc` object has no value for this field. This takes precedence over the `defaultValue` property of the field's schema. (Also, `defaultValue` from the schema is slightly different in that it is never used if you provide a `doc` attribute.)
*  Any additional attributes are passed along to the generated DOM element, meaning that you can add `class`, etc. When providing a boolean attribute, set it to `true` (no quotation marks) or a helper that returns `true`.
* `placeholder`: As with other attributes, this will be passed along to the
generated DOM element, but you can also optionally do
`placeholder="schemaLabel"` to use the field label defined in the schema as
the input's placeholder value.
* Each individual input type might accept and use additional attributes.

Here's an example of passing `options` to generate a `select` field:

*html:*

```html
{{> afFieldInput name="year" options=yearOptions}}
```

*client.js:*

```js
Template.registerHelper("yearOptions", function() {
    return [
        {label: "2013", value: 2013},
        {label: "2014", value: 2014},
        {label: "2015", value: 2015}
    ];
});
```

Alternatively, you can specify options as an object with {value: label} format. Values are coerced into the expected type.

```js
Template.registerHelper("yearOptions", function() {
    return {
      2013: "2013",
      2014: "2014",
      2015: "2015"
    };
});
```

You can also mix in optgroups. See [the demo](http://autoform.meteor.com/select).

### afFieldMessage

Accepts and requires just one attribute, `name`, which is the name of the schema key.

Outputs the user-friendly invalid reason message for the specified property, or
an empty string if the property is valid. This value updates reactively whenever
validation is performed. Refer to
[the SimpleSchema documentation](https://github.com/aldeed/meteor-simple-schema#customizing-validation-messages)
for information on customizing the messages.

### afFieldIsInvalid

Accepts and requires just one attribute, `name`, which is the name of the schema key.

Returns `true` if the specified key is currently invalid. This value updates
reactively whenever validation is performed.

### afFormGroup

Just as `quickForm` renders a form in one line, `afFormGroup` renders a form
group, that is, everything related to a single field -- the label, the input,
and the error message -- in one line.

This component accepts the same attributes as `afFieldInput`.
Attributes that are prefixed with `formgroup-` become attributes on the `div`
element, which contains the label and the field. Attributes that are prefixed
with `label-` become attributes on the rendered `label` element while any
remaining attributes are forwarded to the `afFieldInput` component. You can
also set `label=false` to omit the `label` element or set `label` to a
string to use that text as the label text.

### afQuickField

The `afQuickField` component is a helper component that decides whether a particular key should be rendered using `afArrayField`, `afObjectField`, or `afFormGroup`, and then forwards all your attributes to the chosen component.

* When you use the `afQuickField` component for a field that is an `Object`, it is rendered using the `afObjectField` component unless you override the `type` or supply `options`.
* When you use the `afQuickField` component for a field that is an `Array`, it is rendered using the `afArrayField` component unless you override the `type` or supply `options`.
* All other keys are rendered using the `afFormGroup` component.

Refer to the "Objects and Arrays" section for additional information.

#### afQuickField Examples

```html
{{> afQuickField name='firstField' autofocus=''}}
{{> afQuickField name='weirdColors' style="color: orange" label-style="color: green"}}
{{> afQuickField name="longString" rows=5}}
{{> afQuickField name="radioBoolean" type="boolean-radios" trueLabel="Yes" falseLabel="No"}}
{{> afQuickField name="selectBoolean" type="boolean-select" trueLabel="Yes" falseLabel="No"}}
{{> afQuickField name="optionsButNoSelect" options=numSelectOptions noselect="true"}}
{{> afQuickField name="firstOptionSelect" firstOption="(Select Something)" options=numSelectOptions}}
{{> afQuickField name="decimal" step="0.01"}}
```

### afFieldValueIs and afFieldValueContains

Use this helper with `#if` to dynamically show and hide sections of a form based on the current value of any non-array field on the form.

See [the demo](http://autoform.meteor.com/fieldvalues)

### afFieldNames

Use with `#each` to loop through all the field names for the form's schema or for an object field.

The following is roughly equivalent to a `quickForm`:

```html
{{#autoForm}}
  {{#each afFieldNames}}
    {{> afQuickField name=this.name options=afOptionsFromSchema}}
  {{/each}}
{{/autoForm}}
```

Or you can provide a `name` attribute for an object field:

```html
{{#autoForm}}
  {{#each afFieldNames name="profile"}}
    {{> afQuickField name=this.name options=afOptionsFromSchema}}
  {{/each}}
{{/autoForm}}
```

You can optionally pass `fields` or `omitFields` attributes to `afFieldNames`.

### afQuickFields

Render an `afQuickField` for each field in the form schema or an object field.

```html
{{#autoForm}}
  {{! These do the same thing}}
  {{#each afFieldNames name="profile"}}
    {{> afQuickField name=this.name options=afOptionsFromSchema}}
  {{/each}}
  {{> afQuickFields name="profile"}}
{{/autoForm}}
```

You can optionally pass `fields` or `omitFields` attributes to `afQuickFields`.

## Objects and Arrays

Fields with type `Object` or `Array` are treated specially.

### afObjectField

When you use the `afQuickField` component for a field that is an `Object`, it is rendered using the `afObjectField` component unless you override the type or specify options. This happens by default when you use a `quickForm` for a schema that has a field of type `Object`.

The `afObjectField` component renders all of an object field's subfields together as one group. The group is labeled with the name of the object field. The actual visual representation of the group will vary based on which theme template you use. For the "bootstrap3" default template, the group appears in a panel with a heading.

### afArrayField

When you use the `afQuickField` component for a field that is an `Array`, it is rendered using the `afArrayField` component unless you override the type or specify options. This happens by default when you use a `quickForm` for a schema that has a field of type `Array`.

The `afArrayField` component renders all of an array field's array items together as one group. The group is labeled with the name of the array field. The actual visual representation of the group will vary based on which theme template you use. For the "bootstrap3" default template, the group appears in a panel with a heading.

Additionally, buttons for adding and removing array items are automatically added to the UI. This is also done by the template, which means that you can easily make your own "afArrayField" template if you don't like the default appearance of the add/remove buttons.

An `afArrayField` (or an `afQuickField` for an array) supports the additional attributes `minCount` and `maxCount`. Normally, by default, you cannot remove items below the schema-defined `minCount` and you cannot add items above the schema-defined `maxCount`. However, sometimes you don't want a minimum or maximum count defined in the schema, but you *do* want to limit the number of items on a certain form. To do this, use the `minCount` and `maxCount` attributes. Note, however, that you may *not* override the `minCount` to be less than the schema-defined `minCount`, and you may not override the `maxCount` to be more than the schema-defined `maxCount`.

An `afArrayField` (or an `afQuickField` for an array) also supports the `initialCount` attribute. Use it to override the default initial count to be something other than 1, including 0. Note that `minCount` will still always take precedence. That is, if the `minCount` is 1 and you specify `initialCount=0`, the initial count will be 1.

To specify options for each item in the array you can set
```
'arrayFieldName.$': {
  ...
  autoform: {
    afFieldInput: {
      options: function () {
        //return options object
      }
    }
  }
}
```

At the moment, the add and remove buttons disappear when you can't use them. This could be changed to make them disabled. You can do this yourself with a custom template, but if you have thoughts about how it should work out of the box, submit an issue to discuss.

### afEachArrayItem

This is a block helper that can be used to render specific content for each item in an array. It tracks the addition and removal of array item fields (or groups of fields) reactively for you. This allows you to customize the repeated array fields, removal buttons, etc. It's generally most useful within a custom `afArrayField` template. See the built-in `afArrayField` templates for example usage.

`afEachArrayItem` supports the same attributes as `afArrayField`.

### afArrayFieldIsFirstVisible and afArrayFieldIsLastVisible

These helpers must be used within an `afEachArrayItem` block and will return `true` or `false` depending on whether the current item/field in the array is the first or last visible item, respectively.

## Form Types

Depending on the `type` attribute you specify on your `quickForm` or `autoForm`, your form will have different behavior when rendering, validating, and submitting. The following form types are built in to the package, but you may also define your own.

### insert

Generates a document and inserts it on the client. You must provide a `collection` attribute referencing the `Mongo.Collection` instance. If the collection has an attached schema, it will be used for validation. If you provide a `schema` attribute, that schema will be used for validation, but the document must validate against the collection's schema, too.

### update

Updates a document on the client. You must provide a `collection` attribute referencing the `Mongo.Collection` instance. If the collection has an attached schema, it will be used for validation. If you provide a `schema` attribute, that schema will be used for validation, but the document must validate against the collection's schema, too.

The form will generate and validate an update modifier. You must specify a `doc` attribute referencing the current document, which must have an `_id` property. Any properties present in `doc` will be used as the default values in the form fields.

### update-pushArray

Updates a document on the client by adding the form document to an array within the larger document. You must provide a `collection` attribute referencing the `Mongo.Collection` instance. If the collection has an attached schema, it will be modified to be scoped appropriately and that new schema will be used for validation. If you provide a `schema` attribute, that schema will be used for validation, but the document must validate against the collection's schema, too.

You can think of this as an insert form for subdocuments. It generates and validates a document instead of a modifier, pretending that the array item schema is the full schema. Then it performs an update operation that does a `$push` of that document into the array.

Use the `scope` attribute on your form to define the array field into which the resulting document should be pushed. For example, `scope="employees"` or `scope="employees.0.addresses"`.

### method

Will call the server method with the name you specify in the `meteormethod` attribute. Passes a single argument, `doc`, which is the document resulting from the form submission.

You may optionally specify a DDP Connection in the `ddp` attribute. If you do, the method will be called using the DDP connection provided.

The method is not called until `doc` is valid on the client.

**You must call `check()` in the method or perform your own validation since a user could bypass the client side validation.**

### method-update

Will call the server method with the name you specify in the `meteormethod` attribute.

There are two possible ways your method can be called.

1. By default, your method will be called with two arguments:
  * `modifier`: the modifier object generated from the form values
  * `documentId`: the `_id` of the document being updated
2. If you set `singleMethodArgument=true` as a form attribute, your method will be called with a single object argument with `_id` and `modifier` properties. You should do this if using the [mdg:validated-method](https://github.com/meteor/validated-method) package.

You may optionally specify a DDP Connection in the `ddp` attribute. If you do, the method will be called using the DDP connection provided.

The method is not called until `modifier` is valid on the client.

**You must call `check()` in the method or perform your own validation since a user could bypass the client side validation. Using the [mdg:validated-method](https://github.com/meteor/validated-method) package is recommended.**

### normal

Will call any `onSubmit` hooks you define, where you can do custom submission logic. If `onSubmit` does not return false or call `this.event.preventDefault()`, the browser will also submit the form. This means that you can use AutoForm to generate and validate a form but still have it POST normally to an HTTP endpoint.

Example:

```js
AutoForm.hooks({
  contactForm: {
    onSubmit: function (insertDoc, updateDoc, currentDoc) {
      if (customHandler(insertDoc)) {
        this.done();
      } else {
        this.done(new Error("Submission failed"));
      }
      return false;
    }
  }
});
```

The arguments passed to your `onSubmit` hook are as follows:

* `insertDoc`: The form input values in a document, suitable for use with insert().
This object has been cleaned and validated, but auto values and default values
have not been added to it.
* `updateDoc`: The form input values in a modifier, suitable for use with update().
This object has *not* been validated.
* `currentDoc`: The object that's currently bound to the form through the `doc` attribute

In addition to the normal `this` hook context, there is a `this.done()` method, which you *must* call when you are done with your custom client submission logic. This allows you to do asynchronous tasks if necessary. You may optionally pass one argument. If you pass an `Error` object, then any `onError` hooks will be called; otherwise, any `onSuccess` hooks will be called.

If you return `false`, no further submission will happen, and it is equivalent
to calling `this.event.preventDefault()` and `this.event.stopPropagation()`. If you return anything other than `false`, the browser will submit the form.

If you use `autoValue` or `defaultValue` options, be aware that `insertDoc` and
`updateDoc` will not yet have auto or default values added to them. If you're
passing them to `insert` or `update` on a Mongo.Collection with a schema, then
there's nothing to worry about. But if you're doing something else with the
object on the client, then you might want to call `clean` to add the auto and
default values:

```js
AutoForm.hooks({
  peopleForm: {
    onSubmit: function (doc) {
      PeopleSchema.clean(doc);
      console.log("People doc with auto values", doc);
      this.done();
      return false;
    }
  }
});
```

If you're sending the objects to the server in any way, it's always best to
wait to call `clean` until you're on the server so that the auto values can be
trusted.

### disabled

All inputs will be disabled. Nothing happens when submitting.

### readonly

All inputs will be read-only. Nothing happens when submitting.

## Public API

For the full public API available on the `AutoForm` object, refer to the [API documentation](https://github.com/aldeed/meteor-autoform/blob/master/api.md).

## Non-Collection Forms

If you want to use an AutoForm for a form that does not relate to a collection
(like a simple contact form that sends an e-mail), or for a form that relates
to a collection that is schemaless (for example, Meteor.users()), you can do that.

1. In client+server code, create a `SimpleSchema` instance to define the form's schema.
2. Use the `SimpleSchema` instance as the `schema` attribute of `autoForm` or `quickForm`.
3. Set up the form to be submitted properly. There are three ways to handle this:
    * Define an `onSubmit` hook for the form. Put your logic in that function and have it return `false` to prevent normal form submission.
    * Add normal form attributes like `action` and let the form do a normal browser POST after being validated.
    * Define a server method that does something with the form data. On your `autoForm` or `quickForm` set `type="method"` and `meteormethod="yourServerMethodName"`.

When you use the third option, a server method, the form data will be gathered
into a single object when the user clicks the submit button. Then that object
will be cleaned and validated against the schema on the client and passed along
to your method on the server. **You must
validate it again in your method on the server, using `check()` in combination
with `myAutoFormSchema`. This is why we create the `SimpleSchema` instance
in client+server code.**

It's also generally best to call `myAutoFormSchema.clean` for the object again
in the server method. In particular, you will definitely want to do this if
the object's schema has auto or default values so that they can be added
securely and accurately on the server.

### An Example Contact Form

*common.js:*

```js
Schema = {};
Schema.contact = new SimpleSchema({
    name: {
        type: String,
        label: "Your name",
        max: 50
    },
    email: {
        type: String,
        regEx: SimpleSchema.RegEx.Email,
        label: "E-mail address"
    },
    message: {
        type: String,
        label: "Message",
        max: 1000
    }
});
```

Note that we've created an object `Schema` in which to store all of our app's schemas.

*html:*

```html
<template name="contactForm">
  {{#autoForm schema=contactFormSchema id="contactForm" type="method" meteormethod="sendEmail"}}
  <fieldset>
    <legend>Contact Us</legend>
    {{> afQuickField name="name"}}
    {{> afQuickField name="email"}}
    {{> afQuickField name="message" rows=10}}
    <div>
      <button type="submit" class="btn btn-primary">Submit</button>
      <button type="reset" class="btn btn-default">Reset</button>
    </div>
  </fieldset>
  {{/autoForm}}
</template>
```

*client.js*

```js
Template.contactForm.helpers({
  contactFormSchema: function() {
    return Schema.contact;
  }
});
```

*server.js*

```js
Meteor.methods({
  sendEmail: function(doc) {
    // Important server-side check for security and data integrity
    check(doc, Schema.contact);

    // Build the e-mail text
    var text = "Name: " + doc.name + "\n\n"
            + "Email: " + doc.email + "\n\n\n\n"
            + doc.message;

    this.unblock();

    // Send the e-mail
    Email.send({
        to: "test@example.com",
        from: doc.email,
        subject: "Website Contact Form - Message From " + doc.name,
        text: text
    });
  }
});
```

Note the call to `check()`, which will throw an error if doc doesn't
match the schema. **To reiterate, you must call `check()` in the method or perform your
own validation since a user could bypass the client side validation.** You do
not have to do any of your own validation with collection inserts or updates,
but you do have to call `check()` on the server when submitting to a Meteor method.

## Fine Tuning Validation

To control when and how fields should be validated, use the `validation`
attribute on `autoform` or `quickForm`. Supported values are:

* `none`: Do not validate any form fields at any time.
* `submit`: Validate all form fields only when the form is submitted.
* `keyup`: Validate each form field on every key press and when the user moves
the cursor off it (throttled to run at most once every 300 milliseconds). Also
validate all fields again when the form is submitted.
* `blur`: Validate each form field when the user moves the cursor off it
(throttled to run at most once every 300 milliseconds). Also validate all
fields again when the form is submitted.
* `submitThenKeyup`: __(Default)__ At first acts like the `submit` option, but after the
user attempts to submit the form and it fails validation, subsequently acts
like `keyup`.
* `submitThenBlur`: At first acts like the `submit` option, but after the
user attempts to submit the form and it fails validation, subsequently acts
like `blur`.
* `browser`: Let the browser handle validation, if supported.

__Notes:__

* For all values except "browser", the `novalidate="novalidate"` attribute
is automatically added to the rendered form.
* If you choose `keyup` validation, there is sometimes a bug in Safari where
the autofill mechanism will cause the text in the input to be selected after
each keypress. This has the effect of making it near impossible to
actually type anything because you keep "overwriting" your input. To fix this,
simply add the `autocomplete="off"` attribute to your input fields.

## Manual Validation

In addition to telling your form to validate on certain events, sometimes you
need to manually validate.

* To validate a particular field, call `AutoForm.validateField(formId, fieldName, skipEmpty)`. It returns `true` or `false` depending on the validity of the field's current value, and it also causes reactive display of any errors for that field in the UI.
* To validate a form, call `AutoForm.validateForm(formId)`. It returns `true` or `false` depending on the validity
of the current values in the entire form, and it also causes reactive display of any errors for that form in the UI.

## Resetting Validation

After a successful submission, validation is reset, ensuring that any error
messages disappear and form input values are correct. However, you may need
to reset validation for other reasons, such as when you reuse an edit form to
edit a different document. To do this, call `AutoForm.resetForm(formId)`.

## The Form Document

When the user submits an autoForm, an object that contains all of the form
data is automatically generated. If the submission action is insert or a
method call, this is a normal document object. If the submission action is
update, this is a mongo modifier with `$set` and potentially `$unset` objects.
In most cases, the object will be perfect for your needs. However, you might
find that you want to modify the object in some way. For example, you might
want to add the current user's ID to a document before it is inserted. You can
use "before", "formToDoc", or "formToModifier" hooks to do this.

### Getting Current Field Values

You can get the current values of all fields on a form at any time by passing the form `id`
to [AutoForm.getFormValues](https://github.com/aldeed/meteor-autoform/blob/master/api.md#autoformgetformvaluesformidclient). This method is *not* reactive. The form must be
currently rendered for this to work.

You can get the current value of a specific field on a specific form by passing the field name to [AutoForm.getFieldValue](https://github.com/aldeed/meteor-autoform/blob/master/api.md#autoformgetformvaluesformidclient). This method *is* reactive so it can be used in place of the built-in `afFieldValueIs` helper to show pieces of a form based on
custom criteria about the values of other fields on the form. If using outside of the autoForm, pass the `formId` as the second argument.

## Callbacks/Hooks

To add client-side hooks and callbacks for a form, use the `AutoForm.hooks` or `AutoForm.addHooks` method. The syntax for `AutoForm.hooks` is

```js
AutoForm.hooks({
  myFormId: hooksObject
});
```

If you want to add the same hook for multiple forms or for all forms, use the
`AutoForm.addHooks` method instead:

```js
// Pass an array of form IDs for multiple forms
AutoForm.addHooks(['form1', 'form2', 'form3', 'form4'], hooksObject);

// Or pass `null` to run the hook for all forms in the app (global hook)
AutoForm.addHooks(null, hooksObject);

// Pass `true` as optional third argument to replace all existing hooks of the same type
AutoForm.addHooks('form1', hooksObject, true);
```

These calls should be anywhere in top-level client code and do not need to be within `Meteor.startup`. You should not put them in an autorun, template rendered function, or anywhere else where they will be called multiple times since that will cause the hooks to run multiple times for a single submission.

In all of the above examples, the hooks object should look like the following. This shows all possible hooks, but your object would have only the hooks that you need:

```js
var hooksObject = {
  before: {
    // Replace `formType` with the form `type` attribute to which this hook applies
    formType: function(doc) {
      // Potentially alter the doc
      doc.foo = 'bar';

      // Then return it or pass it to this.result()
      //return doc; (synchronous)
      //return false; (synchronous, cancel)
      //this.result(doc); (asynchronous)
      //this.result(false); (asynchronous, cancel)
    }
  },

  // The same as the callbacks you would normally provide when calling
  // collection.insert, collection.update, or Meteor.call
  after: {
    // Replace `formType` with the form `type` attribute to which this hook applies
    formType: function(error, result) {}
  },

  // Called when form does not have a `type` attribute
  onSubmit: function(insertDoc, updateDoc, currentDoc) {
    // You must call this.done()!
    //this.done(); // submitted successfully, call onSuccess
    //this.done(new Error('foo')); // failed to submit, call onError with the provided error
    //this.done(null, "foo"); // submitted successfully, call onSuccess with `result` arg set to "foo"
  },

  // Called when any submit operation succeeds
  onSuccess: function(formType, result) {},

  // Called when any submit operation fails
  onError: function(formType, error) {},

  // Called every time an insert or typeless form
  // is revalidated, which can be often if keyup
  // validation is used.
  formToDoc: function(doc) {
    // alter doc
    // return doc;
  },

  // Called every time an update or typeless form
  // is revalidated, which can be often if keyup
  // validation is used.
  formToModifier: function(modifier) {
    // alter modifier
    // return modifier;
  },

  // Called whenever `doc` attribute reactively changes, before values
  // are set in the form fields.
  docToForm: function(doc, ss) {},

  // Called at the beginning and end of submission, respectively.
  // This is the place to disable/enable buttons or the form,
  // show/hide a "Please wait" message, etc. If these hooks are
  // not defined, then by default the submit button is disabled
  // during submission.
  beginSubmit: function() {},
  endSubmit: function() {}
};
```

The following properties and functions are available in all submission hooks when they are called. This does not include formToDoc, formToModifier, or docToForm.

* `this.addStickyValidationError(key, type, [value])`: Calls `AutoForm.addStickyValidationError` for the form
* `this.autoSaveChangedElement`: The input element that was changed to cause this form submission (if the submission was due to autosave)
* `this.collection`: The collection attached to the form (from `collection` attribute)
* `this.currentDoc`: The current document attached to the form (from `doc` attribute)
* `this.docId`: The `_id` attribute of the `doc` attached to the form, if there is one, or for an `type='insert'` form, the `_id` of the newly inserted doc, if one has been inserted.
* `this.event`: The browser submit event
* `this.formAttributes`: The object containing all the form attributes from the `autoForm` or `quickForm`
* `this.formId`: The form's `id` attribute (useful in a global hook)
* `this.insertDoc`: The gathered current form values, as a normal object
* `this.removeStickyValidationError(key)`: Calls `AutoForm.removeStickyValidationError` for the form
* `this.resetForm()`: Call this if you need to reset the form
* `this.ss`: The SimpleSchema instance used for validating the form
* `this.ssIsOverride`: This is `true` if `this.ss` is an override schema, meaning it's coming from a `schema` attribute on the `autoForm` or `quickForm`, but there is also a `collection` attribute pointing to a collection that has its own schema attached.
* `this.template`: The `autoForm` template instance
* `this.updateDoc`: The gathered current form values, as a mongo modifier object suitable for passing to a collection `update` call
* `this.validationContext`: The validation context used for the form. You can use this to check or add (non-sticky) invalid keys.

Notes:

* You can call `hooks` or `addHooks` multiple times. The list of hooks is extended each time you call it, which means that multiple hooks of the same type can run for the same form.
* Hooks will run in the order in which they are added, but all form-specific hooks run before all global hooks.
* The `before` hooks are called after the form is deemed valid but before the submission operation happens. (The submission operation depends on the form type.) These hooks are passed the document or modifier as gathered from the form fields. If necessary they can modify the document or modifier. These functions can perform asynchronous tasks if necessary. If asynchronicity is not needed, simply return the document or modifier, or return `false` to cancel submission. If you don't return anything, then you must call `this.result()` eventually and pass it either the document or modifier, or `false` to cancel submission. *This is run only on the client. Therefore, you should not assume that this will always run since a devious user could skip it.*
* The `after` hooks are similar to the callbacks for `insert` and `update` and method calls. They are passed two arguments: `error` and `result`
* Refer to the next sections for details about the `formToDoc`, `formToModifier`, and `docToForm` hooks.

### formToDoc, formToModifier, and docToForm

Specify `formToDoc`/`formToModifier` and `docToForm` hooks if you need form values in a different format in your form versus in the mongo document. They are mainly useful if you decide to override an input type.

*Unlike document modifications made in "before hooks", modifications made in the
`formToDoc` hooks are made every time the form is validated, which could
happen a couple times per second on the client, depending on validation mode.
The other hooks are run only right before the corresponding submission actions,
as their names imply.*

Here is an example where this feature is used to allow comma-delimited entry in
a text field but store (and validate) the values as an array:

First specify `type: [String]` in the schema. The schema should reflect what you
are actually storing.

*Add a `type` attribute to your `afFieldInput` component:*

```html
{{> afFieldInput name="tags" type="text"}}
```

Then in client code, add the hooks:

```js
AutoForm.hooks({
  postsForm: {
    docToForm: function(doc) {
      if (_.isArray(doc.tags)) {
        doc.tags = doc.tags.join(", ");
      }
      return doc;
    },
    formToDoc: function(doc) {
      if (typeof doc.tags === "string") {
        doc.tags = doc.tags.split(",");
      }
      return doc;
    }
  }
});
```

Note that the `update` and `method-update` forms call `formToModifier` instead of `formToDoc`, and forms without a `type` attribute call both `formToModifier` and `formToDoc`. `formToModifier` is passed a Mongo modifier instead of a document.

## Putting Field Attribute Defaults in the Schema

If you are using the `quickForm`, `afQuickField`, `afFormGroup`, `afObjectField`, or `afArrayField` components, you may find that you want to set an attribute on something generated within those templates. In most cases, you can do this by setting attribute defaults in the corresponding schema definition. Add an `autoform` property to the schema defininition, and set it to an object specifying attribute defaults. For example, to ensure a field is always rendered as a textarea, you could do this:

```js
summary: {
  type: String,
  optional: true,
  max: 2000,
  autoform: {
    rows: 10
  }
}
```

You can also set `autoform.omit` to `true` in the schema definition for a field to prevent it from ever being included in quickForms, afObjectFields, afArrayFields, etc. This is useful for autoValue properties such as `createdAt` that you know you will not want on a form.

You can set the `type` for the field in the `autoform` object in the schema, too.

You can (and in most cases, should) target your attributes to a particular component by nesting them under the component name:

```js
summary: {
  type: String,
  optional: true,
  max: 2000,
  autoform: {
    afFieldInput: {
      type: "textarea",
      rows: 10,
      class: "foo"
    }
  }
}
```

Tip: Any attribute can instead be provided as a function that returns the attribute's value.

You can pass data structures using the `data` property. They will not be used as attributes, instead they will
be available in the field's context. For example:

```js
summary: {
  type: String,
  autoform: {
    afFieldInput: {
      data: {
        someArray: ['apple', 'orange', 'banana'],
        someObj: {
          complex: {
            data: 'structure'
          }
        }
      }
    }
  }
}
```

## Complex Schemas

You can use mongo dot notation to map an input to a subdocument. For example:

* If you use `{{> afFieldInput 'address.street'}}`, whatever is entered in the field will be assigned to `doc.address.street`.
* If you use `{{> afFieldInput 'addresses.1.street'}}`, whatever is entered in the field will be assigned to the `street` property of the object at index 1 in the `doc.addresses` array.

## Dates

By default, a schema field with `type: Date` will generate an input element with
`type=date`. You can override the type on each `afFieldInput` or `afQuickField`
helper if you want to use a `datetime` or `datetime-local` input instead. Here
are some tips for using each input type.

*Consider using the [moment and moment-timezone](http://momentjs.com/) libraries to make this easy.*

### type=date

* **Saving:** The user-entered value must be of the format `YYYY-MM-DD`,
and it will be saved as a `Date` object representing that
exact datetime in the UTC time zone. (Chrome and some mobile browsers provide
date pickers that set the input value to a string in this format automatically,
but users of other browsers will have to manually enter the date in the correct
format.)
* **Loading:** If you are binding an object containing `Date` objects to an update autoform
and using them in an input with `type="date"`, the date that will be used as
the value of the input is the date represented by the `Date` object
in the UTC time zone, with the time portion ignored.
* **Displaying:** To make sure that the date format you use matches what the user
expects, you should construct your display strings based on the `Date` object
in the UTC time zone. Using the `moment` library, you might do something
like this: `moment.utc(myDate).format("LL")`
* **Min/Max:** When specifying min or max values in your schema, use a `Date`
object that represents midnight on the morning of the minimum or maximum date
in the UTC time zone.

### type=datetime

*Note: Using this type of input requires that the user do all the work to convert
from the applicable time zone to the UTC time zone since the entered time is
assumed to be UTC. It's generally better to use datetime-local.*

* **Saving:** The user-entered value must be of the format `date string + "T" +
time string + "Z"`, and it will be saved as a `Date` object representing that
exact datetime in the UTC time zone.
* **Loading:** If you are binding an object containing `Date` objects to an update autoform
and using them in an input with `type="datetime"`, the date that will be used as
the value of the input is the date and time represented by the `Date` object
in the UTC time zone.
* **Displaying:** To make sure that the date format you use matches what the user
expects, you should construct your display strings based on the `Date` object
in the UTC time zone, or indicate on screen which time zone you are displaying.
Using the `moment` library, you might do something like this: `moment.utc(myDate).format("LLLL")`
* **Min/Max:** When specifying min or max values in your schema, use a `Date`
object that represents the exact minimum or maximum date and time
in the UTC time zone.

### type=datetime-local

* **Saving:** If you use an input with `type="datetime-local"`, the datetime string that is entered will be assumed to be in the client's local timezone. To use a different specific timezone, add a `moment-timezone` package to your app and specify a `timezoneId` attribute on the `afFieldInput` or `afFormGroup` helper.
Set this attribute to a timezone ID that moment-timezone understands, such as "America/Los_Angeles". For example, if you use an input with `type="datetime-local"` in a form
in which a user is setting up a meeting, you would need to previously determine
the time zone in which the meeting will take place. When generating the autoform
field, set the `timezoneId` attribute to the ID for this time zone.
(Chrome and some mobile browsers provide
datetime pickers that set the input value to a string in the expected format automatically,
but users of other browsers will have to manually enter the datetime in the correct
format, which is `date string + "T" + time string`.)
* **Loading:** If you are binding an object containing `Date` objects to an update autoform
and using them in an input with `type="datetime-local"`, be sure to set the
`timezoneId` attribute on the component to the time zone ID that applies. This will
ensure that the date and time you expect are shown in the input element.
* **Displaying:** Before displaying the saved date, determine the equivalent
date and time in the corresponding time zone. The easiest way to do this is
using `moment(myDate).tz(timezoneId).format()`
from the `moment` and `moment-timezone` packages/libraries.
* **Min/Max:** When specifying min or max values in your schema, use a `Date`
object that represents the exact minimum or maximum date and time
in the corresponding time zone. This may mean returning the min or max value
from a function based on a time zone ID you are storing elsewhere.

## Theme Templates

AutoForm has a robust and extendable template system. The following templates are built in:

* `bootstrap3`: Default. UI elements will be generated using Bootstrap 3 structure
and classes.
* `bootstrap3-horizontal`: Can be used with `afFormGroup` or `afQuickField` or `quickForm` only. Generates markup and
classes necessary to make the form appear with labels aligned horizontally with the fields.
In additional to setting `template="bootstrap3-horizontal"` on your `afQuickField`, you must
also define the column classes to use, for example, `{{> afQuickField name="name" template="bootstrap3-horizontal" label-class="col-sm-3" input-col-class="col-sm-9"}}` or `{{> quickForm schema=Schemas.ContactForm id="contactForm" type="method" meteormethod="sendEmail" template="bootstrap3-horizontal" label-class="col-sm-3" input-col-class="col-sm-9" id-prefix="my-prefix"}}`.
* `plain`: UI elements will be generated with no particular UI framework in mind.
(You can of course add your own classes to customize.)
* `plain-fieldset`: Can be used with `quickForm` only. Wraps the form in a
`fieldset`. Additionally allows a `label` attribute that determines what the
fieldset label should be.

### Using a Different Template

The AutoForm components can be generated using a specific template by
providing a template name as the `template` option. In addition, you
can change the default template for all components or for a particular
component type at any time:

```js
AutoForm.setDefaultTemplate('plain');

//OR

AutoForm.setDefaultTemplateForType('quickForm', 'plain-fieldset');
```

These methods are reactive, meaning that as soon as you call them, you'll
instantly see all visible forms change, if they're using the defaults.

Here's the list of possible types you can use for the first argument of
`setDefaultTemplateForType`:

* quickForm
* afFormGroup
* afObjectField
* afArrayField
* Any custom or built-in input type template name

### Creating a Custom Template

To define a custom template that is recognized by the AutoForm
templates system, simply create a template with the name
`afType + "_" + templateName`. For example, if I want to define a template
named "nothing" that can be used by a `quickForm` to generate nothing:

```html
<template name="quickForm_nothing">
</template>
```

And then use it like this:

```html
{{> quickForm schema=mySchema id="nothingForm" template="nothing"}}
```

Or tell all quickForms to use it:

```js
AutoForm.setDefaultTemplateForType('quickForm', 'nothing');
```

Obviously a real example would be a bit more complex. Your template will have
access to certain built-in helpers and properties in the data context, and you can
use those to generate what you need in the format you need it. In practice,
it is easiest to start by duplicating one of the built-in templates and then
modify your copy as necessary.

If you create a good set of templates for a commonly used framework or a
common purpose, consider releasing it as a separate add-on package. The goal
is to keep the built-in templates minimal but to provide many others through
separate packages.

## Grouping Fields

The "plain", "bootstrap", and "bootstrap-horizontal" quickForm templates allow you to group fields into fieldsets in the schema if you want.

For example if you add this to several of the fields in your form schema:

```js
{
  autoform: {
    group: 'Contact Information'
  }
}
```

Then all of those fields will be grouped into a `fieldset` with a `legend` that says "Contact Information". The fieldsets appear below any fields that do no list a group.

This only affects quickForms.

The `fieldset` has class "af-fieldGroup" and the `legend` has class "af-fieldGroup-heading" to help with styling.

The [Telescope](https://telescope.readme.io/docs) app makes use of this feature. Thanks to **@SachaG** for contributing it.

## Sticky Validation Errors

Every time AutoForm revalidates your form, it overwrites the list of invalid fields for that form. This means that adding your own errors to the form validation context (using the SimpleSchema API) will not always work because your custom errors will disappear upon first revalidation. To solve this, you can add sticky errors for a form. Sticky errors do not go away unless you reset the form, the form instance is destroyed, or you manually remove them.

- `AutoForm.addStickyValidationError(formId, key, type, [value])`
- `AutoForm.removeStickyValidationError(formId, key)

## Defining Custom Input Types

Making a custom input type (form widget) is easy.

1. Create a template and any necessary helpers for it.
2. Call `AutoForm.addInputType` to give your new type a name and provide a few other necessary details.

`AutoForm.addInputType` accepts two arguments: `name` and `options`. The `name` argument defines the string that will need to be used as the value of the `type` attribute for `afFieldInput`. The `options` argument is an object with some of the following properties:

* `template`: Required. The name of the template to use, which you've defined in a `.html` file.
* `valueIn`: Optional. A function that adjusts the initial value of the field, which is then available in your template as `this.value`. You could use this, for example, to change a `Date` object to a string representing the date. You could also use a helper in your template to achieve the same result.
* `valueOut`: Required. A function that AutoForm calls when it wants to know what the current value stored in your widget is. In this function, `this` is the jQuery object representing the element that has the `data-schema-key` attribute in your custom template. So, for example, in a simple case your `valueOut` function might just do `return this.val()`.
* `valueConverters`: Optional. An object that defines converters for one or more schema types. Generally you will use `valueOut` to return a value for the most common or logical schema type, and then define one or more converter functions here. The converters receive the `valueOut` value as an argument and should then return either the same value or a type converted/adjusted variation of it. The possible converter keys are: "string", "stringArray", "number", "numberArray", "boolean", "booleanArray", "date", and "dateArray". Refer to the built-in type definitions for examples.
* `contextAdjust`: Optional. A function that adjusts the context object that your custom template receives. That is, this function accepts an object argument, potentially modifies it, and then returns it. That returned object then becomes `this` in your custom template. If you need access to attributes of the parent autoForm in this function, use `AutoForm.getCurrentDataForForm()` to get them.

It's possible to use template helpers instead of `valueIn` and `contextAdjust`, but by keeping template helpers to a minimum, you make it easier for someone to override the theme template and still use your custom input type. For example, the `bootstrap3` template overrides some of the default input types to add classes and adjust markup a bit, but it does not need to redefine template helpers to make context adjustments since `valueIn` and `contextAdjust` do that.

There is nothing overly special about the HTML template you define. Check out the properties of `this` within the template to get all of the information you need to render your control. Primarily you need to use `this.value` to set the control's value and the provided attributes in `this.atts` should be passed along to one or more of the elements you generate. In particular, you must make sure that the `data-schema-key` attribute in `this.atts` is added to one of the generated elements, the one that you want to be provided as `this` in your `valueOut` function.

For more examples, see the built-in input types [here](https://github.com/aldeed/meteor-autoform/tree/master/inputTypes).

## Common Questions

### Should the value of `schema` and `collection` have quotation marks around it?

It depends. If you use quotation marks, then you are telling the autoform to
"look for an object in the `window` scope with this name". So if you define
your collections at the top level of your client files and without the `var`
keyword, then you can use this trick to avoid writing helpers.

If you don't use quotation marks, then you must define a helper function with
that name and have it return the SimpleSchema or Mongo.Collection instance.

Probably the best technique for organizing your form schemas and making them
available as helpers is to add all SimpleSchema instances to a `Schemas` object
and register that object as a helper:

*common.js:*

```js
Schemas = {};

Schemas.ContactForm = new SimpleSchema({
  name: {
    type: String,
    label: "Your name",
    max: 50
  },
  email: {
    type: String,
    regEx: SimpleSchema.RegEx.Email,
    label: "E-mail address"
  },
  message: {
    type: String,
    label: "Message",
    max: 1000
  }
});

//... define all schemas

```

*client.js:*

```js
Template.registerHelper("Schemas", Schemas);
```

*html:*

```html
<template name="contactForm">
  {{#autoForm schema=Schemas.ContactForm id="contactForm" type="method" meteormethod="sendEmail"}}
  <!-- etc. -->
  {{/autoForm}}
</template>
```

### Which components should I use?

Generally you should start by using a `quickForm` for every form your app needs.
Then, if the generated form does not look correct, try the following in
this order:

1. If there is something you can change or fix about the form's schema that
will cause the `quickForm` to render correctly, change it. If the form is for
a collection, you can also try using a different schema (a subset, perhaps with
stricter rules) to render the form by supplying the `schema` attribute in
addition to the `collection`.
2. If many of your forms need the same change, try writing and using a
custom template for those forms if possible.
3. Switch to using an `autoForm` with `afQuickField`s. You can then set
attributes for both inputs and labels (using `label-` prefix), omit labels
if necessary (`label=false`), and specify field-specific template overrides.
These features are typically enough to get the appearance you want.
4. If you really need something truly custom for just one field in just one
form, you can then switch to using the `afFieldInput` component directly.

### Can I reuse the same `quickForm` or `autoForm` for both inserts and updates?

Yes. Your code that flips between states should do the following in this order:

1. Change the `type` attribute's value to "insert" or "update" as appropriate,
probably by updating a reactive variable.
2. Change the `doc` attribute's value to the correct document for an update or
to `null` (or a document containing default values) for an insert, probably by
updating a reactive variable.
3. Call `AutoForm.resetForm(formId)`. This will clear any existing validation
errors for the form.

### How can I show an asterisk after the label for required fields?

Beginning with AutoForm 5.0, a `data-required` attribute is now present on the form group `div` element for all built-in `afFormGroup` templates if the field is required. This allows you to use css like the following to display an asterisk after required fields: `[data-required] label:after {content: '*'}`

### What are the various ways I can specify options for a select, radio group, or checkbox group?

To specify options for any field, use the `options` attribute and provide an array of
objects, where each object has a `label` property and a `value` property. There are several
different ways you can do this.

Alternatively, you can specify options as an object with {value: label} format. Values are coerced into the expected type.

#### Use allowed values array from the schema as both the label and the value

```js
{
  favoriteColor: {
    type: String,
    allowedValues: ['red', 'green', 'blue']
  }
}
```

```html
{{> afQuickField name="favoriteColor" options="allowed"}}
```

Fields generated by `quickForm` or `afObjectField` or `afArrayField` use `allowedValues` by default.

#### Set options in the schema

```js
{
  favoriteColor: {
    type: String,
    allowedValues: ['red', 'green', 'blue'],
    autoform: {
      options: [
        {label: "Red", value: "red"},
        {label: "Green", value: "green"},
        {label: "Blue", value: "blue"}
      ]
    }
  }
}
```

*Alternative syntax:*

```js
{
  favoriteColor: {
    type: String,
    allowedValues: ['red', 'green', 'blue'],
    autoform: {
      options: {
        red: "Red",
        green: "Green",
        blue: "Blue"
      }
    }
  }
}
```

```html
{{> afQuickField name="favoriteColor"}}
```

Since `autoform.options` is in the schema, that will be used instead of `allowedValues`.

#### Calculate options in the schema

```js
{
  favoriteColor: {
    type: String,
    allowedValues: ['red', 'green', 'blue'],
    autoform: {
      options: function () {
        return _.map(['red', 'green', 'blue'], function (c, i) {
          return {label: "Color " + i + ": " + c, value: c};
        });
      }
    }
  }
}
```

```html
{{> afQuickField name="favoriteColor"}}
```

`autoform.options` can be an array or a function that returns an array.

#### Use a helper

```js
{
  favoriteColor: {
    type: String
  }
}

Template.myFormTemplate.helpers({
  colorOptions: function () {
    return Colors.find().map(function (c) {
      return {label: c.name, value: c._id};
    });
  }
});
```

```html
{{> afQuickField name="favoriteColor" options=colorOptions}}
```

This example provides a reactive list of colors options read from the `Colors` collection. This assumes
that you've created and populated the `Colors` collection and published the necessary colors (documents)
to the client. Although using a UI helper is ideal because it is reactive, it can't be done with a `quickForm`
or `afObjectField` or `afArrayField`, unless you make a custom template.

### Can I put HTML in my error messages?

Yes. Define your messages using one of the `SimpleSchema` methods, including
HTML elements such as `<strong>`. Then be sure to wrap your `afFieldMessage`
tags in triple stashes.

## Examples

I would like to link to examples of public sites using this in production. If you have one,
please add a link here. You can include a brief description of how you're using autoforms
on the site, too. If the code is publicly available, link to that, too.

## Troubleshooting

* While developing, be sure to call `AutoForm.debug()` in your client code to enable extra logging.
* If nothing happens when you click the submit button for your form and there are
no errors, make sure the button's type is `submit`.
* If your `before` hook is called but the form is never submitted, make sure you are returning the `doc` or `modifier` from the hook or eventually calling `this.result(doc)` if you're doing something asynchronous.

## Contributing

Anyone is welcome to contribute. Fork, make your changes, and then submit a pull request.

Thanks to [all those who have contributed code changes](https://github.com/aldeed/meteor-autoform/graphs/contributors) and all who have helped by submitting bug reports and feature ideas.

[![Support via Gittip](https://rawgithub.com/twolfson/gittip-badge/0.2.0/dist/gittip.png)](https://www.gittip.com/aldeed/)
