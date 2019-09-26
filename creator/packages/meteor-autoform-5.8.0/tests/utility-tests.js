/* global Utility */

if (Meteor.isClient) {

  Tinytest.add('AutoForm - Utility - cleanNulls', function(test) {
    var date = new Date(), oid = new Mongo.Collection.ObjectID();

    var cleaned = Utility.cleanNulls({
      a: void 0,
      b: undefined,
      c: null,
      d: "",
      e: "keep me",
      f: {
        a: void 0,
        b: undefined,
        c: null,
        d: "",
        e: "keep me"
      },
      g: {
        a: null
      },
      h: {
        a: date,
        b: oid
      }
    });
    test.equal(cleaned, {e: "keep me", f: {e: "keep me"}, h: { a: date, b: oid }});
  });

  Tinytest.add('AutoForm - Utility - reportNulls', function(test) {
    var report = Utility.reportNulls({
      a: void 0,
      b: undefined,
      c: null,
      d: "",
      e: "keep me"
    });
    test.equal(report, {
      a: "",
      b: "",
      c: "",
      d: ""
    });
  });

  Tinytest.add('AutoForm - Utility - docToModifier', function(test) {
    var date = new Date(), testObj, mod;

    testObj = {
      a: 1,
      b: "foo",
      c: date,
      d: {
        a: 1,
        b: "foo",
        c: date,
        d: [
          {
            a: 1,
            b: "foo",
            c: date,
            d: {
              a: 1,
              b: "foo",
              c: date,
              d: null // make sure that null, empty, etc. don't end up in $unset when under an array
            }
          }
        ],
        e: [1, 2]
      },
      e: null,
      f: "",
      g: void 0 //undefined props are removed
    };

    // Test 1 w/ keepArrays, w/ keepEmptyStrings
    mod = Utility.docToModifier(testObj, {keepArrays: true, keepEmptyStrings: true});
    test.equal(mod, {
      $set: {
        a: 1,
        b: "foo",
        c: date,
        'd.a': 1,
        'd.b': "foo",
        'd.c': date,
        'd.d': [ //array of objects should remain array
          {
            a: 1,
            b: "foo",
            c: date,
            d: {
              a: 1,
              b: "foo",
              c: date
              // null should have been removed, too
            }
          }
        ],
        'd.e': [1, 2], //array of non-objects should remain array
        f: "" // empty string should be set rather than unset
      },
      $unset: {
        e: ""
      }
    });

    // Test 2 w/ keepArrays, w/o keepEmptyStrings
    mod = Utility.docToModifier(testObj, {keepArrays: true, keepEmptyStrings: false});
    test.equal(mod, {
      $set: {
        a: 1,
        b: "foo",
        c: date,
        'd.a': 1,
        'd.b': "foo",
        'd.c': date,
        'd.d': [ //array of objects should remain array
          {
            a: 1,
            b: "foo",
            c: date,
            d: {
              a: 1,
              b: "foo",
              c: date
              // null should have been removed, too
            }
          }
        ],
        'd.e': [1, 2] //array of non-objects should remain array
      },
      $unset: {
        e: "",
        f: ""
      }
    });

    // Test 3 w/o keepArrays, w/ keepEmptyStrings
    mod = Utility.docToModifier(testObj, {keepArrays: false, keepEmptyStrings: true});
    test.equal(mod, {
      $set: {
        a: 1,
        b: "foo",
        c: date,
        'd.a': 1,
        'd.b': "foo",
        'd.c': date,
        'd.d.0.a': 1,
        'd.d.0.b': "foo",
        'd.d.0.c': date,
        'd.d.0.d.a': 1,
        'd.d.0.d.b': "foo",
        'd.d.0.d.c': date,
        'd.e.0': 1,
        'd.e.1': 2,
        f: ""
      },
      $unset: {
        'd.d.0.d.d': "",
        e: ""
      }
    });

    // Test 4 w/o keepArrays, w/o keepEmptyStrings
    mod = Utility.docToModifier(testObj, {keepArrays: false, keepEmptyStrings: false});
    test.equal(mod, {
      $set: {
        a: 1,
        b: "foo",
        c: date,
        'd.a': 1,
        'd.b': "foo",
        'd.c': date,
        'd.d.0.a': 1,
        'd.d.0.b': "foo",
        'd.d.0.c': date,
        'd.d.0.d.a': 1,
        'd.d.0.d.b': "foo",
        'd.d.0.d.c': date,
        'd.e.0': 1,
        'd.e.1': 2
      },
      $unset: {
        'd.d.0.d.d': "",
        e: "",
        f: ""
      }
    });
  });

  Tinytest.add('AutoForm - valueConverters - stringToNumber', function(test) {
    function testMaybeNum(val, expect) {
      var mod = AutoForm.valueConverters.stringToNumber(val);
      test.equal(mod, expect);
    }

    testMaybeNum(1, 1);
    testMaybeNum(1.1, 1.1);
    testMaybeNum("1", 1);
    testMaybeNum("1.1", 1.1);
    testMaybeNum("foo", "foo");
    var d = new Date();
    testMaybeNum(d, d);
    testMaybeNum(true, true);
    testMaybeNum(false, false);
    testMaybeNum({}, {});
  });

  Tinytest.add('AutoForm - Utility - expandObj', function(test) {
    function testExpandObj(val, expect) {
      var mod = Utility.expandObj(val);
      test.equal(JSON.stringify(mod), JSON.stringify(expect));
    }

    testExpandObj({}, {});
    testExpandObj({foo: "bar"}, {foo: "bar"});
    testExpandObj({foo: "bar", baz: 1}, {foo: "bar", baz: 1});
    testExpandObj({
      'foo.bar': "baz",
      baz: 1
    }, {
      foo: {bar: "baz"},
      baz: 1
    });
    testExpandObj({
      'foo.bar.0': "foo",
      'foo.bar.1': "baz",
      baz: 1
    }, {
      foo: {bar: ["foo", "baz"]},
      baz: 1
    });
    testExpandObj({
      'foo.bar.1': "baz",
      baz: 1
    }, {
      foo: {bar: [null, "baz"]},
      baz: 1
    });
    testExpandObj({
      'foo.bar.1.bam': "baz",
      baz: 1
    }, {
      foo: {bar: [null, {bam: "baz"}]},
      baz: 1
    });
    testExpandObj({
      'foo.bar.0': null,
      'foo.bar.1.bam': "baz",
      baz: 1
    }, {
      foo: {bar: [null, {bam: "baz"}]},
      baz: 1
    });
    testExpandObj({
      'foo.bar.0': "baz",
      'foo.bar.1.bam': "baz",
      baz: 1
    }, {
      foo: {bar: ["baz", {bam: "baz"}]},
      baz: 1
    });
    testExpandObj({
      'foo.bar.0': "baz",
      'foo.bar.1.bam': "baz",
      'foo.bar.1.boo': "foo",
      baz: 1
    }, {
      foo: {bar: ["baz", {bam: "baz", boo: "foo"}]},
      baz: 1
    });
    testExpandObj({
      'foo.0': null,
      'foo.1.bar': "baz",
      baz: 1
    }, {
      foo: [null, {bar: "baz"}],
      baz: 1
    });
    testExpandObj({
      'foo.0': null,
      'foo.1.bar': null,
      baz: 1
    }, {
      foo: [null, {bar: null}],
      baz: 1
    });
  });

  var startOfDayUTC = moment.utc("0001-3-14", "YYYY-MM-DD").toDate();
  var endOfDayUTC = moment.utc("0001-3-14 23:59:59", "YYYY-MM-DD HH:mm:ss").toDate();
  Tinytest.add('AutoForm - valueConverters - dateToDateString', function(test) {
    // There's no way to set the timezone for Javascript's Date object, so
    // we check what the current timezone is.
    var tzOffset = new Date().getTimezoneOffset();
    if(tzOffset > 0) {
      test.equal(AutoForm.valueConverters.dateToDateString(startOfDayUTC), "0001-03-13");
    } else if(tzOffset < 0) {
      test.equal(AutoForm.valueConverters.dateToDateString(endOfDayUTC), "0001-03-15");
    } else {
      test.equal(AutoForm.valueConverters.dateToDateString(startOfDayUTC), "0001-03-14");
      test.equal(AutoForm.valueConverters.dateToDateString(endOfDayUTC), "0001-03-14");
    }
  });
  Tinytest.add('AutoForm - valueConverters - dateToDateStringUTC', function(test) {
    test.equal(AutoForm.valueConverters.dateToDateStringUTC(startOfDayUTC), "0001-03-14");
    test.equal(AutoForm.valueConverters.dateToDateStringUTC(endOfDayUTC), "0001-03-14");
  });

}

//Test API:
//test.isFalse(v, msg)
//test.isTrue(v, msg)
//test.equalactual, expected, message, not
//test.length(obj, len)
//test.include(s, v)
//test.isNaN(v, msg)
//test.isUndefined(v, msg)
//test.isNotNull
//test.isNull
//test.throws(func)
//test.instanceOf(obj, klass)
//test.notEqual(actual, expected, message)
//test.runId()
//test.exception(exception)
//test.expect_fail()
//test.ok(doc)
//test.fail(doc)
//test.equal(a, b, msg)
