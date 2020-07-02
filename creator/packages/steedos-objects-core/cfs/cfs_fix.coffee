FS.StorageAdapter.prototype.on 'error', (storeName, error, fileObj)->
  console.error("FS.StorageAdapter emit error")
  console.error(error)
  console.error(fileObj)
  console.error(storeName)

FS.Collection.prototype.on 'error', (error, fileObj, storeName)->
  console.error("FS.Collection emit error")
  console.error(error)
  console.error(fileObj)
  console.error(storeName)