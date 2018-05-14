//Tests
Tinytest.add('Moment can be initalized', function (test) {
  test.isNotNull(moment, 'moment should exist');
  test.isTrue(typeof(moment) === "function", 'moment should be a function');
});

Tinytest.add('Moment Timezone has been added', function (test) {
  test.isNotNull(moment.tz, 'moment.tz should exist');
  test.isTrue(typeof(moment.tz) === "function", 'moment.tz should be a function');
});

Tinytest.add('Moment Timezone for America/Los_Angeles works correctly', function (test) {
  test.isNotNull(moment().tz("America/Los_Angeles"), 'moment.tz should exist for America/Los_Angeles');
  test.equal(moment.tz("2013-12-01", "America/Los_Angeles").format(), "2013-12-01T00:00:00-08:00", 'LA Timezone formatted output is not correct');
});
