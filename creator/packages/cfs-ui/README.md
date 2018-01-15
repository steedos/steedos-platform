cfs-ui
=========================

Provides additional UI helpers for CollectionFS. Requires Meteor 0.8.0 or higher.

## Installation

Install using Meteorite. When in a Meteor app directory, enter:

```
$ meteor add steedos:cfs-ui
```

## Helpers

The following components and helpers are available.

### FS.GetFile

Allows you to get an `FS.File` instance by knowing its `_id` and the name of the collection it's in.

```html
{{#with FS.GetFile collectionName id}}
  In here, we can use the FS.File instance methods that work as helpers, such as {{url}} or {{isImage}}
{{/with}}
```

Example:

```html
{{#with FS.GetFile "images" selectedImageId}}
  <img src="{{this.url store='thumbnails'}}" alt="">
{{/with}}
```

### FS.DeleteButton

Renders a delete button. Must be used where the current context is the `FS.File` instance that you want to delete.

```html
{{#each images}}
  Delete {{this.name}}: {{> FS.DeleteButton class="btn btn-danger btn-xs"}}
{{/each}}
```

By default, the button says "Delete". If you want to use different text or HTML within the button element, simply
use the component as a block helper, like this:

```html
{{#each images}}
  Delete {{this.name}}: {{#FS.DeleteButton class="btn btn-danger btn-xs"}}Delete Me{{/FS.DeleteButton}}
{{/each}}
```

### FS.UploadProgressBar

Renders a reactive progress bar, showing either the upload progress for a single file or the upload progress for all files currently being uploaded.

Use where the current context is the `FS.File` instance for which you want progress:

```html
{{#each images}}
  {{#unless this.isUploaded}}
  {{> FS.UploadProgressBar}}
  {{/unless}}
{{/each}}
```

You can optionally add attributes such as `class`.

By default, an HTML5 progress element is rendered. To render a bootstrap3 progress bar instead:

```html
{{> FS.UploadProgressBar bootstrap=true}}
```

Any HTML attributes you add, such as class, are added to the `div.progress-bar`, so you could add the `progress-bar-success` class. With the most recent version of bootstrap, it is valid to add `progress-striped` or `active` classes to `div.progress-bar`, so these attributes would also be acceptable. An additional option to show the percantage text on top of the progress bar is toggled using the `showPercent` attribute. An example of a green, striped, animated progress bar with the percantage text overlayed is shown below.

```html
{{> FS.UploadProgressBar bootstrap=true class='progress-bar-success progress-bar-striped active' showPercent=true}}
```

To render a semantic-ui progress bar instead:

```html
{{> FS.UploadProgressBar semantic=true}}
```

Any HTML attributes you add, such as class, are added to the outer div.

If you want the progress bar to reflect the combined progress of all files currently being uploaded, don't use it
with an `FS.File` instance as the context.

## Event Handler Creators

This package also provides one event handler creator.

### FS.EventHandlers.insertFiles(collection, [options])

Simplifies some of the repetitive code for making an event handler that does a file insert.

* **collection:** An `FS.Collection` instance.
* **options:**
    * **metadata:** (Optional) A function that takes an `FS.File` instance as its argument and returns an object containing the metadata to be added to the file object.
    * **after:** (Optional) A callback function for the `FS.Collection.insert` call.

Example:

```js
Template.files.events({
	'dropped .imageArea': FS.EventHandlers.insertFiles(Images, {
	  metadata: function (fileObj) {
	    return {
	      owner: Meteor.userId(),
	      foo: "bar"
	    };
	  },
	  after: function (error, fileObj) {
	    console.log("Inserted", fileObj.name);
	  }
	}),
	'change #imageInput': FS.EventHandlers.insertFiles(Images, {
	  metadata: function (fileObj) {
	    return {
	      owner: Meteor.userId(),
	      foo: "bar"
	    };
	  },
	  after: function (error, fileObj) {
	    console.log("Inserted", fileObj.name);
	  }
	}),
});
```

By using this function to create your event handlers for input change events and the `dropped` event (provided by the `raix:ui-dropped-event` package), you don't have to write any of the code to loop over files, convert `File` to `FS.File`, attach metadata, or perform the insert.
