var createFilter = require('../lib').createFilter
var expect = require('chai').expect

describe("SQL WHERE useParameters (MS-SQL)", () => {
   var f;
  beforeEach(function() {
    var match;
     if (match = this.currentTest.title.match(/expression[^\:]*\:  ?(.*)/)) {
       f = createFilter(match[1], {
           useParameters: true,
           type: 1
       });
     }
  });

  //all numbers are referencing this:
  //http://docs.oasis-open.org/odata/odata/v4.0/errata02/os/complete/part2-url-conventions/odata-v4.0-errata02-os-part2-url-conventions-complete.html#_Toc406398116

  it("expression 5.1.1.6.1: NullValue eq null", () => {
      expect(f.where).to.equal("[NullValue] IS NULL")
  })

  it("expression 5.1.1.6.1: TrueValue eq true", () => {
      expect(f.where).to.equal("[TrueValue] = @p0")
  })

  it("expression 5.1.1.6.1: FalseValue eq false", () => {
      expect(f.where).to.equal("[FalseValue] = @p0")
  })

  it("expression 5.1.1.6.1: IntegerValue lt -128", () => {
      expect(f.where).to.equal("[IntegerValue] < @p0")
  })

  it("expression 5.1.1.6.1: DecimalValue eq 34.95", () => {
      expect(f.where).to.equal("[DecimalValue] = @p0")
  })

  it("expression 5.1.1.6.1: StringValue eq 'Say Hello,then go'", () => {
      expect(f.where).to.equal("[StringValue] = @p0")
  })

  it("expression 5.1.1.6.1: DurationValue eq duration'P12DT23H59M59.999999999999S'", () => {
      expect(f.where).to.equal("[DurationValue] = @p0")
  })

  it("expression 5.1.1.6.1: DateValue eq 2012-12-03", () => {
      expect(f.where).to.equal("[DateValue] = @p0")
  })

  it("expression 5.1.1.6.1: DateTimeOffsetValue eq 2012-12-03T07:16:23Z", () => {
      expect(f.where).to.equal("[DateTimeOffsetValue] = @p0")
  })

  it("expression 5.1.1.6.1: GuidValue eq 01234567-89ab-cdef-0123-456789abcdef", () => {
      expect(f.where).to.equal("[GuidValue] = @p0")
  })

  it("expression 5.1.1.6.1: Int64Value eq 0", () => {
      expect(f.where).to.equal("[Int64Value] = @p0")
  })

  it("expression 5.1.1.6.1: A eq 0.31415926535897931e1", () => {
      expect(f.where).to.equal("[A] = @p0")
  })

  it("expression 5.1.1.1.2: A ne 1", () => {
      expect(f.where).to.equal("[A] <> @p0")
  })

  it("expression 5.1.1.1.3: A gt 2", () => {
      expect(f.where).to.equal("[A] > @p0")
  })

  it("expression 5.1.1.1.4: A ge 3", () => {
      expect(f.where).to.equal("[A] >= @p0")
  })

  it("expression 5.1.1.1.5: A lt 2", () => {
      expect(f.where).to.equal("[A] < @p0")
  })

  it("expression 5.1.1.1.6: A le 2", () => {
      expect(f.where).to.equal("[A] <= @p0")
  })

  it("expression 5.1.1.3: (A eq 2) or (B lt 4) and ((E gt 5) or (E lt -1))", () => {
      expect(f.where).to.equal("([A] = @p0) OR ([B] < @p1) AND (([E] > @p2) OR ([E] < @p3))")
  })

  it("expression 5.1.1.4.1: contains(A, 'BC')", () => {
      expect(f.where).to.equal("[A] like @p0");
  })

  it("expression 5.1.1.4.2: endswith(A, 'CD')", () => {
      expect(f.where).to.equal("[A] like @p0");
  })

  it("expression 5.1.1.4.3: startswith(A, 'CD')", () => {
      expect(f.where).to.equal("[A] like @p0");
  })

  it("expression 5.1.1.4.4: length(A) eq 3", () => {
      expect(f.where).to.equal("LEN([A]) = @p0")
  })

  it("expression 5.1.1.4.5: indexof(A, 'BC') eq 1", () => {
    expect(f.where).to.equal("CHARINDEX(@p0, [A]) - 1 = @p1")
  })

  it("expression 5.1.1.4.7: tolower(A) eq 'abc'", () => {
      expect(f.where).to.equal("LCASE([A]) = @p0")
  })

  it("expression 5.1.1.4.8: toupper(A) eq 'ABC'", () => {
      expect(f.where).to.equal("UCASE([A]) = @p0")
  })

  it("expression 5.1.1.4.9: trim(A) eq 'abc'", () => {
      expect(f.where).to.equal("TRIM(' ' FROM [A]) = @p0")
  })

  it("expression 5.1.1.4.11: A eq year(2016-01-01T13:00Z)", () => {
      expect(f.where).to.equal("[A] = YEAR(@p0)")
  })

  it("expression 5.1.1.4.21: year(now())", () => {
      expect(f.where).to.equal("YEAR(NOW())")
  })

  it("expression 5.1.1.4.25: round(A) eq 42", () => {
      expect(f.where).to.equal("ROUND([A]) = @p0")
  })

  it("expression 5.1.1.4.26: floor(A) eq 42", () => {
      expect(f.where).to.equal("FLOOR([A]) = @p0")
  })

  it("expression 5.1.1.4.27: ceiling(A) eq 42", () => {
      expect(f.where).to.equal("CEILING([A]) = @p0")
  })
})
