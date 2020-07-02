## vNEXT

* Align return values with original methods when a hook returns `false`
* Always run `find` hooks when fetching documents for `update`, `upsert` and `remove` hooks
* Fix unsafe `selector` in `before.find` and `before.findOne` when called without arguments. This is potentially a *breaking change* for those who are relying on the current behavior of `selector` in `before.find` and `before.findOne`
* Add support for update/upsert hooks to run on a different selector based on custom options when used together with a find hook that manipulates the selector based on custom options
* Fix Meteor.publish override, the previous override resulted in false positives of autopublish warning
* Use spacejam for headless testing, will make headless testing work locally
* Add support for the new modifiers $max, $min and $currentDate
* No longer fetch documents when no hooks are defined

## v0.8.3

* If an async upsert operation returns an error, funnel it to the after.insert hook, fixes https://github.com/matb33/meteor-collection-hooks/issues/185
* Add a note in the README concerning the use of `find` in `update` and `remove`, closes https://github.com/matb33/meteor-collection-hooks/issues/191
* Handle mongo object _id (with result, ops, etc) in after insert by extracting the _id from ops, fixes https://github.com/meteor/meteor/issues/7409

## v0.8.1

* Provide helper CollectionHooks.modify that gives the developer server access to the typically client-only LocalCollection._modify
* Fix doc having only _id property in after.insert triggered by an upsert when using $set, fixes https://github.com/matb33/meteor-collection-hooks/issues/156

## v0.8.0

* Add support for `upsert` hooks. This is potentially a *breaking change* for those relying on `before.update` for `upsert`, as the behavior has changed to fire `before.upsert` instead, and either `after.insert` or `after.update` depending on the outcome of the upsert operation

## v0.7.15

* When creating a sub-class of Mongo.Collection, the constructor of the sub-class will now be able to inherit from the wrapped constructor
* Throwing an error in an async before hook will pass the error to the callback as the first argument

## v0.7.14

* Setting fetchPrevious to false should not prevent cloning options and modifier for use in after update hooks, fixes https://github.com/matb33/meteor-collection-hooks/issues/97 and https://github.com/matb33/meteor-collection-hooks/issues/138

## v0.7.13

* Move getUserId utility function to globally accessible CollectionHooks.getUserId

## v0.7.12

* Fix typo in update advice, where the local variable docIds was declared as docsIds and thus docIds was being leaked into global scope, causing weird side-effects as experienced in https://github.com/matb33/meteor-collection-hooks/issues/109#issuecomment-95243659
* Add MIT license file

## v0.7.11

* Fix update and insert by string _id (https://github.com/matb33/meteor-collection-hooks/issues/89 and likely https://github.com/matb33/meteor-collection-hooks/issues/90)

## v0.7.10

* Add tests to verify direct update and insert by string _id (https://github.com/matb33/meteor-collection-hooks/issues/89)
* Set api.versionsFrom to 1.0.3

## v0.7.9

* Add tests to verify hook functionality against CollectionFS (https://github.com/matb33/meteor-collection-hooks/issues/84)

## v0.7.8

* Fix instances of direct calls returning raw data instead of the massaged versions (such as insert returning an object instead of _id) (https://github.com/matb33/meteor-collection-hooks/issues/86, https://github.com/matb33/meteor-collection-hooks/issues/73)

## v0.7.7

* Remove bind polyfill (https://github.com/matb33/meteor-collection-hooks/issues/77)

## v0.7.6

* Use versionsFrom 0.9.1
* Fix `new Meteor.Collection` so as not to have to re-assign prototype

## v0.7.5

* Fix backward compatibility issue (https://github.com/meteor/meteor/issues/2549)

## v0.7.4

* Update for Meteor 0.9.1

## v0.7.3

* **Update for Meteor 0.9**
* Store the value of `this.userId` from a `Meteor.publish` function in an environment variable so it is preserved across yielding operations

## v0.7.2

* Allow specifying hook options on a per-collection basis

## v0.7.1

* Fix direct implementation and associated tests (#46)

## v0.7.0

* Implement second parameter `options` for all hooks (`coll.before.update(func, {option: 123})`)
* Add global `CollectionHooks.defaults` to specify options that apply to all or specific hooks
* Add `fetchPrevious` option, which must be set to `false` to prevent fetching `this.previous` (which can also be set via global `CollectionHooks.defaults`) (#41)

## v0.6.7

* Eliminate unnecessary reduction in performance from iterating through individual documents when no hooks are defined. (#38)

## v0.6.6

* Add automated testing and additional tests for `userId` in publish functions. (#21)
* Add functions for direct operations on underlying collection, ignoring hooks. (#3)
* Update argument/input logic of hooks for better compatibility with other packages. (#24)
