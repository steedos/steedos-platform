# Meteor Collection Hooks [![Build Status](https://travis-ci.org/matb33/meteor-collection-hooks.png?branch=master)](https://travis-ci.org/matb33/meteor-collection-hooks)

Extends Mongo.Collection with `before`/`after` hooks for `insert`, `update`, `remove`, `find`, and `findOne`.

Works across client, server or a mix. Also works when a client initiates a collection method and the server runs the hook, all while respecting the collection validators (allow/deny).

Please refer to [History.md](History.md) for a summary of recent changes.

## Getting Started

Installation:

```
meteor add matb33:collection-hooks
```

--------------------------------------------------------------------------------

### .before.insert(userId, doc)

Fired before the doc is inserted.

Allows you to modify doc as needed, or run additional
functionality

- `this.transform()` obtains transformed version of document, if a transform was
defined.

```javascript
var test = new Mongo.Collection("test");

test.before.insert(function (userId, doc) {
  doc.createdAt = Date.now();
});
```

--------------------------------------------------------------------------------

### .before.update(userId, doc, fieldNames, modifier, options)

Fired before the doc is updated.

Allows you to to change the `modifier` as needed, or run additional
functionality.

- `this.transform()` obtains transformed version of document, if a transform was
defined.

```javascript
test.before.update(function (userId, doc, fieldNames, modifier, options) {
  modifier.$set = modifier.$set || {};
  modifier.$set.modifiedAt = Date.now();
});
```

__Important__: Note that we are changing `modifier`, and not `doc`.
Changing `doc` won't have any effect as the document is a copy and is not what
ultimately gets sent down to the underlying `update` method.

--------------------------------------------------------------------------------

### .before.remove(userId, doc)

Fired just before the doc is removed.

Allows you to to affect your system while the document is still in
existence -- useful for maintaining system integrity, such as cascading deletes.

- `this.transform()` obtains transformed version of document, if a transform was
defined.

```javascript
test.before.remove(function (userId, doc) {
  // ...
});
```

--------------------------------------------------------------------------------

### .before.upsert(userId, selector, modifier, options)

Fired before the doc is upserted.

Allows you to to change the `modifier` as needed, or run additional
functionality.

```javascript
test.before.upsert(function (userId, selector, modifier, options) {
  modifier.$set = modifier.$set || {};
  modifier.$set.modifiedAt = Date.now();
});
```

Note that calling `upsert` will always fire `.before.upsert` hooks, but will
call either `.after.insert` or `.after.update` hooks depending on the outcome of
the `upsert` operation. There is no such thing as a `.after.upsert` hook at this
time.

--------------------------------------------------------------------------------

### .after.insert(userId, doc)

Fired after the doc was inserted.

Allows you to run post-insert tasks, such as sending notifications
of new document insertions.

- `this.transform()` obtains transformed version of document, if a transform was
defined;
- `this._id` holds the newly inserted `_id` if available.

```javascript
test.after.insert(function (userId, doc) {
  // ...
});
```

--------------------------------------------------------------------------------

### .after.update(userId, doc, fieldNames, modifier, options)

Fired after the doc was updated.

Allows you to to run post-update tasks, potentially comparing the
previous and new documents to take further action.

- `this.previous` contains the document before it was updated.
  - The optional `fetchPrevious` option, when set to false, will not fetch
    documents before running the hooks. `this.previous` will then not be
    available. The default behavior is to fetch the documents.
- `this.transform()` obtains transformed version of document, if a transform was
  defined. Note that this function accepts an optional parameter to specify the
  document to transform — useful to transform previous:
  `this.transform(this.previous)`.

```javascript
test.after.update(function (userId, doc, fieldNames, modifier, options) {
  // ...
}, {fetchPrevious: true/false});
```

__Important:__ If you have multiple hooks defined, and at least one of them does
*not* specify `fetchPrevious: false`, then the documents *will* be fetched
and provided as `this.previous` to all hook callbacks. All after-update hooks
for the same collection must have `fetchPrevious: false` set in order to
effectively disable the pre-fetching of documents.

It is instead recommended to use the collection-wide options (e.g.
`MyCollection.hookOptions.after.update = {fetchPrevious: false};`).

--------------------------------------------------------------------------------

### .after.remove(userId, doc)

Fired after the doc was removed.

`doc` contains a copy of the document before it was removed.

Allows you to to run post-removal tasks that don't necessarily depend
on the document being found in the database (external service clean-up for
instance).

- `this.transform()` obtains transformed version of document, if a transform was
defined.

```javascript
test.after.remove(function (userId, doc) {
  // ...
});
```

--------------------------------------------------------------------------------

### .before.find(userId, selector, options)

Fired before a find query.

Allows you to to adjust selector/options on-the-fly.

```javascript
test.before.find(function (userId, selector, options) {
  // ...
});
```

--------------------------------------------------------------------------------

### .after.find(userId, selector, options, cursor)

Fired after a find query.

Allows you to to act on a given find query. The cursor resulting from
the query is provided as the last argument for convenience.

```javascript
test.after.find(function (userId, selector, options, cursor) {
  // ...
});
```

--------------------------------------------------------------------------------

### .before.findOne(userId, selector, options)

Fired before a findOne query.

Allows you to to adjust selector/options on-the-fly.

```javascript
test.before.findOne(function (userId, selector, options) {
  // ...
});
```

--------------------------------------------------------------------------------

### .after.findOne(userId, selector, options, doc)

Fired after a findOne query.

Allows you to to act on a given findOne query. The document resulting
from the query is provided as the last argument for convenience.

```javascript
test.after.findOne(function (userId, selector, options, doc) {
  // ...
});
```

--------------------------------------------------------------------------------

## Direct access (circumventing hooks)

All compatible methods have a `direct` version that circumvent any defined hooks. For example:

```javascript
collection.direct.insert({_id: "test", test: 1});
collection.direct.update({_id: "test"}, {$set: {test: 1}});
collection.direct.find({test: 1});
collection.direct.findOne({test: 1});
collection.direct.remove({_id: "test"});
```

--------------------------------------------------------------------------------

## Default options

As of version 0.7.0, options can be passed to hook definitions. Default options
can be specified globally and on a per-collection basis for all or some hooks,
with more specific ones having higher specificity.

Examples (in order of least specific to most specific):

```javascript
CollectionHooks.defaults.all.all = {exampleOption: 1};

CollectionHooks.defaults.before.all = {exampleOption: 2};
CollectionHooks.defaults.after.all = {exampleOption: 3};

CollectionHooks.defaults.all.update = {exampleOption: 4};
CollectionHooks.defaults.all.remove = {exampleOption: 5};

CollectionHooks.defaults.before.insert = {exampleOption: 6};
CollectionHooks.defaults.after.remove = {exampleOption: 7};
```

Similarly, collection-wide options can be defined (these have a higher
specificity than the global defaults from above):

```javascript
var testCollection = new Mongo.Collection("test");

testCollection.hookOptions.all.all = {exampleOption: 1};

testCollection.hookOptions.before.all = {exampleOption: 2};
testCollection.hookOptions.after.all = {exampleOption: 3};

testCollection.hookOptions.all.update = {exampleOption: 4};
testCollection.hookOptions.all.remove = {exampleOption: 5};

testCollection.hookOptions.before.insert = {exampleOption: 6};
testCollection.hookOptions.after.remove = {exampleOption: 7};
```

_Currently (as of 0.7.0), only `fetchPrevious` is implemented as an option, and
is only relevant to after-update hooks._

--------------------------------------------------------------------------------

## Additional notes

- Returning `false` in any `before` hook will prevent the underlying method (and
subsequent `after` hooks) from executing. Note that all `before` hooks will
still continue to run even if the first hook returns `false`.

- ~~If you wish to make `userId` available to a `find` query in a `publish`
function, try the technique detailed in this [comment](https://github.com/matb33/meteor-collection-hooks/issues/7#issuecomment-24021616)~~ `userId` is available to `find` and `findOne` queries that were invoked within a `publish` function.

- All hook callbacks have `this._super` available to them (the underlying
method) as well as `this.context`, the equivalent of `this` to the underlying
method. Additionally, `this.args` contain the original arguments passed to the
method and can be modified by reference (for example, modifying a selector in a
`before` hook so that the underlying method uses this new selector).

- It is quite normal for `userId` to sometimes be unavailable to hook callbacks
in some circumstances. For example, if an `update` is fired from the server
with no user context, the server certainly won't be able to provide any
particular userId.

- You can define a `defaultUserId` in case you want to pass an userId to the hooks but there is no context. For instance if you are executing and API endpoint where the `userId` is derived from a token. Just assign the userId to `CollectionHooks.defaultUserId`. It will be overriden by the userId of the context if it exists.

- If, like me, you transform `Meteor.users` through a [round-about way](https://github.com/matb33/meteor-collection-hooks/issues/15#issuecomment-25809919) involving
`find` and `findOne`, then you won't be able to use `this.transform()`. Instead,
grab the transformed user with `findOne`.

- When adding a hook, a handler object is returned with these methods:
  - `remove()`: will remove that particular hook;
  - `replace(callback, options)`: will replace the hook callback and options.

- If your hook is defined in common code (both server and client), it will run
twice: once on the server and once on the client. If your intention is for the
hook to run only once, make sure the hook is defined somewhere where only either
the client or the server reads it. *When in doubt, define your hooks on the
server.*

- Both `update` and `remove` internally make use of `find`, so be aware that
`find`/`findOne` hooks can fire for those methods.

- `find` hooks are also fired when fetching documents for `update`, `upsert` and `remove` hooks.

--------------------------------------------------------------------------------

## Maintainers

- Mathieu Bouchard ([matb33](https://github.com/matb33))
- Andrew Mao ([mizzao](https://github.com/mizzao))
- Simon Fridlund ([zimme](https://github.com/zimme))

## Contributors

- Eric Dobbertin ([aldeed](https://github.com/aldeed))
- Kevin Kaland ([wizonesolutions](https://github.com/wizonesolutions))
- Jonathan James ([jonjamz](https://github.com/jonjamz))
- Dave Workman ([davidworkman9](https://github.com/davidworkman9))
- Tarang Patel ([Tarangp](https://github.com/Tarangp))
- Nathan Strauser ([nate-strauser](https://github.com/nate-strauser))
- Hubert OG ([subhog](https://github.com/subhog))
- Richard Lai ([rclai](https://github.com/rclai))
- Sahebjot Singh ([raunaqrox](https://github.com/raunaqrox))
- Aram Kocharyan ([aramk](https://github.com/aramk))
- Pierre Ozoux ([pierreozoux](https://github.com/pierreozoux))
- Tom Coleman ([tmeasday](https://github.com/tmeasday))
- Eric Jackson ([repjackson](https://github.com/repjackson))
