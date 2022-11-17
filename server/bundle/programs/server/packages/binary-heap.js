(function () {

/* Imports */
var Meteor = Package.meteor.Meteor;
var global = Package.meteor.global;
var meteorEnv = Package.meteor.meteorEnv;
var IdMap = Package['id-map'].IdMap;
var ECMAScript = Package.ecmascript.ECMAScript;
var meteorInstall = Package.modules.meteorInstall;
var Promise = Package.promise.Promise;

/* Package-scope variables */
var idx, MaxHeap, MinHeap, MinMaxHeap;

var require = meteorInstall({"node_modules":{"meteor":{"binary-heap":{"binary-heap.js":function module(require,exports,module){

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                  //
// packages/binary-heap/binary-heap.js                                                                              //
//                                                                                                                  //
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                    //
module.link("./max-heap.js", {
  MaxHeap: "MaxHeap"
}, 0);
module.link("./min-heap.js", {
  MinHeap: "MinHeap"
}, 1);
module.link("./min-max-heap.js", {
  MinMaxHeap: "MinMaxHeap"
}, 2);
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"max-heap.js":function module(require,exports,module){

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                  //
// packages/binary-heap/max-heap.js                                                                                 //
//                                                                                                                  //
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                    //
module.export({
  MaxHeap: () => MaxHeap
});

class MaxHeap {
  constructor(comparator) {
    let options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    if (typeof comparator !== 'function') {
      throw new Error('Passed comparator is invalid, should be a comparison function');
    } // a C-style comparator that is given two values and returns a number,
    // negative if the first value is less than the second, positive if the second
    // value is greater than the first and zero if they are equal.


    this._comparator = comparator;

    if (!options.IdMap) {
      options.IdMap = IdMap;
    } // _heapIdx maps an id to an index in the Heap array the corresponding value
    // is located on.


    this._heapIdx = new options.IdMap(); // The Heap data-structure implemented as a 0-based contiguous array where
    // every item on index idx is a node in a complete binary tree. Every node can
    // have children on indexes idx*2+1 and idx*2+2, except for the leaves. Every
    // node has a parent on index (idx-1)/2;

    this._heap = []; // If the initial array is passed, we can build the heap in linear time
    // complexity (O(N)) compared to linearithmic time complexity (O(nlogn)) if
    // we push elements one by one.

    if (Array.isArray(options.initData)) {
      this._initFromData(options.initData);
    }
  } // Builds a new heap in-place in linear time based on passed data


  _initFromData(data) {
    this._heap = data.map((_ref) => {
      let {
        id,
        value
      } = _ref;
      return {
        id,
        value
      };
    });
    data.forEach((_ref2, i) => {
      let {
        id
      } = _ref2;
      return this._heapIdx.set(id, i);
    });

    if (!data.length) {
      return;
    } // start from the first non-leaf - the parent of the last leaf


    for (let i = parentIdx(data.length - 1); i >= 0; i--) {
      this._downHeap(i);
    }
  }

  _downHeap(idx) {
    while (leftChildIdx(idx) < this.size()) {
      const left = leftChildIdx(idx);
      const right = rightChildIdx(idx);
      let largest = idx;

      if (left < this.size()) {
        largest = this._maxIndex(largest, left);
      }

      if (right < this.size()) {
        largest = this._maxIndex(largest, right);
      }

      if (largest === idx) {
        break;
      }

      this._swap(largest, idx);

      idx = largest;
    }
  }

  _upHeap(idx) {
    while (idx > 0) {
      const parent = parentIdx(idx);

      if (this._maxIndex(parent, idx) === idx) {
        this._swap(parent, idx);

        idx = parent;
      } else {
        break;
      }
    }
  }

  _maxIndex(idxA, idxB) {
    const valueA = this._get(idxA);

    const valueB = this._get(idxB);

    return this._comparator(valueA, valueB) >= 0 ? idxA : idxB;
  } // Internal: gets raw data object placed on idxth place in heap


  _get(idx) {
    return this._heap[idx].value;
  }

  _swap(idxA, idxB) {
    const recA = this._heap[idxA];
    const recB = this._heap[idxB];

    this._heapIdx.set(recA.id, idxB);

    this._heapIdx.set(recB.id, idxA);

    this._heap[idxA] = recB;
    this._heap[idxB] = recA;
  }

  get(id) {
    return this.has(id) ? this._get(this._heapIdx.get(id)) : null;
  }

  set(id, value) {
    if (this.has(id)) {
      if (this.get(id) === value) {
        return;
      }

      const idx = this._heapIdx.get(id);

      this._heap[idx].value = value; // Fix the new value's position
      // Either bubble new value up if it is greater than its parent

      this._upHeap(idx); // or bubble it down if it is smaller than one of its children


      this._downHeap(idx);
    } else {
      this._heapIdx.set(id, this._heap.length);

      this._heap.push({
        id,
        value
      });

      this._upHeap(this._heap.length - 1);
    }
  }

  remove(id) {
    if (this.has(id)) {
      const last = this._heap.length - 1;

      const idx = this._heapIdx.get(id);

      if (idx !== last) {
        this._swap(idx, last);

        this._heap.pop();

        this._heapIdx.remove(id); // Fix the swapped value's position


        this._upHeap(idx);

        this._downHeap(idx);
      } else {
        this._heap.pop();

        this._heapIdx.remove(id);
      }
    }
  }

  has(id) {
    return this._heapIdx.has(id);
  }

  empty() {
    return !this.size();
  }

  clear() {
    this._heap = [];

    this._heapIdx.clear();
  } // iterate over values in no particular order


  forEach(iterator) {
    this._heap.forEach(obj => iterator(obj.value, obj.id));
  }

  size() {
    return this._heap.length;
  }

  setDefault(id, def) {
    if (this.has(id)) {
      return this.get(id);
    }

    this.set(id, def);
    return def;
  }

  clone() {
    const clone = new MaxHeap(this._comparator, this._heap);
    return clone;
  }

  maxElementId() {
    return this.size() ? this._heap[0].id : null;
  }

  _selfCheck() {
    for (let i = 1; i < this._heap.length; i++) {
      if (this._maxIndex(parentIdx(i), i) !== parentIdx(i)) {
        throw new Error("An item with id ".concat(this._heap[i].id) + " has a parent younger than it: " + this._heap[parentIdx(i)].id);
      }
    }
  }

}

const leftChildIdx = i => i * 2 + 1;

const rightChildIdx = i => i * 2 + 2;

const parentIdx = i => i - 1 >> 1;
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"min-heap.js":function module(require,exports,module){

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                  //
// packages/binary-heap/min-heap.js                                                                                 //
//                                                                                                                  //
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                    //
module.export({
  MinHeap: () => MinHeap
});
let MaxHeap;
module.link("./max-heap.js", {
  MaxHeap(v) {
    MaxHeap = v;
  }

}, 0);

class MinHeap extends MaxHeap {
  constructor(comparator, options) {
    super((a, b) => -comparator(a, b), options);
  }

  maxElementId() {
    throw new Error("Cannot call maxElementId on MinHeap");
  }

  minElementId() {
    return super.maxElementId();
  }

}

;
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"min-max-heap.js":function module(require,exports,module){

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                  //
// packages/binary-heap/min-max-heap.js                                                                             //
//                                                                                                                  //
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                    //
module.export({
  MinMaxHeap: () => MinMaxHeap
});
let MaxHeap;
module.link("./max-heap.js", {
  MaxHeap(v) {
    MaxHeap = v;
  }

}, 0);
let MinHeap;
module.link("./min-heap.js", {
  MinHeap(v) {
    MinHeap = v;
  }

}, 1);

class MinMaxHeap extends MaxHeap {
  constructor(comparator, options) {
    super(comparator, options);
    this._minHeap = new MinHeap(comparator, options);
  }

  set() {
    super.set(...arguments);

    this._minHeap.set(...arguments);
  }

  remove() {
    super.remove(...arguments);

    this._minHeap.remove(...arguments);
  }

  clear() {
    super.clear(...arguments);

    this._minHeap.clear(...arguments);
  }

  setDefault() {
    super.setDefault(...arguments);
    return this._minHeap.setDefault(...arguments);
  }

  clone() {
    const clone = new MinMaxHeap(this._comparator, this._heap);
    return clone;
  }

  minElementId() {
    return this._minHeap.minElementId();
  }

}

;
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}}}}},{
  "extensions": [
    ".js",
    ".json"
  ]
});

var exports = require("/node_modules/meteor/binary-heap/binary-heap.js");

/* Exports */
Package._define("binary-heap", exports, {
  MaxHeap: MaxHeap,
  MinHeap: MinHeap,
  MinMaxHeap: MinMaxHeap
});

})();

//# sourceURL=meteor://💻app/packages/binary-heap.js
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvYmluYXJ5LWhlYXAvYmluYXJ5LWhlYXAuanMiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL2JpbmFyeS1oZWFwL21heC1oZWFwLmpzIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9iaW5hcnktaGVhcC9taW4taGVhcC5qcyIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvYmluYXJ5LWhlYXAvbWluLW1heC1oZWFwLmpzIl0sIm5hbWVzIjpbIm1vZHVsZSIsImxpbmsiLCJNYXhIZWFwIiwiTWluSGVhcCIsIk1pbk1heEhlYXAiLCJleHBvcnQiLCJjb25zdHJ1Y3RvciIsImNvbXBhcmF0b3IiLCJvcHRpb25zIiwiRXJyb3IiLCJfY29tcGFyYXRvciIsIklkTWFwIiwiX2hlYXBJZHgiLCJfaGVhcCIsIkFycmF5IiwiaXNBcnJheSIsImluaXREYXRhIiwiX2luaXRGcm9tRGF0YSIsImRhdGEiLCJtYXAiLCJpZCIsInZhbHVlIiwiZm9yRWFjaCIsImkiLCJzZXQiLCJsZW5ndGgiLCJwYXJlbnRJZHgiLCJfZG93bkhlYXAiLCJpZHgiLCJsZWZ0Q2hpbGRJZHgiLCJzaXplIiwibGVmdCIsInJpZ2h0IiwicmlnaHRDaGlsZElkeCIsImxhcmdlc3QiLCJfbWF4SW5kZXgiLCJfc3dhcCIsIl91cEhlYXAiLCJwYXJlbnQiLCJpZHhBIiwiaWR4QiIsInZhbHVlQSIsIl9nZXQiLCJ2YWx1ZUIiLCJyZWNBIiwicmVjQiIsImdldCIsImhhcyIsInB1c2giLCJyZW1vdmUiLCJsYXN0IiwicG9wIiwiZW1wdHkiLCJjbGVhciIsIml0ZXJhdG9yIiwib2JqIiwic2V0RGVmYXVsdCIsImRlZiIsImNsb25lIiwibWF4RWxlbWVudElkIiwiX3NlbGZDaGVjayIsInYiLCJhIiwiYiIsIm1pbkVsZW1lbnRJZCIsIl9taW5IZWFwIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUFBLE1BQU0sQ0FBQ0MsSUFB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LENBQUQsRUFBRztBQUFDMUQsV0FBTyxHQUFDMEQsQ0FBUjtBQUFVOztBQUF0QixDQUE1QixFQUFvRCxDQUFwRDs7QUFlbkgsTUFBTXpELFVBQU4sU0FBeUJGLE9BQXpCLENBQWlDO0FBQ3RDSSxhQUFXLENBQUNDLFVBQUQsRUFBYUMsT0FBYixFQUFzQjtBQUMvQixVQUFNRCxVQUFOLEVBQWtCQyxPQUFsQjtBQUNBLFNBQUt5RCxRQUFMLEdBQWdCLElBQUk5RCxPQUFKLENBQVlJLFVBQVosRUFBd0JDLE9BQXhCLENBQWhCO0FBQ0Q7O0FBRURnQixLQUFHLEdBQVU7QUFDWCxVQUFNQSxHQUFOLENBQVUsWUFBVjs7QUFDQSxTQUFLeUMsUUFBTCxDQUFjekMsR0FBZCxDQUFrQixZQUFsQjtBQUNEOztBQUVEeUIsUUFBTSxHQUFVO0FBQ2QsVUFBTUEsTUFBTixDQUFhLFlBQWI7O0FBQ0EsU0FBS2dCLFFBQUwsQ0FBY2hCLE1BQWQsQ0FBcUIsWUFBckI7QUFDRDs7QUFFREksT0FBSyxHQUFVO0FBQ2IsVUFBTUEsS0FBTixDQUFZLFlBQVo7O0FBQ0EsU0FBS1ksUUFBTCxDQUFjWixLQUFkLENBQW9CLFlBQXBCO0FBQ0Q7O0FBRURHLFlBQVUsR0FBVTtBQUNsQixVQUFNQSxVQUFOLENBQWlCLFlBQWpCO0FBQ0EsV0FBTyxLQUFLUyxRQUFMLENBQWNULFVBQWQsQ0FBeUIsWUFBekIsQ0FBUDtBQUNEOztBQUVERSxPQUFLLEdBQUc7QUFDTixVQUFNQSxLQUFLLEdBQUcsSUFBSXRELFVBQUosQ0FBZSxLQUFLTSxXQUFwQixFQUFpQyxLQUFLRyxLQUF0QyxDQUFkO0FBQ0EsV0FBTzZDLEtBQVA7QUFDRDs7QUFFRE0sY0FBWSxHQUFHO0FBQ2IsV0FBTyxLQUFLQyxRQUFMLENBQWNELFlBQWQsRUFBUDtBQUNEOztBQWpDcUM7O0FBbUN2QyxDIiwiZmlsZSI6Ii9wYWNrYWdlcy9iaW5hcnktaGVhcC5qcyIsInNvdXJjZXNDb250ZW50IjpbImV4cG9ydCB7IE1heEhlYXAgfSBmcm9tICcuL21heC1oZWFwLmpzJztcbmV4cG9ydCB7IE1pbkhlYXAgfSBmcm9tICcuL21pbi1oZWFwLmpzJztcbmV4cG9ydCB7IE1pbk1heEhlYXAgfSBmcm9tICcuL21pbi1tYXgtaGVhcC5qcyc7XG4iLCIvLyBDb25zdHJ1Y3RvciBvZiBIZWFwXG4vLyAtIGNvbXBhcmF0b3IgLSBGdW5jdGlvbiAtIGdpdmVuIHR3byBpdGVtcyByZXR1cm5zIGEgbnVtYmVyXG4vLyAtIG9wdGlvbnM6XG4vLyAgIC0gaW5pdERhdGEgLSBBcnJheSAtIE9wdGlvbmFsIC0gdGhlIGluaXRpYWwgZGF0YSBpbiBhIGZvcm1hdDpcbi8vICAgICAgICBPYmplY3Q6XG4vLyAgICAgICAgICAtIGlkIC0gU3RyaW5nIC0gdW5pcXVlIGlkIG9mIHRoZSBpdGVtXG4vLyAgICAgICAgICAtIHZhbHVlIC0gQW55IC0gdGhlIGRhdGEgdmFsdWVcbi8vICAgICAgZWFjaCB2YWx1ZSBpcyByZXRhaW5lZFxuLy8gICAtIElkTWFwIC0gQ29uc3RydWN0b3IgLSBPcHRpb25hbCAtIGN1c3RvbSBJZE1hcCBjbGFzcyB0byBzdG9yZSBpZC0+aW5kZXhcbi8vICAgICAgIG1hcHBpbmdzIGludGVybmFsbHkuIFN0YW5kYXJkIElkTWFwIGlzIHVzZWQgYnkgZGVmYXVsdC5cbmV4cG9ydCBjbGFzcyBNYXhIZWFwIHsgXG4gIGNvbnN0cnVjdG9yKGNvbXBhcmF0b3IsIG9wdGlvbnMgPSB7fSkge1xuICAgIGlmICh0eXBlb2YgY29tcGFyYXRvciAhPT0gJ2Z1bmN0aW9uJykge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdQYXNzZWQgY29tcGFyYXRvciBpcyBpbnZhbGlkLCBzaG91bGQgYmUgYSBjb21wYXJpc29uIGZ1bmN0aW9uJyk7XG4gICAgfVxuXG4gICAgLy8gYSBDLXN0eWxlIGNvbXBhcmF0b3IgdGhhdCBpcyBnaXZlbiB0d28gdmFsdWVzIGFuZCByZXR1cm5zIGEgbnVtYmVyLFxuICAgIC8vIG5lZ2F0aXZlIGlmIHRoZSBmaXJzdCB2YWx1ZSBpcyBsZXNzIHRoYW4gdGhlIHNlY29uZCwgcG9zaXRpdmUgaWYgdGhlIHNlY29uZFxuICAgIC8vIHZhbHVlIGlzIGdyZWF0ZXIgdGhhbiB0aGUgZmlyc3QgYW5kIHplcm8gaWYgdGhleSBhcmUgZXF1YWwuXG4gICAgdGhpcy5fY29tcGFyYXRvciA9IGNvbXBhcmF0b3I7XG5cbiAgICBpZiAoISBvcHRpb25zLklkTWFwKSB7XG4gICAgICBvcHRpb25zLklkTWFwID0gSWRNYXA7XG4gICAgfVxuXG4gICAgLy8gX2hlYXBJZHggbWFwcyBhbiBpZCB0byBhbiBpbmRleCBpbiB0aGUgSGVhcCBhcnJheSB0aGUgY29ycmVzcG9uZGluZyB2YWx1ZVxuICAgIC8vIGlzIGxvY2F0ZWQgb24uXG4gICAgdGhpcy5faGVhcElkeCA9IG5ldyBvcHRpb25zLklkTWFwO1xuXG4gICAgLy8gVGhlIEhlYXAgZGF0YS1zdHJ1Y3R1cmUgaW1wbGVtZW50ZWQgYXMgYSAwLWJhc2VkIGNvbnRpZ3VvdXMgYXJyYXkgd2hlcmVcbiAgICAvLyBldmVyeSBpdGVtIG9uIGluZGV4IGlkeCBpcyBhIG5vZGUgaW4gYSBjb21wbGV0ZSBiaW5hcnkgdHJlZS4gRXZlcnkgbm9kZSBjYW5cbiAgICAvLyBoYXZlIGNoaWxkcmVuIG9uIGluZGV4ZXMgaWR4KjIrMSBhbmQgaWR4KjIrMiwgZXhjZXB0IGZvciB0aGUgbGVhdmVzLiBFdmVyeVxuICAgIC8vIG5vZGUgaGFzIGEgcGFyZW50IG9uIGluZGV4IChpZHgtMSkvMjtcbiAgICB0aGlzLl9oZWFwID0gW107XG5cbiAgICAvLyBJZiB0aGUgaW5pdGlhbCBhcnJheSBpcyBwYXNzZWQsIHdlIGNhbiBidWlsZCB0aGUgaGVhcCBpbiBsaW5lYXIgdGltZVxuICAgIC8vIGNvbXBsZXhpdHkgKE8oTikpIGNvbXBhcmVkIHRvIGxpbmVhcml0aG1pYyB0aW1lIGNvbXBsZXhpdHkgKE8obmxvZ24pKSBpZlxuICAgIC8vIHdlIHB1c2ggZWxlbWVudHMgb25lIGJ5IG9uZS5cbiAgICBpZiAoQXJyYXkuaXNBcnJheShvcHRpb25zLmluaXREYXRhKSkge1xuICAgICAgdGhpcy5faW5pdEZyb21EYXRhKG9wdGlvbnMuaW5pdERhdGEpO1xuICAgIH1cbiAgfVxuXG4gIC8vIEJ1aWxkcyBhIG5ldyBoZWFwIGluLXBsYWNlIGluIGxpbmVhciB0aW1lIGJhc2VkIG9uIHBhc3NlZCBkYXRhXG4gIF9pbml0RnJvbURhdGEoZGF0YSkge1xuICAgIHRoaXMuX2hlYXAgPSBkYXRhLm1hcCgoeyBpZCwgdmFsdWUgfSkgPT4gKHsgaWQsIHZhbHVlIH0pKTtcblxuICAgIGRhdGEuZm9yRWFjaCgoeyBpZCB9LCBpKSA9PiB0aGlzLl9oZWFwSWR4LnNldChpZCwgaSkpO1xuXG4gICAgaWYgKCEgZGF0YS5sZW5ndGgpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICAvLyBzdGFydCBmcm9tIHRoZSBmaXJzdCBub24tbGVhZiAtIHRoZSBwYXJlbnQgb2YgdGhlIGxhc3QgbGVhZlxuICAgIGZvciAobGV0IGkgPSBwYXJlbnRJZHgoZGF0YS5sZW5ndGggLSAxKTsgaSA+PSAwOyBpLS0pIHtcbiAgICAgIHRoaXMuX2Rvd25IZWFwKGkpO1xuICAgIH1cbiAgfVxuXG4gIF9kb3duSGVhcChpZHgpIHtcbiAgICB3aGlsZSAobGVmdENoaWxkSWR4KGlkeCkgPCB0aGlzLnNpemUoKSkge1xuICAgICAgY29uc3QgbGVmdCA9IGxlZnRDaGlsZElkeChpZHgpO1xuICAgICAgY29uc3QgcmlnaHQgPSByaWdodENoaWxkSWR4KGlkeCk7XG4gICAgICBsZXQgbGFyZ2VzdCA9IGlkeDtcblxuICAgICAgaWYgKGxlZnQgPCB0aGlzLnNpemUoKSkge1xuICAgICAgICBsYXJnZXN0ID0gdGhpcy5fbWF4SW5kZXgobGFyZ2VzdCwgbGVmdCk7XG4gICAgICB9XG5cbiAgICAgIGlmIChyaWdodCA8IHRoaXMuc2l6ZSgpKSB7XG4gICAgICAgIGxhcmdlc3QgPSB0aGlzLl9tYXhJbmRleChsYXJnZXN0LCByaWdodCk7XG4gICAgICB9XG5cbiAgICAgIGlmIChsYXJnZXN0ID09PSBpZHgpIHtcbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG5cbiAgICAgIHRoaXMuX3N3YXAobGFyZ2VzdCwgaWR4KTtcbiAgICAgIGlkeCA9IGxhcmdlc3Q7XG4gICAgfVxuICB9XG5cbiAgX3VwSGVhcChpZHgpIHtcbiAgICB3aGlsZSAoaWR4ID4gMCkge1xuICAgICAgY29uc3QgcGFyZW50ID0gcGFyZW50SWR4KGlkeCk7XG4gICAgICBpZiAodGhpcy5fbWF4SW5kZXgocGFyZW50LCBpZHgpID09PSBpZHgpIHtcbiAgICAgICAgdGhpcy5fc3dhcChwYXJlbnQsIGlkeClcbiAgICAgICAgaWR4ID0gcGFyZW50O1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgX21heEluZGV4KGlkeEEsIGlkeEIpIHtcbiAgICBjb25zdCB2YWx1ZUEgPSB0aGlzLl9nZXQoaWR4QSk7XG4gICAgY29uc3QgdmFsdWVCID0gdGhpcy5fZ2V0KGlkeEIpO1xuICAgIHJldHVybiB0aGlzLl9jb21wYXJhdG9yKHZhbHVlQSwgdmFsdWVCKSA+PSAwID8gaWR4QSA6IGlkeEI7XG4gIH1cblxuICAvLyBJbnRlcm5hbDogZ2V0cyByYXcgZGF0YSBvYmplY3QgcGxhY2VkIG9uIGlkeHRoIHBsYWNlIGluIGhlYXBcbiAgX2dldChpZHgpIHtcbiAgICByZXR1cm4gdGhpcy5faGVhcFtpZHhdLnZhbHVlO1xuICB9XG5cbiAgX3N3YXAoaWR4QSwgaWR4Qikge1xuICAgIGNvbnN0IHJlY0EgPSB0aGlzLl9oZWFwW2lkeEFdO1xuICAgIGNvbnN0IHJlY0IgPSB0aGlzLl9oZWFwW2lkeEJdO1xuXG4gICAgdGhpcy5faGVhcElkeC5zZXQocmVjQS5pZCwgaWR4Qik7XG4gICAgdGhpcy5faGVhcElkeC5zZXQocmVjQi5pZCwgaWR4QSk7XG5cbiAgICB0aGlzLl9oZWFwW2lkeEFdID0gcmVjQjtcbiAgICB0aGlzLl9oZWFwW2lkeEJdID0gcmVjQTtcbiAgfVxuXG4gIGdldChpZCkge1xuICAgIHJldHVybiB0aGlzLmhhcyhpZCkgP1xuICAgICAgdGhpcy5fZ2V0KHRoaXMuX2hlYXBJZHguZ2V0KGlkKSkgOlxuICAgICAgbnVsbDtcbiAgfVxuXG4gIHNldChpZCwgdmFsdWUpIHtcbiAgICBpZiAodGhpcy5oYXMoaWQpKSB7XG4gICAgICBpZiAodGhpcy5nZXQoaWQpID09PSB2YWx1ZSkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIGNvbnN0IGlkeCA9IHRoaXMuX2hlYXBJZHguZ2V0KGlkKTtcbiAgICAgIHRoaXMuX2hlYXBbaWR4XS52YWx1ZSA9IHZhbHVlO1xuXG4gICAgICAvLyBGaXggdGhlIG5ldyB2YWx1ZSdzIHBvc2l0aW9uXG4gICAgICAvLyBFaXRoZXIgYnViYmxlIG5ldyB2YWx1ZSB1cCBpZiBpdCBpcyBncmVhdGVyIHRoYW4gaXRzIHBhcmVudFxuICAgICAgdGhpcy5fdXBIZWFwKGlkeCk7XG4gICAgICAvLyBvciBidWJibGUgaXQgZG93biBpZiBpdCBpcyBzbWFsbGVyIHRoYW4gb25lIG9mIGl0cyBjaGlsZHJlblxuICAgICAgdGhpcy5fZG93bkhlYXAoaWR4KTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5faGVhcElkeC5zZXQoaWQsIHRoaXMuX2hlYXAubGVuZ3RoKTtcbiAgICAgIHRoaXMuX2hlYXAucHVzaCh7IGlkLCB2YWx1ZSB9KTtcbiAgICAgIHRoaXMuX3VwSGVhcCh0aGlzLl9oZWFwLmxlbmd0aCAtIDEpO1xuICAgIH1cbiAgfVxuXG4gIHJlbW92ZShpZCkge1xuICAgIGlmICh0aGlzLmhhcyhpZCkpIHtcbiAgICAgIGNvbnN0IGxhc3QgPSB0aGlzLl9oZWFwLmxlbmd0aCAtIDE7XG4gICAgICBjb25zdCBpZHggPSB0aGlzLl9oZWFwSWR4LmdldChpZCk7XG5cbiAgICAgIGlmIChpZHggIT09IGxhc3QpIHtcbiAgICAgICAgdGhpcy5fc3dhcChpZHgsIGxhc3QpO1xuICAgICAgICB0aGlzLl9oZWFwLnBvcCgpO1xuICAgICAgICB0aGlzLl9oZWFwSWR4LnJlbW92ZShpZCk7XG5cbiAgICAgICAgLy8gRml4IHRoZSBzd2FwcGVkIHZhbHVlJ3MgcG9zaXRpb25cbiAgICAgICAgdGhpcy5fdXBIZWFwKGlkeCk7XG4gICAgICAgIHRoaXMuX2Rvd25IZWFwKGlkeCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLl9oZWFwLnBvcCgpO1xuICAgICAgICB0aGlzLl9oZWFwSWR4LnJlbW92ZShpZCk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgaGFzKGlkKSB7XG4gICAgcmV0dXJuIHRoaXMuX2hlYXBJZHguaGFzKGlkKTtcbiAgfVxuXG4gIGVtcHR5KCkge1xuICAgIHJldHVybiAhdGhpcy5zaXplKCk7XG4gIH1cblxuICBjbGVhcigpIHtcbiAgICB0aGlzLl9oZWFwID0gW107XG4gICAgdGhpcy5faGVhcElkeC5jbGVhcigpO1xuICB9XG5cbiAgLy8gaXRlcmF0ZSBvdmVyIHZhbHVlcyBpbiBubyBwYXJ0aWN1bGFyIG9yZGVyXG4gIGZvckVhY2goaXRlcmF0b3IpIHtcbiAgICB0aGlzLl9oZWFwLmZvckVhY2gob2JqID0+IGl0ZXJhdG9yKG9iai52YWx1ZSwgb2JqLmlkKSk7XG4gIH1cblxuICBzaXplKCkge1xuICAgIHJldHVybiB0aGlzLl9oZWFwLmxlbmd0aDtcbiAgfVxuXG4gIHNldERlZmF1bHQoaWQsIGRlZikge1xuICAgIGlmICh0aGlzLmhhcyhpZCkpIHtcbiAgICAgIHJldHVybiB0aGlzLmdldChpZCk7XG4gICAgfVxuXG4gICAgdGhpcy5zZXQoaWQsIGRlZik7XG4gICAgcmV0dXJuIGRlZjtcbiAgfVxuXG4gIGNsb25lKCkge1xuICAgIGNvbnN0IGNsb25lID0gbmV3IE1heEhlYXAodGhpcy5fY29tcGFyYXRvciwgdGhpcy5faGVhcCk7XG4gICAgcmV0dXJuIGNsb25lO1xuICB9XG5cbiAgbWF4RWxlbWVudElkKCkge1xuICAgIHJldHVybiB0aGlzLnNpemUoKSA/IHRoaXMuX2hlYXBbMF0uaWQgOiBudWxsO1xuICB9XG5cbiAgX3NlbGZDaGVjaygpIHtcbiAgICBmb3IgKGxldCBpID0gMTsgaSA8IHRoaXMuX2hlYXAubGVuZ3RoOyBpKyspIHtcbiAgICAgIGlmICh0aGlzLl9tYXhJbmRleChwYXJlbnRJZHgoaSksIGkpICE9PSBwYXJlbnRJZHgoaSkpIHtcbiAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYEFuIGl0ZW0gd2l0aCBpZCAke3RoaXMuX2hlYXBbaV0uaWR9YCArXG4gICAgICAgICAgICAgICAgICAgICAgICAgIFwiIGhhcyBhIHBhcmVudCB5b3VuZ2VyIHRoYW4gaXQ6IFwiICtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5faGVhcFtwYXJlbnRJZHgoaSldLmlkKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cbn1cblxuY29uc3QgbGVmdENoaWxkSWR4ID0gaSA9PiBpICogMiArIDE7XG5jb25zdCByaWdodENoaWxkSWR4ID0gaSA9PiBpICogMiArIDI7XG5jb25zdCBwYXJlbnRJZHggPSBpID0+IChpIC0gMSkgPj4gMTtcbiIsImltcG9ydCB7IE1heEhlYXAgfSBmcm9tICcuL21heC1oZWFwLmpzJztcblxuZXhwb3J0IGNsYXNzIE1pbkhlYXAgZXh0ZW5kcyBNYXhIZWFwIHtcbiAgY29uc3RydWN0b3IoY29tcGFyYXRvciwgb3B0aW9ucykge1xuICAgIHN1cGVyKChhLCBiKSA9PiAtY29tcGFyYXRvcihhLCBiKSwgb3B0aW9ucyk7XG4gIH1cblxuICBtYXhFbGVtZW50SWQoKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKFwiQ2Fubm90IGNhbGwgbWF4RWxlbWVudElkIG9uIE1pbkhlYXBcIik7XG4gIH1cblxuICBtaW5FbGVtZW50SWQoKSB7XG4gICAgcmV0dXJuIHN1cGVyLm1heEVsZW1lbnRJZCgpO1xuICB9XG59O1xuIiwiaW1wb3J0IHsgTWF4SGVhcCB9IGZyb20gJy4vbWF4LWhlYXAuanMnO1xuaW1wb3J0IHsgTWluSGVhcCB9IGZyb20gJy4vbWluLWhlYXAuanMnO1xuXG4vLyBUaGlzIGltcGxlbWVudGF0aW9uIG9mIE1pbi9NYXgtSGVhcCBpcyBqdXN0IGEgc3ViY2xhc3Mgb2YgTWF4LUhlYXBcbi8vIHdpdGggYSBNaW4tSGVhcCBhcyBhbiBlbmNhcHN1bGF0ZWQgcHJvcGVydHkuXG4vL1xuLy8gTW9zdCBvZiB0aGUgb3BlcmF0aW9ucyBhcmUganVzdCBwcm94eSBtZXRob2RzIHRvIGNhbGwgdGhlIHNhbWUgbWV0aG9kIG9uIGJvdGhcbi8vIGhlYXBzLlxuLy9cbi8vIFRoaXMgaW1wbGVtZW50YXRpb24gdGFrZXMgMipOIG1lbW9yeSBidXQgaXMgZmFpcmx5IHNpbXBsZSB0byB3cml0ZSBhbmRcbi8vIHVuZGVyc3RhbmQuIEFuZCB0aGUgY29uc3RhbnQgZmFjdG9yIG9mIGEgc2ltcGxlIEhlYXAgaXMgdXN1YWxseSBzbWFsbGVyXG4vLyBjb21wYXJlZCB0byBvdGhlciB0d28td2F5IHByaW9yaXR5IHF1ZXVlcyBsaWtlIE1pbi9NYXggSGVhcHNcbi8vIChodHRwOi8vd3d3LmNzLm90YWdvLmFjLm56L3N0YWZmcHJpdi9taWtlL1BhcGVycy9NaW5NYXhIZWFwcy9NaW5NYXhIZWFwcy5wZGYpXG4vLyBhbmQgSW50ZXJ2YWwgSGVhcHNcbi8vIChodHRwOi8vd3d3LmNpc2UudWZsLmVkdS9+c2FobmkvZHNhYWMvZW5yaWNoL2MxMy9kb3VibGUuaHRtKVxuZXhwb3J0IGNsYXNzIE1pbk1heEhlYXAgZXh0ZW5kcyBNYXhIZWFwIHtcbiAgY29uc3RydWN0b3IoY29tcGFyYXRvciwgb3B0aW9ucykge1xuICAgIHN1cGVyKGNvbXBhcmF0b3IsIG9wdGlvbnMpO1xuICAgIHRoaXMuX21pbkhlYXAgPSBuZXcgTWluSGVhcChjb21wYXJhdG9yLCBvcHRpb25zKTtcbiAgfVxuXG4gIHNldCguLi5hcmdzKSB7XG4gICAgc3VwZXIuc2V0KC4uLmFyZ3MpO1xuICAgIHRoaXMuX21pbkhlYXAuc2V0KC4uLmFyZ3MpO1xuICB9XG5cbiAgcmVtb3ZlKC4uLmFyZ3MpIHtcbiAgICBzdXBlci5yZW1vdmUoLi4uYXJncyk7XG4gICAgdGhpcy5fbWluSGVhcC5yZW1vdmUoLi4uYXJncyk7XG4gIH1cblxuICBjbGVhciguLi5hcmdzKSB7XG4gICAgc3VwZXIuY2xlYXIoLi4uYXJncyk7XG4gICAgdGhpcy5fbWluSGVhcC5jbGVhciguLi5hcmdzKTtcbiAgfVxuXG4gIHNldERlZmF1bHQoLi4uYXJncykge1xuICAgIHN1cGVyLnNldERlZmF1bHQoLi4uYXJncyk7XG4gICAgcmV0dXJuIHRoaXMuX21pbkhlYXAuc2V0RGVmYXVsdCguLi5hcmdzKTtcbiAgfVxuXG4gIGNsb25lKCkge1xuICAgIGNvbnN0IGNsb25lID0gbmV3IE1pbk1heEhlYXAodGhpcy5fY29tcGFyYXRvciwgdGhpcy5faGVhcCk7XG4gICAgcmV0dXJuIGNsb25lO1xuICB9XG5cbiAgbWluRWxlbWVudElkKCkge1xuICAgIHJldHVybiB0aGlzLl9taW5IZWFwLm1pbkVsZW1lbnRJZCgpO1xuICB9XG5cbn07XG4iXX0=
