// EJSON custom type
FS.File.prototype.typeName = function() {
  return 'FS.File';
};

// EJSON equals type
FS.File.prototype.equals = function(other) {
  var self = this;
  if (other instanceof FS.File) {
    return (self._id === other._id && self.collectionName === other.collectionName);
  }
  return false;
};

// EJSON custom clone
FS.File.prototype.clone = function() {
  return new FS.File(this);
};

// EJSON toJSONValue
FS.File.prototype.toJSONValue = function() {
  var self = this;
  return { _id: self._id, collectionName: self.collectionName };
};

// EJSON fromJSONValue
FS.File.fromJSONValue = function(value) {
  return new FS.File(value);
};

EJSON.addType('FS.File', FS.File.fromJSONValue);