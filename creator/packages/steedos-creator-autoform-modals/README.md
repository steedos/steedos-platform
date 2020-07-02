Meteor [Autoform](https://github.com/aldeed/meteor-autoform) Modals
======================

Adds bootstrap modals to insert/update/remove docs from Meteor collections.

## Setup ##

1. ```meteor add yogiben:autoform-modals```
2. Include the template in the layouts that will use the modals `{{> autoformModals}}`
3. Use `afModal` template to create a button that will trigger the modal


![alt tag](https://raw.githubusercontent.com/yogiben/meteor-autoform-modals/master/readme/1.png)

Maintained by [Meteor Factory](https://meteorfactory.io). Professional Meteor development.

[![Meteor autoform modals](https://raw.githubusercontent.com/yogiben/meteor-autoform-modals/master/readme/meteor-factory.jpg)](http://meteorfactory.io)

##Example Button Markup##
### Insert Example ###
```
{{#afModal class="btn btn-primary" collection="Posts" operation="insert"}}
  Add a new post
{{/afModal}}
```
### Update Example ###
```
{{#afModal class="btn btn-primary" collection="Posts" operation="update" doc=_id}}
  Update post
{{/afModal}}
```
### Remove Example ###
```
{{#afModal class="btn btn-danger" collection="Posts" operation="remove" doc=_id}}
  Delete post
{{/afModal}}
```
### Example with customisation ###
```
{{#afModal class="btn btn-primary" collection="Posts" omitFields="createdAt,owner,upvotes" operation="update" buttonContent="Update Challenger" prompt="Use this form to update your doc" title="Update your great content" buttonClasses="btn-success"}}
  Update your post
{{/afModal}}
```
##Usage##
Use `afModal` template to create a link that will trigger the modal.
The required attributes of this template are ``collection`` & ``operation``.

Collection should be the name of the global collection object e.g. Posts.

Operation can be ```insert```,```update``` or ```remove```.

If ```operation="update``` or ```operation="remove"``` you also need to set the ```doc``` property to the _id of the document.

## Customisation ##
It is possible to customise the modals by adding additional attributes to the `afModal` template.
* ```title``` will be the title of the modal (default to html of the button clicked)
* ```buttonContent``` is the html content of the modals' button (default to html of the button clicked)
* ```buttonClasses``` allows you to add different classes to the submit button. See the [autoform docs](https://github.com/aldeed/meteor-autoform).
* ```closeButtonContent``` is the html content of the modals' close button (not visible by default). Please note currently this feature is available on `operation="remove"` dialogs only.
* ```closeButtonClasses``` allows you to add different classes to the close button.
* ```fields``` is a comma separated list of the only fields that should be in the form. See the [autoform docs](https://github.com/aldeed/meteor-autoform).
* ```omitFields``` is a comma separated list of fields to omit. See the [autoform docs](https://github.com/aldeed/meteor-autoform).
* ```prompt``` a paragraph appears above the form / delete button. Defaults to 'Are you sure?' on delete.
* ```template``` any template string that autoform accepts. See the [autoform docs](https://github.com/aldeed/meteor-autoform#theme-templates)
* ```labelClass``` defines a bootstrap class for use when the horizontal class is used, how many columns should the label take? For example:
```
labelClass='col-sm-3'
```
* ```inputColClass``` defines a bootstrap class for use when the horizontal class is used, how many columns should the input take? For example:
```
inputColClass='col-sm-9'
```
* ```placeholder``` set to true if you wish to use the schema label for the input placeholder.
* ```formId``` defines id of the `quickForm` template. Useful when you want to set your custom autoform hooks.
* ```backdrop``` disables or enables modal-backdrop. Defaults to true (modal can be dismissed by mouse click). To disable use 'static' value. (See more [here](http://getbootstrap.com/javascript/#modals-options))
* ```meteormethod``` if specified meteor method will be called on submit. This has the same effect as passing `type="method"` and `meteormethod` to autoform template. See autoform docs for more details.
* ```onSuccess``` function to be called when operation succeeds. Currently it's supported for `operation="remove"` only.
* ```dialogClass``` can be used to add additional class for `.modal-dialog` (e.g. `modal-sm`)

## Callbacks/Hooks ##
It's possible to add your own autoform [callbacks/hooks](https://github.com/aldeed/meteor-autoform#callbackshooks) by setting the `formId`.
