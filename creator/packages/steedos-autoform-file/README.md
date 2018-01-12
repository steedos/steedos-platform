Autoform File
=============

### Description ###
Upload and manage files with autoForm.

![Meteor autoform file](https://raw.githubusercontent.com/yogiben/meteor-autoform-file/master/readme/1.png)

Maintained by [Meteor Factory](https://meteorfactory.io). Professional Meteor development.

[![Meteor autoform file](https://raw.githubusercontent.com/yogiben/meteor-autoform-file/master/readme/meteor-factory.jpg)](http://meteorfactory.io)

### Quick Start ###
1) Install `meteor add yogiben:autoform-file`

2) Create your collectionFS (See [collectionFS](https://github.com/CollectionFS/Meteor-CollectionFS))
```coffeescript
@Images = new FS.Collection("images",
  stores: [new FS.Store.GridFS("images", {})]
)
```
3) Make sure the correct allow rules & subscriptions are set up on the collectionFS
```coffeescript
Images.allow
  insert: (userId, doc) ->
    true
  download: (userId)->
    true
```
and
```coffeescript
Meteor.publish 'images', ->
  Images.find()
```
and in your router.coffee
```coffeescript
  @route "profile",
    waitOn: ->
      [
        Meteor.subscribe 'images'
      ]
```
4) Define your schema and set the `autoform` property like in the example below
```coffeescript
Schemas = {}

@Posts = new Meteor.Collection('posts');

Schemas.Posts = new SimpleSchema
  title:
    type: String
    max: 60

  picture:
    type: String
    autoform:
      afFieldInput:
        type: 'fileUpload'
        collection: 'Images'
        label: 'Choose file' # optional

Posts.attachSchema(Schemas.Posts)
```

The `collection` property is the field name of your collectionFS.

5) Generate the form with `{{> quickform}}` or `{{#autoform}}`

e.g.
```
{{> quickForm collection="Posts" type="insert"}}
```

or

```
{{#autoForm collection="Posts" type="insert"}}
{{> afQuickField name="title"}}
{{> afQuickField name="picture"}}
<button type="submit" class="btn btn-primary">Insert</button>
{{/autoForm}}
```

###Multiple images###
If you want to use an array of images inside you have to define the autoform on on the [schema key](https://github.com/aldeed/meteor-simple-schema#schema-keys)

```coffeescript
Schemas.Posts = new SimpleSchema
  title:
    type: String
    max: 60

  pictures:
    type: [String]
    label: 'Choose file' # optional

  "pictures.$":
    autoform:
      afFieldInput:
        type: 'fileUpload',
        collection: 'Images'
```

###Security & optimization###
The above example is just a starting point. You should set your own custom `allow` rules and optimize your subscriptions.

### Customization ###
You can customize the button / remove text.

Defaults:
```
{{> afFieldInput name="picture" label="Choose file" remove-label="Remove"}}
```

Also it is possible to customize accept attribute

add it in your schema definition:
```coffeescript
picture:
  type: String
  autoform:
    afFieldInput:
      type: 'fileUpload'
      collection: 'Images'
      accept: 'image/*'
      label: 'Choose file' # optional

```

### Upload progress bar ###

By default `FS.UploadProgressTemplate` from [steedos:cfs-ui](https://github.com/CollectionFS/Meteor-cfs-ui) package is used to display upload progress. You can specify your own template with `uploadProgressTemplate` option, e.g.

```coffeescript
picture:
  type: String
  autoform:
    afFieldInput:
      type: 'fileUpload'
      collection: 'Images'
      uploadProgressTemplate: 'myUploadProgressTemplate'
```

### Custom file preview ###

Your custom file preview template data context will be:

- *file* - FS.File instance
- *atts* - autoform atts

```coffeescript
picture:
  type: String
  autoform:
    afFieldInput:
      type: 'fileUpload'
      collection: 'Images'
      previewTemplate: 'myFilePreview'
```

```html
<template name="myFilePreview">
  <a href="{{file.url}}">{{file.original.name}}</a>
</template>
```

### Custom select/remove file buttons ###

Remember to add `js-af-select-file` and `js-af-remove-file` classes to nodes which should fire an event on click.

```coffeescript
picture:
  type: String
  autoform:
    afFieldInput:
      type: 'fileUpload'
      collection: 'Images'
      selectFileBtnTemplate: 'mySelectFileBtn'
      removeFileBtnTemplate: 'myRemoveFileBtn'
```

```html
<template name="mySelectFileBtn">
  <button type="button" class="js-af-select-file">Upload file</button>
</template>

<template name="myRemoveFileBtn">
  <button type="button" class="js-af-remove-file">Remove</button>
</template>
```

### Callbacks ###

**onBeforeInsert** - can be used to modify file (remember to return fileObj)

**onAfterInsert** - called after insert with two arguments: error object and file object

Please note that callback properties are functions that return callbacks. This is because autoform evaluates function attributes first.

```coffeescript
picture:
  type: String
  autoform:
    afFieldInput:
      type: 'fileUpload'
      collection: 'Images'
      onBeforeInsert: ->
        (fileObj) ->
          fileObj.name 'picture.png'
          fileObj
      onAfterInsert: ->
        (err, fileObj) ->
          if err
            alert 'Error'
          else
            alert 'Upload successful'
```
