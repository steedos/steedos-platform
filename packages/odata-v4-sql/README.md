<!--
 * @Author: baozhoutao@steedos.com
 * @Date: 2022-07-05 15:03:38
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2022-07-05 15:14:04
 * @Description: 
-->
# OData V4 Service modules - SQL Connector

Service OData v4 requests from an SQL data store.

## Synopsis
The OData V4 SQL Connector provides functionality to convert the various types of OData segments
into SQL query statements, that you can execute over an SQL database.

## Potential usage scenarios

- Create high speed, standard compliant data sharing APIs

## Usage as server - TypeScript
```javascript
import { createFilter } from '@steedos/odata-v4-sql'

//example request:  GET /api/Users?$filter=Id eq 42
app.get("/api/Users", (req: Request, res: Response) => {
    const filter = createFilter(req.query.$filter);
    // request instance from mssql module
    request.query(`SELECT * FROM Users WHERE ${filter.where}`, function(err, data){
        res.json({
        	'@odata.context': req.protocol + '://' + req.get('host') + '/api/$metadata#Users',
        	value: data
        });
    });
});
```

Advanced TypeScript example available [here](https://raw.githubusercontent.com/jaystack/odata-v4-sql/master/src/example/sql.ts).

## Usage ES5
```javascript
var createFilter = require('@steedos/odata-v4-sql').createFilter;

app.get("/api/Users", function(req, res) {
    var filter = createFilter(req.query.$filter);
    // request instance from mssql module
    request.query(filter.from("Users"), function(err, data){
        res.json({
        	'@odata.context': req.protocol + '://' + req.get('host') + '/api/$metadata#Users',
        	value: data
        });
    });
})
```

## Supported OData segments

* $filter
* $select
* $skip
* $top
* $orderby
* $expand