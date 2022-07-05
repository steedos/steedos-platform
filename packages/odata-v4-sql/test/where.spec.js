var createFilter = require('../lib').createFilter
var expect = require('chai').expect

describe("SQL WHERE", () => {
   var f;
  beforeEach(function() {
    var match;
     if (match = this.currentTest.title.match(/expression[^\:]*\:  ?(.*)/)) {
       f = createFilter(match[1], {
           useParameters: false
       }).where;
     }
  });

  //all numbers are referencing this:
  //http://docs.oasis-open.org/odata/odata/v4.0/errata02/os/complete/part2-url-conventions/odata-v4.0-errata02-os-part2-url-conventions-complete.html#_Toc406398116

  it("expression 5.1.1.6.1: 1 eq 1", () => {
      expect(f).to.equal("1 = 1")
  })

  it("expression 5.1.1.6.1: NullValue eq null", () => {
      expect(f).to.equal("[NullValue] IS NULL")
  })

  it("expression 5.1.1.6.1: null eq NullValue", () => {
      expect(f).to.equal("[NullValue] IS NULL")
  })

  it("expression 5.1.1.6.1: TrueValue eq true", () => {
      expect(f).to.equal("[TrueValue] = 1")
  })

  it("expression 5.1.1.6.1: FalseValue eq false", () => {
      expect(f).to.equal("[FalseValue] = 0")
  })

  it("expression 5.1.1.6.1: IntegerValue lt -128", () => {
      expect(f).to.equal("[IntegerValue] < -128")
  })

  it("expression 5.1.1.6.1: DecimalValue eq 34.95", () => {
      expect(f).to.equal("[DecimalValue] = 34.95")
  })

  it("expression 5.1.1.6.1: StringValue eq 'Say Hello,then go'", () => {
      expect(f).to.equal("[StringValue] = 'Say Hello,then go'")
  })

  xit("expression 5.1.1.6.1: DurationValue eq duration'P12DT23H59M59.999999999999S'", () => {
      expect(f).to.equal("[DurationValue] = 1033199000")
  })

  it("expression 5.1.1.6.1: DateValue eq 2012-12-03", () => {
      expect(f).to.equal("[DateValue] = '2012-12-03'")
  })

  it("expression 5.1.1.6.1: DateTimeOffsetValue eq 2012-12-03T07:16:23Z", () => {
      expect(f).to.equal("[DateTimeOffsetValue] = '2012-12-03 07:16:23'")
  })

  it("expression 5.1.1.6.1: GuidValue eq 01234567-89ab-cdef-0123-456789abcdef", () => {
      expect(f).to.equal("[GuidValue] = '01234567-89ab-cdef-0123-456789abcdef'")
  })

  it("expression 5.1.1.6.1: Int64Value eq 0", () => {
      expect(f).to.equal("[Int64Value] = 0")
  })

  it("expression 5.1.1.6.1: A eq 0.31415926535897931e1", () => {
      expect(f).to.equal("[A] = 3.141592653589793")
  })

  it("expression 5.1.1.1.2: A ne 1", () => {
      expect(f).to.equal("[A] <> 1")
  })

  it("expression 5.1.1.1.3: A gt 2", () => {
      expect(f).to.equal("[A] > 2")
  })

  it("expression 5.1.1.1.4: A ge 3", () => {
      expect(f).to.equal("[A] >= 3")
  })

  it("expression 5.1.1.1.5: A lt 2", () => {
      expect(f).to.equal("[A] < 2")
  })

  it("expression 5.1.1.1.6: A le 2", () => {
      expect(f).to.equal("[A] <= 2")
  })

  it("expression 5.1.1.3: (A eq 2) or (B lt 4) and ((E gt 5) or (E lt -1))", () => {
      expect(f).to.equal("([A] = 2) OR ([B] < 4) AND (([E] > 5) OR ([E] < -1))")
  })

  it("expression 5.1.1.4.1: contains(A, 'BC')", () => {
      expect(f).to.equal("[A] like '%BC%'");
  })

  it("expression 5.1.1.4.2: endswith(A, 'CD')", () => {
      expect(f).to.equal("[A] like '%CD'");
  })

  it("expression 5.1.1.4.3: startswith(A, 'CD')", () => {
      expect(f).to.equal("[A] like 'CD%'");
  })

  it("expression 5.1.1.4.4: length(A) eq 3", () => {
      expect(f).to.equal("LEN([A]) = 3")
  })

  it("expression 5.1.1.4.5: indexof(A, 'BC') eq 1", () => {
    expect(f).to.equal("INSTR([A], 'BC') - 1 = 1")
})

  it("expression 5.1.1.4.7: tolower(A) eq 'abc'", () => {
      expect(f).to.equal("LCASE([A]) = 'abc'")
  })

  it("expression 5.1.1.4.8: toupper(A) eq 'ABC'", () => {
      expect(f).to.equal("UCASE([A]) = 'ABC'")
  })

  it("expression 5.1.1.4.9: trim(A) eq 'abc'", () => {
      expect(f).to.equal("TRIM(' ' FROM [A]) = 'abc'")
  })

  it("expression 5.1.1.4.11: A eq year(2016-01-01T13:00Z)", () => {
      expect(f).to.equal("[A] = YEAR('2016-01-01 13:00')")
  })

  it("expression 5.1.1.4.21: year(now())", () => {
      expect(f).to.equal("YEAR(NOW())")
  })

  it("expression 5.1.1.4.25: round(A) eq 42", () => {
      expect(f).to.equal("ROUND([A]) = 42")
  })

  it("expression 5.1.1.4.26: floor(A) eq 42", () => {
      expect(f).to.equal("FLOOR([A]) = 42")
  })

  it("expression 5.1.1.4.27: ceiling(A) eq 42", () => {
      expect(f).to.equal("CEILING([A]) = 42")
  })
})
