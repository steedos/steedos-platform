# OData v4 Parser

OData v4 parser based on OASIS Standard OData v4 ABNF grammar

## How to build

Simply just use ```$ npm run build```

Run TDD tests using ```$ npm run tdd```

## How to use

Parser functions:

```javascript
var parser = require('odata-v4-parser');
parser.filter("Title eq 'Article1'");
```

Low-level functional:

```javascript
require('odata-v4-parser/lib/expressions').boolCommonExpr(new Uint8Array(new Buffer("contains(@word,Title)")), 0);
require('odata-v4-parser/lib/json').arrayOrObject(new Uint8Array(new Buffer('{"a":1}')), 0);
require('odata-v4-parser/lib/expressions').commonExpr(new Uint8Array(new Buffer('Items/all(d:d/Quantity gt 100)')), 0);
```

## TODO

* more unit testing
* use metadata for correct OData identifier type detection (complex types, navigation properties, etc.)
