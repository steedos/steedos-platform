steedos:cfs-micro-queue [![Build Status](https://travis-ci.org/CollectionFS/Meteor-micro-queue.png?branch=master)](https://travis-ci.org/CollectionFS/Meteor-micro-queue)
=========

MicroQueue is a simple LIFO or FIFO queue. It's faster than a simple array with `pop`/`shift` because `shift` is O(n)
and can become slow with a large array.

This queue was built as a [spinal-queue](https://github.com/CollectionFS/Meteor-power-queue/blob/master/spinal-queue.spec.md) for the [`PowerQueue`](https://github.com/CollectionFS/Meteor-power-queue) package. The interface is very basic and consists of `add`, `get`, and `reset`, making it possible to write a custom micro-queue for `PowerQueue`, such as a queue that is persisted into a database.

> Note: MicroQueue can be used with `PowerQueue` but `MicroQueue` lacks the
> properties of n key ordered list - *It does try to compensate when reinserting keys - this is especially optimized for the [PowerQueue](https://github.com/CollectionFS/Meteor-powerqueue)*

And... It's powered by Meteor's reactive sugar :)

Kind regards Eric(@aldeed) and Morten(@raix)

Happy coding!!

#API
[API Documentation](api.md)

From the docs:
#### <a name="MicroQueue"></a>new MicroQueue([lifo])&nbsp;&nbsp;<sub><i>Anywhere</i></sub> ####

__Arguments__

* __lifo__ *{boolean}*    (Optional = false)
Set true for `lifo`, default is `fifo`


## Usage:
```js
var foo = new MicroQueue(); // Basic FIFO queue
foo.add(1);
foo.add(2);
foo.add(3);
for (var i = 0; i < foo.length(); i++) {
  console.log(foo.get());
}
```
The result should be: "1, 2, 3".

```
MicroQueue = function(lifo) { ...
```

See [micro-queue.js:24](micro-queue.js#L24).


# Contribute

Here's the [complete API documentation](internal.api.md), including private methods.

To update the docs, run `npm install docmeteor` then

```bash
$ docmeteor
```
