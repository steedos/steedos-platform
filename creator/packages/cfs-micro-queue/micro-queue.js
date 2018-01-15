/** A basic LIFO or FIFO queue
  * This is better than a simple array with pop/shift because shift is O(n)
  * and can become slow with a large array.
  * @method MicroQueue
  * @constructor
  * @param {boolean} [lifo=false] Set true for `lifo`, default is `fifo`
  * This queue was build as the spinal basis for the [`PowerQueue`](#PowerQueue)
  * The interface is very basic and consists of:
  * `add`, `get`, `reset` Making it possible to write a custom micro-queue for
  * `PowerQueue`, such as a queue that is persisted into a database.
  *
  * Usage:
```js
  var foo = new MicroQueue(); // Basic FIFO queue
  foo.add(1);
  foo.add(2);
  foo.add(3);
  for (var i = 0; i < foo.length(); i++) {
    console.log(foo.get());
  }
```
  * The result should be: "1, 2, 3"
  */
MicroQueue = function(lifo) {
  var self = this, first = 0, last = -1, list = [];

  // The private reactive length property
  self._length = 0;
  var _lengthDeps = new Deps.Dependency();
  var maxKey = 0;
  /** @method MicroQueue.length
    * @reactive
    * @returns {number} Length / number of items in queue
    */
  self.length = function() {
    _lengthDeps.depend();
    return self._length;
  };

  /** @method MicroQueue.insert Add item to the queue
    * @param {any} value The item to add to the queue
    */
  self.insert = function(key, value) {
    // Compare key with first/last depending on LIFO to determine if it should
    // be added in reverse order. We track the greatest key entered - if we insert
    // a key lower than this we should add it the the opposite end of the queue
    // We are compensating for the true use of keys in micro-queue its not truly
    // ordered by keys but we do try to order just a bit without impacting performance too much.
    // Tasks can be cut off from the power-queue typically unordered since tasks
    // will often run async
    if (key > maxKey) maxKey = key;
    // If the key is an older key then "reinsert" item into the queue
    if (key < maxKey && first > 0) {
      list[--first] = {key: key, value: value};
    } else {
      list[++last] = {key: key, value: value};
    }
    self._length++;
    _lengthDeps.changed();
  };

  /** @method MicroQueue.getFirstItem Get next item from queue
    * @return {any} The item that was next in line
    */
  self.getFirstItem = function() {
    var value;
    if (first > last)
      return; // queue empty
    if (lifo) {
      value = list[last].value;
      delete list[last]; // help garbage collector
      last--;
    } else {
      value = list[first].value;
      delete list[first]; // help garbage collector
      first++;
    }
    self._length--;
    _lengthDeps.changed();
    return value;
  };

  /** @method MicroQueue.reset Reset the queue
    * This method will empty all data in the queue.
    */
  self.reset = function() {
    first = 0;
    last = -1;
    self._length = 0;
    list = [];
    _lengthDeps.changed();
  };

  self.forEach = function(f, noneReactive) {
    if (!noneReactive) _lengthDeps.depend();
    for (var i = first; i <= last; i++) {
      f(list[i].value, list[i].key, i);
    }
  };

  self.forEachReverse = function(f, noneReactive) {
    if (!noneReactive) _lengthDeps.depend();

    for (var i = last; i >= first; i--) {
      f(list[i].value, list[i].key, i);
    }
  };

  self.remove = function(id) {
    var newList = [];
    var removed = 0;

    self.forEach(function(value, key, i) {
      if (id === key) {
        removed++;
      } else {
        newList[i - removed] = {key: key, value: value};
      }
    });
    last -= removed;
    self._length -= removed;
    list = newList;
    _lengthDeps.changed();
  };

  self.fetch = function(noneReactive) {
    var result = [];
    self.forEach(function(value, key, i) {
      return result.push(value);
    }, noneReactive);
    return result;
  };
};
