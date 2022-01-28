[![Build Status](https://travis-ci.org/aldeed/meteor-schema-index.png?branch=master)](https://travis-ci.org/aldeed/meteor-schema-index)

aldeed:schema-index
=========================

A Meteor package that allows you to control some MongoDB indexing from your SimpleSchema. This package is currently included automatically with the aldeed:collection2 package.

## Installation

In your Meteor app directory, enter:

```
$ meteor add aldeed:schema-index
```

## Usage

Use the `index` option to ensure a MongoDB index for a specific field:

```js
{
  title: {
    type: String,
    index: 1
  }
}
```

Set to `1` or `true` for an ascending index. Set to `-1` for a descending index. Or you may set this to another type of specific MongoDB index, such as `"2d"`. Indexes work on embedded sub-documents as well.

If you have created an index for a field by mistake and you want to remove or change it, set `index` to `false`:

```js
{
  "address.street": {
    type: String,
    index: false
  }
}
```

IMPORTANT: If you need to change anything about an index, you must first start the app with `index: false` to drop the old index, and then restart with the correct index properties.

If a field has the `unique` option set to `true`, the MongoDB index will be a unique index as well. Then on the server, Collection2 will rely on MongoDB to check uniqueness of your field, which is more efficient than our custom checking.

```js
{
  "pseudo": {
    type: String,
    index: true,
    unique: true
  }
}
```

For the `unique` option to work, `index` must be `true`, `1`, or `-1`. The error message for uniqueness is very generic. It's best to define your own using `MyCollection.simpleSchema().messages()`. The error type string is "notUnique".

You can use the `sparse` option along with the `index` and `unique` options to tell MongoDB to build a [sparse index](http://docs.mongodb.org/manual/core/index-sparse/#index-type-sparse). By default, MongoDB will only permit one document that lacks the indexed field. By setting the `sparse` option to `true`, the index will only contain entries for documents that have the indexed field. The index skips over any document that is missing the field. This is helpful when indexing on a key in an array of sub-documents. Learn more in the [MongoDB docs](http://docs.mongodb.org/manual/core/index-unique/#unique-index-and-missing-field).

All indexes are built in the background so indexing does *not* block other database queries. 

## Contributing

Anyone is welcome to contribute. Fork, make and test your changes (`meteor test-packages ./`), and then submit a pull request.

### Major Contributors

@mquandalle

(Add yourself if you should be listed here.)
