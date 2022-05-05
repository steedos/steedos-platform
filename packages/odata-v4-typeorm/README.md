# OData V4 Service modules - TYPEORM Connector

Service OData v4 requests from a TYPEORM.

## Synopsis
The OData V4 TYPEORM Connector provides functionality to convert the various types of OData segments
into SQL query statements, that you can execute over a TYPEORM.

## Potential usage scenarios

- Create high speed, standard compliant data sharing APIs

## Usage as server - TypeScript
//example request:  GET /api/users?$filter=id eq 42&$select=id,name
### odataQuery
```typescript
import express from 'express';
import { odataQuery } from 'odata-v4-typeorm';
import { getRepository } from 'typeorm';
import { User } from '../entities/user';

const app = express();
const usersRepository = getRepository(User);

app.get('/api/users', odataQuery(usersRepository));

const port = 3001;
app.listen(port, () => console.log(`Example app listening on port ${port}!`));
```

### executeQuery by repository
```typescript
import express from 'express';
import { executeQuery } from 'odata-v4-typeorm';
import { getRepository } from 'typeorm';
import { User } from '../entities/user';

const app = express();

app.get('/api/users', async (req, res) => {
  try {
    const usersRepository = getRepository(User);
    const data = await executeQuery(usersRepository, req.query);
    return res.status(200).json(data);
  } catch (e) {
    return res.status(500).json({message: 'Internal server error.'});
  }
});

const port = 3001;
app.listen(port, () => console.log(`Example app listening on port ${port}!`));
```

### executeQuery by queryBuilder
```typescript
import express from 'express';
import { executeQuery } from 'odata-v4-typeorm';
import { getRepository } from 'typeorm';
import { User } from '../entities/user';

const app = express();

app.get('/api/users', async (req, res) => {
  try {
    const queryBuilder = getRepository(User)
      .createQueryBuilder("user")
      .where("user.roleName = :roleName", { roleName: 'admin' });
    const data = await executeQuery(queryBuilder, req.query);
    return res.status(200).json(data);
  } catch (e) {
    return res.status(500).json({message: 'Internal server error.'});
  }
});

const port = 3001;
app.listen(port, () => console.log(`Example app listening on port ${port}!`));
```

### createFilter
```javascript
import { createFilter } from 'odata-v4-typeorm'

//example request:  GET /api/Users?$filter=Id eq 42
app.get("/api/Users", (req: Request, res: Response) => {
    const filter = createFilter(req.query.$filter);
    // connection instance from pg module
    connection.query(`SELECT * FROM Users WHERE ${filter.where}`, filter.parameters, function(err, result){
        res.json({
        	'@odata.context': req.protocol + '://' + req.get('host') + '/api/$metadata#Users',
        	value: result.rows
        });
    });
});
```

Advanced TypeScript example available [here](https://raw.githubusercontent.com/jaystack/odata-v4-mysql/master/src/example/sql.ts).

## Usage ES5
```javascript
var createFilter = require('odata-v4-typeorm').createFilter;

app.get("/api/Users", function(req, res) {
    var filter = createFilter(req.query.$filter);
    // connection instance from pg module
    connection.query(filter.from("Users"), filter.parameters, function(err, result){
        res.json({
        	'@odata.context': req.protocol + '://' + req.get('host') + '/api/$metadata#Users',
        	value: result.rows
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
* $count

If you have any questions, please don’t hesitate to contact me.
* skype: andryuha49.
* https://www.linkedin.com/in/andriy-zherdiy/