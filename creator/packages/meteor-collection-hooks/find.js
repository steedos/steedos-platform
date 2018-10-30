/* global CollectionHooks _ */

CollectionHooks.defineAdvice('find', function (userId, _super, instance, aspects, getTransform, args, suppressAspects) {
  var self = this
  var ctx = {context: self, _super: _super, args: args}
  var ret, abort

  // args[0] : selector
  // args[1] : options

  args[0] = instance._getFindSelector(args)
  args[1] = instance._getFindOptions(args)

  // before
  if (!suppressAspects) {
    _.each(aspects.before, function (o) {
      var r = o.aspect.call(ctx, userId, args[0], args[1])
      if (r === false) abort = true
    })

    if (abort) return instance.find(undefined)
  }

  function after (cursor) {
    if (!suppressAspects) {
      _.each(aspects.after, function (o) {
        o.aspect.call(ctx, userId, args[0], args[1], cursor)
      })
    }
  }

  ret = _super.apply(self, args)
  after(ret)

  return ret
})
