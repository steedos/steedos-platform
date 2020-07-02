AutoForm
=========================

AutoForm is a smart package for Meteor that adds handlebars helpers to easily create basic
forms with automatic insert and update events, and automatic reactive validation.

## Change Log

### 5.8.0

You can now set `singleMethodArgument=true` as a form attribute on a `method-update` type form, and your method will be called with a single object argument with `_id` and `modifier` properties. You should do this if using the [mdg:validated-method](https://github.com/meteor/validated-method) package.

### 5.7.1

For "normal" type forms, don't end submission until `this.done()` is called.

### 5.7.0

Sticky validation improvements

- Add API outside of hooks for settings and removing sticky validation errors
- Properly show sticky validation errors as soon as they are added
- Optimizations to keyup validation

### 5.6.1

Fix boolean-radios templates

### 5.6.0

- Add ability to specify a `data` attribute on `afFieldInput`, which is then added to the data context of the input type template. (See the readme.)
- Fix issue with submitting proper value when the `null` option is chosen for a boolean field
- Fix issues with reactive reruns that change the form schema
- Adjust value returned from AutoForm.getFieldValue when the form isn't rendered yet
- Fix issue with autosaving changes to multiple select fields
- Adjustments to support BlazeComponents
- Fix width of array field when there is only one
- Fix initial value of contenteditable fields

Thanks to all who submitted PRs: @abecks, @kellyje, @bySabi, @vimes1984, @Nieziemski, @smeijer

### 5.5.1

Add jquery dependency for Meteor 1.2 compatibility

### 5.5.0

For `boolean-radios` and `boolean-select` input types, you can now use the `nullLabel` attribute to specify a label (e.g., "None") for when the value is not set (or to unset it). For backwards compatibility, the `boolean-radios` type will not render a radio element for unsetting unless you set `nullLabel`.

### 5.4.1

Fix `AutoForm.getFieldValue` so that it reacts properly when first called outside of the form, before the form has been rendered. Also attempt to limit unnecessary reruns.

### 5.4.0

* New `autoform.group` option. See "Grouping Fields" in README. (Thanks @SachaG)
* `formToModifier` now works properly (Thanks @aramk)
* `update-pushArray` forms now work properly when there is an array index in the `scope` field
* Other minor documentation and dependency changes

### 5.3.2

Better fix to `afFieldValue` tracking for check boxes

### 5.3.1

Fix issue where `afFieldValue` tracking didn't work for non-boolean radio buttons and check boxes.

### 5.3.0

* Fix `Uncaught TypeError: Cannot read property 'changed' of undefined` error
* Fix for checkboxes and radio buttons not triggering form change event (Thanks @abecks)
* Add `ddp` attribute for specifying an alternative DDP connection for "method" and "method-update" forms (Thanks @patrickleet)
* Add support for `formgroup-` prefix on `afFormGroup`/`afQuickField` attributes. For example, `formgroup-class="foo"` adds "foo" class to the form group element. (Thanks @fknipp)
* For Bootstrap theme templates, you can now specify `panelClass`, `headingClass`, and `bodyClass` attributes for the `afObjectField` component. (Thanks @fknipp)

### 5.2.0

Fix issues with errors being thrown during reactive changes and issues with getting reactive field values.

### 5.1.2

Fix validation of typeless forms when done with `AutoForm.validateForm()`

### 5.1.1

Fix validation of typeless forms broken in 5.1.0 (Thanks @abecks)

### 5.1.0

* Fix date handling when dealing with very low year numbers. (Thanks @jfly)
* For `type="update"` and `type="method-update"` forms, a `formToModifier` hook is called instead of `formToDoc`, and it's passed a Mongo modifier. For forms with no `type` attribute, both `formToDoc` and `formToModifier` are called. (You should provide one or both based on whether you use the doc, the modifier, or both in your `onSubmit` hook.)
* Array handling was changed in 5.0 to support additional use cases. However, this change also resulted in a MongoDB array handling quirk no longer being masked by AutoForm. Since this caused confusion for many people, array handling is now reverted back to pre-5.0 behavior. If your form needs to update specific array items as opposed to entire arrays, you can opt in to the proper array handling by putting `setArrayItems=true` on your `autoForm` or `quickForm`.
* For "method" and "method-update" type forms, before hooks will now run before validation, unless you've specified both a `schema` attribute and a `collection` attribute. In that case, validation against the form schema happens before the before hooks run, and validation against the collection schema happens after the before hooks run, before your method is called.
* Changes to avoid benign errors being thrown.
* Fix potential for infinite loops related to tracking field values.

### 5.0.3

Compatible with Meteor v1.0.4+

### 5.0.1, 5.0.2

Minor fixes

### 5.0.0
* **Compatibility break:** You can no longer do `options="auto"`, but you can do `options=afOptionsFromSchema` for essentially the same effect. The `afOptionsFromSchema` helper requires that you have a property named `name` in the current context, which is set to the field name.
* **Compatibility break:** The function signature for `AutoForm.getFieldValue` is reversed from `(formId, fieldName)` to `(fieldName, [formId])` with `formId` optional. You must not pass the `formId` argument when using it in a helper that is run within the context of the form. Conversely, you *must* pass `formId` if not calling it within an autoform.
* **Compatibility break:** The `afFieldNames` helper now returns an array of objects with `name` property instead of returning the array of names directly.
* **Compatibility break:** The `method` form type now calls the server method with only one argument, the submitted form document. If your server method needs the update modifier and document _id instead of the document, change your form's type to `method-update`. The `before` hooks for a `method-update` form are passed (and should return) the modifier object instead of the document.
* **Compatibility break:** The arguments passed to "before" hooks have changed. `docId` and `template` are no longer passed as arguments but are available as `this.docId` and `this.template`. Only a single object, `doc` is passed to every "before" hook.
* **Compatibility break:** When defining "before" and "after" hooks for methods, use the word "method" instead of the method name. If you need different logic based on method name, you can examine `this.formAttributes.meteormethod` in your hook function.
* **Compatibility break:** Hooks that were passed `formId` and/or `template` as arguments no longer receive those arguments. Use `this.formId` or `this.template` if you need them.
* **Compatibility break:** If you have custom templates for `afFormGroup` or `afObjectField`, change all `this.atts` references to `this`.
* **Compatibility break:** `AutoForm.find()` is removed and should be replaced by a more specific call to one of the new API functions like `AutoForm.getFormId()` or `AutoForm.getFormSchema()` or `AutoForm.getFormCollection()` or `AutoForm.getCurrentDataForForm()` or `AutoForm.templateInstanceForForm()`. See [current API docs](https://github.com/aldeed/meteor-autoform/blob/master/api.md).
* **Compatibility break:** `noselect` attribute must be set to `true` without quotation marks. Any other value will have no effect.
* You can now use `afFieldValueIs` and `afFieldValueContains` helpers outside of the form in which the field appears if you add `formId="myFormId"` attribute to them.
* When providing options for a `select` or `select-multiple` input type, you can now add additional props to the objects in the options array and those properties will become attributes on the `option` element in the generated HTML.
* `data-required` attribute is now present on the form group `div` element for all built-in `afFormGroup` templates if the field is required. This allows you to use css like the following to display an asterisk after required fields: `[data-required] label:after {content: '*'}`
* There are no longer issues when your input type template name contains underscores.
* A new `update-pushArray` form type allows you to create insert-like forms that push the resulting document into an array field in an existing collection document. See the README and http://autoform.meteor.com/updatepush
* Added `autosaveOnKeyup` form option. See README.
* If you specify default attributes within an `autoform` object in your schema, any of the attributes may be functions that return their value, and when the function is called `this.name` will be set to the current field name, which is helpful for fields that are nested in one or more arrays.
* You can now add custom form types using `AutoForm.addFormType`. See the API documentation. The built-in form types are defined this way, too. This allows for a lot of flexibility in what happens upon validation and submission of a form.
* In any form hook, you can now call `this.addStickyValidationError(key, type, [value])` to add a custom validation error that will not be overridden by subsequent revalidations on the client. This can be useful if you need to show a form error based on errors coming back from the server, and you don't want it to disappear when fields are revalidated on the client on blur, keyup, etc. The sticky error will go away when the form is reset (such as after a successful submission), when the form instance is destroyed, or when you call `this.removeStickyValidationError(key)` in any hook.

### 4.2.2

* Fixed "Can't set timers inside simulations" error (Thanks @SachaG)
* Switched Moment dependency to official `momentjs:moment` package

### 4.2.1

Fix `AutoForm.getFieldValue` reactivity when the field is in an `#if` block

### 4.2.0

* As an alternative to the current method of specifying `options` as an array of objects, you can now specify options as an object with {value: label} format. Values are coerced into the expected type. (Thanks @comerc)
* When you have an update form with `autosave=true`, fields with `type="contenteditable"` now properly autosave. (Thanks @MichalW)


### 4.1.0

* The "boolean-radios" input type now outputs the correct field value (`true`, `false`, or `undefined`) in all cases.
* The "boolean-checkbox" input type now always returns either `true` or `false` as its value. Previously, it could return `undefined` instead of `false` sometimes.
* You can now pass a comma-separated list of values to `afFieldValueContains` and it will return `true` if any of those values are in the array. (thanks @comerc)
* The "select-multiple" input type now has initial values set properly. (thanks @BigDSK)
* The "select-checkbox-inline" input type now has initial values set properly. (thanks @AlainPaumen)
* When handling submission with `onSubmit`, you can now call `this.done(null, result)` when done, and `result` will be passed to `onSuccess` as the second argument. If there are multiple `onSubmit` hooks, only the first provided result will be passed to `onSuccess`.
* When `onSuccess` is called after an `insert`, `this.docId` is now set to the new document `_id`.
* Update forms should now reset properly (to values from database).
* Other fixes (thanks @zimme and @mjgallag)

### 4.0.2 - 4.0.7

Several fixes

### 4.0.1

Bug fix

### 4.0.0

This is a significant rewrite, and there are a number of changes that are not backwards compatible. The primary reason for the rewrite is to enable easier creation of custom form input types (autoform widgets) that can be provided by add-on packages. Some changes were also made to cut out features that were not providing much added value compared to the code they required.

* **BREAKING** The logic that determines what style template is used for a form or a component of a form is now different. Generally speaking, there are more potential places at which you can define the template to use, and it tries to use the template used by the closest ancestor component if not overridden.
* **BREAKING** The `AutoForm.inputValueHandlers` function is now gone. If you were using it, you should switch to the new method for defining custom input types. Refer to "Defining Custom Input Types" in the Readme.
* **BREAKING** When your schema for a field includes the Email or Url regular expression built into SimpleSchema, AutoForm no longer automatically uses the `email` or `url` type, respectively, for the form input. You can manually set the `type` attribute or specify `autoform.type` in the schema.
* **BREAKING** The `radio` and `select` attributes no longer do anything. Instead, specify an override `type` attribute of "boolean-radios" or "boolean-select", respectively.
* A new `AutoForm.getSchemaForField` function can be used within a template helper function to get the schema definition for a field by finding the closest autoForm and using the schema attached to it.
* **BREAKING** The `afFieldLabel` component is gone. If you were using it, you should replace with your own label element using `afFieldLabelText` for the text, something like `<label class="control-label">{{afFieldLabelText name='firstName'}}</label>`
* **BREAKING** If you don't provide a `firstOption` attribute for a single select control, a default first option that says "(Select One)" is used. You can omit the first option using `firstOption=false`, but it's best to have one in most cases to avoid confusing behavior.
* **BREAKING** The `afFieldSelect` component is gone. See [the demo](http://autoform.meteor.com/select) for the new way to provide optgroups.
* A new `AutoForm.invalidateFormContext` function can be called in situations where you reactively change the `doc` attribute of a form and you need to force the form to rerender.
* You can now set `label="some text"` on an `afFormGroup` (or `afQuickField`) component to provide some label text instead of using the schema label.
* Fix which element is passed as the updated element for autosave forms.

### 3.2.0

* Documentation corrections. (Thanks @paulellery and @jakozaur)
* Fixes to logic for throwing errors: don't do it if there are validation errors, and call endSubmit (e.g., to re-enable buttons) before doing it. (Thanks @jakozaur)
* Internal code revisions for better backwards and forewards compatibility (Thanks @SachaG)
* The bootstrap3-horizontal template now recognizes a `leftLabel` attribute that you can set to `true` on your boolean check box fields to put the check box label in the left column instead of to the right of the check box.
* In hooks for update forms, you can now use `this.docId` to figure out which document is being updated.
* In hooks for autosave forms, you can now use `this.autoSaveChangedElement` to get the element that caused the automatic form submission. You can use this, for example, to display some kind of indicator that the changed field was saved.

### 3.1.0

When AutoForm pre-validates, it now passes `docId` to autoValue and custom context, just as collection2 would do.

### 3.0.0

* Fixes to form preservation during hot code push.
* You can now disable form preservation for a specific form by setting `preserveForm=false` attribute on the `autoForm` or `quickForm`.
* Expose `formPreserve` object as `AutoForm.formPreserve`. Add `unregisterAllForms` method. You can now do `AutoForm.formPreserve.unregisterForm(formId)` or `AutoForm.formPreserve.unregisterAllForms()` to resolve strange issues due to faulty form preservation logic.
* Support for `offset` attribute on `datetime-local` inputs is removed and replaced by a `timezoneId` attribute, which should be set to a timezone ID that `moment-timezone` understands. You'll also need to add the `moment-timezone` library to your app, for example, by adding the `mrt:moment-timezone` Meteor package.
* If a form has no `onError` or `after` hooks, insert, update, and method call errors are now thrown.
* Other fixes

### 2.0.2

Minor fix to template selection logic. Make sure default template is always used if specific template is not found.

### 2.0.1

Update collection2 weak dependency to 2.0.0.

### 2.0.0

Minor fixes (thanks @aramk) and use 0.9.1 core packages, which means you can't use this one on 0.9.0. Not my fault; blame Meteor.

### 1.0.0

* Removed `afDeleteButton`
* Removed support for `type="remove"` forms
* Updates for >=1.0.0 dependencies on aldeed:simple-schema and aldeed:collection2
* Made the array tracker object public as `AutoForm.arrayTracker`. This allows you to, for example, add and remove array item fields from code.
* Add support for `initialCount` attribute on `afArrayField` and `afEachArrayItem` components. By default, if there is no `doc` attached to the form, there is initially 1 item field shown, or minCount fields if minCount is greater than 1. This logic is unchanged, but now you can override that default initial count to be something other than 1, including 0. Note that minCount will still always take precedence.
* Previously, the component template that generates a form group was prefixed with `afQuickField_`. Now it is prefixed with `afFormGroup_`, and this template is rendered also when you use a new `afFormGroup` component. This separation allows `afQuickField` to act solely as a logic component; it decides whether a particular key should be rendered using `afArrayField`, `afObjectField`, or `afFormGroup`, and then forwards all your attributes to the chosen component. So `afQuickField` no longer has a template associated with it. To update your code, change "afQuickField_" to "afFormGroup_" for any custom templates you have, and if you are calling `AutoForm.setDefaultTemplateForType` for "afQuickField", change it to "afFormGroup".
* You can set `trimStrings` attributes to `false` on an autoForm or quickForm to change the default behavior for document cleaning for that form.
* You can now set `autoform.omit` to `true` in the schema definition for a field to prevent it from ever being included in quickForms, afObjectFields, afArrayFields, etc. This is useful for autoValue properties such as `createdAt` that you know you will not want on a form.

### 0.17.1

Fix for Dates being stripped out on submission

### 0.17.0

* Requires Meteor 0.8.2+
* Fix issue with datetime-local field being 12 hours off
* The `autoform` attribute is no longer ever necessary. AutoForm can locate the closest form no matter how many times you use blocks that change the context within a form.
* If you set `buttonContent=false` on a `quickForm`, it won't generate a button.
* BREAKING! If you provide `buttonClasses` attribute on a `quickForm`, the bootstrap templates no longer add "btn btn-primary" to your classes.
* `type="remove"` forms and the `afDeleteButton` are now deprecated but still work for now. Use the [delete-button package](https://github.com/aldeed/meteor-delete-button).
* Most hooks now have `this.event`, `this.template`, `this.formId`, and `this.resetForm()`. You can use `this.formId` in conjunction with a global hook to implement hook logic for multiple forms.
* You can set `filter`, `autoConvert`, and/or `removeEmptyStrings` attributes to `false` on an autoForm or quickForm to change the default behavior for document cleaning for that form.
* You can now call `AutoForm.debug()` to enable additional logging during development.
* Add `afQuickFields` component. See readme.
* When all fields that comprise a sub-object are empty, we now unset the whole sub-object. This prevents issues when some of the properties are required, but the sub-object itself is optional.

### 0.16.1

An insert form will now insert properly even if the `collection` does not have an attached schema.

### 0.16.0

* Fix error when you add `autoform` to your app but not `simple-schema`.
* You can now use object dot notation when setting collection or schema for a form as a string, for example, `collection="App.Collections.Posts"` or `schema="Schemas.Post"`. (Thanks @czeslaaw)
* You can now easily tell an update form to save (submit) whenever the value in one of its fields changes. Put `autosave=true` on the `autoForm` or `quickForm`.

### 0.15.4

* Fixes to submission validation logic for forms that have both `collection` and `schema`
* More useful `Error` instance is passed to `onError` hooks

### 0.15.3

Fix to code that gathers form values so that custom object prototypes are not lost.

### 0.15.2

When submitting, ensure that validation is always skipped when `validation="none"` for the form.

### 0.15.1

Fix submission logic so that validation happens before insert and update "before" hooks only when there's an override schema.

### 0.15.0

**BREAKING CHANGES TO FORM SUBMISSION AND HOOKS:**

* You can no longer call a `meteormethod` in addition to performing other types of submission. Your `meteormethod` will be called only if `type="method"`.
* `onSubmit` hooks can now perform async tasks if necessary. You must add a `this.done()` call to all of your `onSubmit` hooks. Refer to the hooks documentation in the readme.
* `onSubmit` hooks are now called *only if* your form has no `type` attribute. If you have an `onSubmit` hook for a form, remove the `type` attribute from that form and be sure that your `onSubmit` hook returns `false`. If you were using `onSubmit` to cancel submission for an insert, update, or method form, you can do that by returning `false` from a "before" hook instead.

Other non-breaking changes:

* "before" hooks for insert, update, and method forms can now perform async tasks if necessary. Existing synchronous hooks do not need any changes. Refer to the hooks documentation in the readme.
* Improved logic for form resetting, and `AutoForm.resetForm` method works better.

### 0.14.1

Fixed an issue where `afFieldValueIs` and `afFieldValueContains` helpers did not correctly recognize boolean values upon first form render.

### 0.14.0

* Added `afArrayFieldIsFirstVisible` and `afArrayFieldIsLastVisible` helpers. (Thanks @camelaissani!)
* Added `AutoForm.validateForm(formId)` for validating the current data in a form without submitting it.
* Added `AutoForm.getValidationContext(formId)`, which returns the form's SimpleSchema validation context. Use this to easily manually add validation errors, check current validity, etc.
* BREAK: String fields with a schema `max` value of 150 or greater are no longer automatically rendered as `textarea`. To force a textarea, add a `rows` attribute either on the field or in the `autoform` object in the schema.
* When you add `type` attribute to an `afQuickField` for an object or array field, the type is now correctly respected.
* When you override the `type` attribute to `hidden` for a boolean field, the extracted field value is now correctly converted back to a boolean.

### 0.13.5

Fix error that occurs when `denyInsert` or `denyUpdate` is in form schema and `quickForm` or `afObjectField` is used.

### 0.13.4

The ability to omit fields within objects and arrays from a quickForm is restored.

### 0.13.3

Properly set `checked` state on check box and radio groups

### 0.13.2

Fix add array item button when used not within an afArrayItem template

### 0.13.1

* The document `_id` is now passed as the third argument to your server method when you submit a form with `type="method"`. This, combined with the modifier in the second argument, allows you to do an `update` in your method.
* More internal changes to simplify the code and guard against edge cases.

### 0.13.0

* Many changes that simplify custom template creation. **If you have created custom templates, they will most likely need to be updated. Look at the revised built-in templates for guidance.**
* Fixed bootstrap-horizontal template to work with object and array fields.
* Added `AutoForm.validateField`. See the readme.
* Fixed schema validation upon submission when using both a `schema` attribute and a `collection` attribute.

### 0.12.0

* Added `AutoForm.inputValueHandlers` method. See [the readme](https://github.com/aldeed/meteor-autoform#making-autoform-ready-components).
* More array field fixes
* `placeholder="schemaLabel"` now reactively updates the placeholder along with the label.
* Added `beginSubmit` and `endSubmit` hooks, which allow you to override the default UI changes during submission. See [the readme](https://github.com/aldeed/meteor-autoform#callbackshooks).
* You can now define hooks for a form generated by `afDeleteButton`.
* You can now define default autoform field attributes in the schema. Add an `autoform` option to the schema for the field, and set it equal to an object that contains the default attributes you want. This makes it possible to use quickForms more often. For example:

```js
values: {
  type: [String],
  optional: true,
  minCount: 2,
  maxCount: 4,
  autoform: {
    options: [
      {label: "One", value: "One"},
      {label: "Two", value: "Two"},
      {label: "Three", value: "Three"}
    ],
    noselect: true,
    template: "myCustomTemplate"
  }
}
```

* Lots of internal code reorganization to make the other changes possible and make it easier for other contributors to understand.

Thanks to @Batistleman and @patrickleet for contributions.

### 0.11.0

* API Change: boolean attributes on inputs are now passed through to the generated HTML *only if* the value is `true` or `"true"` or `""`. This is different from HTML in which boolean attributes take effect simply by being present. This change allows you to reactively add or remove a boolean attribute in a simple way, for example, `{{> afQuickField name='status' disabled=canEditStatus}}`. You should review any boolean attributes you use on autoform fields to ensure that they have the correct value, or they may no longer show up in the HTML.
* Fixed an issue where reactive lists of check box inputs would have incorrect check boxes selected after the list changed
* Removed `for` attribute from radio labels in the bootstrap3 template, since it should not be there; makes the labels correctly clickable
* Completely rewrote behind-the-scenes array field tracking, fixing a number of issues with adding and removing array fields and correctly updating arrays

### 0.10.0

* Before hooks are now passed the template instance
* `formToDoc` and `docToForm` hooks are now passed the SimpleSchema instance and form `id`, which is useful if you define them globally (pass `null` for the first argument of `AutoForm.addHooks`)

### 0.9.0

* Support for limiting the number of items in an array field. See "afArrayField" section in the README.
* In the default templates, when you can't add or remove array items, the corresponding buttons are hidden.
* You can now specify fields that are in objects within arrays in the `omitFields` attribute on a `quickForm`. For example, `names.$.first`. (Thanks @picsoung!)
* Clearing all check boxes for an optional array field will now properly unset the field.
* Other bug fixes (Thanks @jfols and @BasilPH)

### 0.8.1

* Disabled fields are no longer submitted or included in the generated insert or update object.
* Changes that prevent global helpers from potentially interfering with correct autoform generation. (Thanks @mjgallag)
* Fix contenteditable field. (Thanks @chrisbutler)

### 0.8.0

* Ensure that `template` attribute is not added to the DOM element for all components
* Add `afFieldValueContains`, like `afFieldValueIs` but for checking whether an array field contains the value
* Add reactive `AutoForm.getFieldValue` method, useful for creating helpers to support more advanced field filtering based on combinations of current field values
* Add `bootstrap3-horizontal` built-in template
* Documentation improvements: `afObjectField` and `afArrayField` components are now documented, and added link to the autogenerated public API documentation

### 0.7.2

Remove unintentional console log

### 0.7.1

Minor fixes for `afFieldValueIs` helper

### 0.7.0

Add `afFieldValueIs` helper for dynamic show/hide of form sections based on the current value of any field.

### 0.6.2

Fix an issue where generated modifiers sometimes had the same field listed in both `$set` and `$unset`.

### 0.6.1

Improve some error messages

### 0.6.0

* Add `omitFields` attribute for `quickForm`. Similar to the `fields` attribute but for blacklisting instead of whitelisting.

Much thanks to @gdhuse for the following fixes and enhancements:

* Add option to replace hooks instead of extending the current list when calling `hooks` or `addHook`.
* Allow insert/update forms without a `collection` attribute if there is at least one `onSubmit` hook and at least one `onSubmit` hook returns `false`.
* Fix issue with array fields
* Fix issue with update modifiers created from autoform field values.

### 0.5.2

Fix issue with datetime fields

### 0.5.1

Minor fix

### 0.5.0

Blaze/0.8.0 support and lots more, including breaking changes. Refer to the transition notes at the top of the README. If you're still using Spark (pre-0.8.0), use the 0.4.x version. The old version of autoform can be found on the `spark` branch. It won't receive any more changes, except for critical fixes. Onward!

### 0.4.20

Better implementation of `defaultValue` support

### 0.4.19

* Use jQuery to fix issues related to maintaining selections in a cross-browser way. *(Thanks @mjgallag)*
* Use schema `defaultValue` as default value for boolean controls.

### 0.4.18

A couple more bug fixes related to cleaning objects.

### 0.4.17

Bug fix for validation of updates when auto values are involved. *(Thanks @mjgallag)*

### 0.4.16

Add support for `contenteditable` input type. *(Thanks @chrisbutler)*

### 0.4.15

* Labels are now generated with "for" attribute
* QuickForms work better with schemas containing objects now. The object is
treated as a `fieldset` with its child fields nested within. This only works
to one level deep.
* The `updateDoc` passed to an `onSubmit` handler is no longer validated before
being passed. The `insertDoc` is still validated.
* Changes to account for `autoValue` and `defaultValue` options now available
in the SimpleSchema package.

### 0.4.14

The execution flow for hooks has been improved. The `onError` hook is now
always called if there's an error at any point in the form submission process,
and it will never be called more than once. Also, any "before" hooks are now
executed before the `onSubmit` hook. *(Thanks @blazer82)*

### 0.4.13

Changes related to SimpleSchema package changes. No visible changes.

### 0.4.12

Add support for `fields` attribute on `quickForm`. Bind an array or specify
a comma-delimited string of field names to include. Only the listed fields
will be included, and they'll appear in the order you specify.

### 0.4.11

* Don't include fields in quickForms if their name contains "$"
* Use `textarea` instead of `input[type=text]` if the schema type is `String`,
no specific type attribute is specified, and the current value of the doc
contains line break characters.
* Within an `onSubmit` function, you can now access `this.event` and `this.template`.
* Specify `element="none"` or `element="span"` on afFieldLabel to get just
the text or to use a `<span>` element, respectively.
* `quickForm` and `afQuickField` now support a `template` attribute, allowing
you to define your own template to be used for the quick fields.
* Provide `resetOnSuccess` attribute to specify auto-reset behavior for a
specific autoform.

### 0.4.10

Add explicit cleaning since SimpleSchema validation does not do it anymore

### 0.4.9

Fix error when a source doc has null values

### 0.4.8

Minor internal change to adjust for changes made to the internal schema in the
SimpleSchema package.

### 0.4.7

* quickForm no longer displays fields for denyInsert or denyUpdate keys when
building an insert or update form, respectively.
* Fix an issue with being able to pass a Collection2 as the autoForm schema.
(This is not recommended anyway.)
* Automatically disable the submit button while submitting an autoform.

### 0.4.6

Ensure docToForm hook is called

### 0.4.5

Add onSuccess and onError hooks

### 0.4.4

* Fix issues, introduced by 0.4.3, where select, checkbox, and radio form values
were not always correct.
* Throw errors in afFieldMessage and afFieldIsInvalid helpers when the field
name used doesn't exist in the schema. (Other helpers already did this.)
* Add two new "type" options for quickForms: "readonly" and "disabled". See
README.
* When displaying a quickForm, use the allowedValues from the schema as the
options.

### 0.4.3

Update to use MongoObject to create flatDoc. Fixes an issue caused by recent
SimpleSchema API changes.

### 0.4.2

* New API. The old API is deprecated but continues to work for now with warning
messages logged. See the README and warning messages. The main difference is
that the various hooks/callbacks are centralized in a `hooks()` method, but this
is available only on `AutoForm` instances, so you need to wrap your `Collection2`
instance in an `AutoForm` on the client and then attach hooks to the autoform,
passing the autoform as the `schema` attribute for your `autoForm` helper. Also,
the server methods have all been removed, making this a purely client package.
This means you should now define a `SimpleSchema` in common code and use that
to create an `AutoForm` instance on the client only. This allows you to still
validate against the same `SimpleSchema` on both the client and the server. See
examples in the README.
* You can now set `options` to the string "allowed" for `afFieldInput` or
`afQuickField`. This causes the schema's `allowedValues` to be used as the
values (and labels) for the select element. If you want to capitalize the first
letter of the labels, set `capitalize="true"`. (Thanks @gdhuse!)
* SimpleSchema error messages with HTML will now display correctly when you use
an `afQuickField`. (Thanks @gdhuse!)

### 0.4.1

Improve handling of key names that use dot notation to indicate a property of
an object in an array, for example, `friends.0.name`.

### 0.4.0

Backwards-compatibility break! Handling of `Date` fields was limited and saved
`Date` objects were not correct. If you have previously saved `Date` objects
from an autoform `date` input, you will have to manually convert the saved values
to correct them after upgrading to this release. If it is only the date you care
about and not the time, all dates in your mongo collections must represent
midnight in the UTC time zone on the morning of the correct date. Refer to the
[Dates](https://github.com/aldeed/meteor-autoform#dates) section of the README
for details about how date inputs work now.

### 0.3.6

Support min/max functions

### 0.3.5

Add framework override support; current usage is only to specify "none" to skip the bootstrap3 classes

### 0.3.4

Fix object expansion

### 0.3.3

Improve object collapsing. Ensures that the values of keys with dot notation appear in the fields for edit forms.

### 0.3.2

Fix IE<10 errors

### 0.3.1

Fixes to date inputs

### 0.3.0

Updated to work with 0.2.0 versions of collection2 and simple-schema packages. The autoform features should be backwards-compatible, but the collection2 and simple-schema APIs have changed, so you may need to make changes. To make sure everything works as you expect, it's strongly recommended that you include a unique `id` attribute on every `autoForm` helper.

### 0.2.3

* Fix IE<10 issue

### 0.2.2

* Use `submit form` event handler instead of button click handlers
* Add support for binding an `onSubmit` handler to an autoForm using the `onSubmit` helper attribute.
* Don't include `form-control` class on radio buttons and check boxes
* Submit the form normally after validating if none of the special actions are used

### 0.2.1

Fix input helper to use value passed in `value` attribute if no doc is attached to the autoform.

### 0.2.0

* For autoforms that call a server method, server-side validation is no longer performed automatically. This had to be removed to fix a security issue. After updating to 0.2.0, you must call `check()` in the Meteor method.
* Add `formToDoc` and `docToForm` functions. See the readme.
* Improve keyup validation
* Allow direct binding of Collection2 or AutoForm object to autoForm helper through the schema attribute. Passing in the string name of a global object is still supported, but binding is the preferred method now.
