var createQuery = require('../lib').createQuery
var expect = require('chai').expect

describe("SQL SELECT", () => {
   var f;
  beforeEach(function() {
    var match;
     if (match = this.currentTest.title.match(/expression[^\:]*\:  ?(.*)/)) {
       f = createQuery(match[1]);
     }
  });

  it("expression: $select=Id", () => {
      expect(f.select).to.equal("[Id]");
  });

  it("expression: $select=Id,Value", () => {
      expect(f.select).to.equal("[Id], [Value]");
  });
});

describe("SQL ORDER BY", () => {
   var f;
  beforeEach(function() {
    var match;
     if (match = this.currentTest.title.match(/expression[^\:]*\:  ?(.*)/)) {
       f = createQuery(match[1]);
     }
  });

  it("expression: $orderby=Id", () => {
      expect(f.orderby).to.equal("[Id] ASC");
  });

  it("expression: $orderby=Id asc", () => {
      expect(f.orderby).to.equal("[Id] ASC");
  });

  it("expression: $orderby=Id desc", () => {
      expect(f.orderby).to.equal("[Id] DESC");
  });

  it("expression: $orderby=Id,Value desc", () => {
      expect(f.orderby).to.equal("[Id] ASC, [Value] DESC");
  });

  it("expression: $orderby=Id asc,Value desc", () => {
      expect(f.orderby).to.equal("[Id] ASC, [Value] DESC");
  });
});

describe("OData $expand", () => {
   var f;
  beforeEach(function() {
    var match;
     if (match = this.currentTest.title.match(/expression[^\:]*\:  ?(.*)/)) {
       f = createQuery(match[1], {
           useParameters: false
       });
     }
  });

  it("expression: $expand=Child", () => {
      expect(f.includes).to.be.an.array;
      expect(f.includes.length).to.equal(1);
      expect(f.includes[0].navigationProperty).to.equal("Child");
  });

  it("expression: $expand=Child($filter=Id eq 1)", () => {
      expect(f.includes).to.be.an.array;
      expect(f.includes.length).to.equal(1);
      expect(f.includes[0].navigationProperty).to.equal("Child");
      expect(f.includes[0].where).to.equal("[Id] = 1");
  });
});

describe("SQL statement", () => {
   var f;
  beforeEach(function() {
    var match;
     if (match = this.currentTest.title.match(/expression[^\:]*\:  ?(.*)/)) {
       f = createQuery(match[1]);
     }
  });

  it("expression: $top=2", () => {
      expect(f.from("dummy")).to.equal("SELECT * FROM [dummy] WHERE 1 = 1 ORDER BY 1 LIMIT 2");
  });

  it("expression: $skip=1&$top=2", () => {
      expect(f.from("dummy")).to.equal("SELECT * FROM [dummy] WHERE 1 = 1 ORDER BY 1 LIMIT 2 OFFSET 1");
  });
});