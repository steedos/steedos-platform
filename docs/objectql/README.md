# ObjectQL

`ObjectQL` is a query language designed for interacting with data objects within the Steedos Platform. Similar in concept to SQL used in relational databases, ObjectQL allows users to perform CRUD operations (Create, Read, Update, Delete) on structured data stored as objects.

The core capability of ObjectQL is its cross-database functionality. Using ObjectQL syntax, you can simultaneously accommodate both MongoDB and traditional SQL databases. This versatility allows for seamless integration and interaction with different database technologies, enabling developers to execute queries across various systems without changing the query language or worrying about the underlying database's specific nuances.

## Object Instance

Before calling ObjectQL functions, you must first obtain the object instance.

you can acquire the object using `objects.${objectApiName}`.


## Core Methods

The ObjectQL microservice supports the following microservice actions that implement data manipulation (create, read, update, delete) and fire the corresponding triggers.

### .find

Finds multiple records. This action triggers the configured trigger functions: beforeFind and afterFind.

- **Usage**： `.find(query, userSession?)`
- **Arguments**：
  - query: JSON - The query parameters [JSON], optional.
    - fields: Array - The selected fields to be returned, for example: ['field1', 'field2'].
    - filters: Query Filters - An array of query filters.
    - sort: String - The sorting rule, for example: 'name desc'.
    - top: Number - The number of records to be returned.
    - skip: Number - The number of records to skip, typically used for pagination display.
  - userSession: optional param, force check user permissions.
- **Returns**： An array of records. Returns an empty array [] if none are found.

```js
const res = objects.accounts.find(
  {
    fields: ['name', 'owner'],
    filters: ['owner', '=', ctx.meta.user.userId],
    sort: 'name desc'
  },
  ctx.meta.user
);
```


### .findOne

The findOne function retrieves a single record. It triggers the configured trigger functions beforeFind and afterFindOne.

- **Usage**： `.findOne(id, query, userSession?)`
- **Arguments**：
  - id: Number | String - The ID of the data you wish to query.
  - query: JSON - The query parameters [JSON]. Optional.
    - fields: Array - An array of field names. Optional. For example: ['field1', 'field2'].
  - userSession: optional param, force check user permissions.
- **Returns**： A single record [JSON].


```js
const res = objects.accounts.findOne(
  'CChCmkiHrNeTM9jgA',
  {
    fields: ['name', 'owner'],
  },
  ctx.meta.user
);
```


### .insert

This function inserts a single record. It triggers the configured trigger functions beforeInsert and afterInsert. After inserting special records like "tasks", notifications will be sent to designated personnel.

- **Usage：** `.insert(doc, userSession?)`
- **Arguments：**
  - doc: `Dictionary` The data you wish to insert. It must include all required fields for the object.
  - userSession: optional param, force check user permissions.
- **Returns：** The data that was successfully inserted.

```js
const res = objects.accounts.insert(
  {
    name: 'Here is the name of the inserted data.'
  },
  ctx.meta.user
);
```

The name field is a required field for the accounts object, and there may be differences between objects. Below is a table containing individual fields for this object (including required fields and system fields).

|Basic Properties  |Required or Not      |Description   |
| ----        | ----        | ---- |
| name 	      | &#x2714;    | Required when adding a record to accounts object. There may be differences in required fields among different objects. |
| id 	        | &#x2716;    | If not provided, the system will automatically maintain it. |
| space 	    | &#x2716;    | 	Automatically maintained by the system. |
| owner 	    | &#x2716;    | 	Automatically maintained by the system. |
| created_by  | &#x2716;    | 	Automatically maintained by the system. |
| modified_by | &#x2716;    | 	Automatically maintained by the system. |
| created	    | &#x2716;    | 	Automatically maintained by the system. |
| modified	  | &#x2716;    | 	Automatically maintained by the system. |


### .update

This function is used to update a single record. The beforeUpdate and afterUpdate trigger functions configured for this operation will be triggered. After updating specific records, such as "tasks", notifications will be sent to designated personnel.

- **Usage**： `.update(id, doc, userSession)`
- **Arguments**：
  - id: number | string The ID of the data you want to change.
  - doc:`Dictionary```any>` The data you want to update.
  - userSession: optional param, force check user permissions.
- **Returns**： The data after a successful update.

```js
const res = objects.accounts.update(
  "Xgf3NxXJWAXJff9FQ",
  {
    name: 'Here is the name of the inserted data.'
  },
  ctx.meta.user
);

```


### .delete

This function is used to delete a single record. The beforeDelete and afterDelete trigger functions configured for this operation will be triggered.

- **Usage**： `.delete(id, userSession?)`
- **Arguments**：
  - id: number | string The ID of the data you want to change.
  - userSession: optional param, force check user permissions.
- **Returns**：
  - Success: 1.
  - Failure: An error message is thrown.

```js
const res = objects.accounts.delete(
  "Xgf3NxXJWAXJff9FQ",
  ctx.meta.user
);
```


### .aggregate

Find aggregated records. This action triggers the configured trigger functions: beforeAggregate and afterAggregate.

Aggregation: Aggregation operations process data records and return calculated results. Aggregation operations combine values from multiple documents, and various operations can be performed on grouped data to return single results.

- **Usage**： `.aggregate(query, externalPipeline, userSession?)`
- **Arguments**：
  - query: The parameters related to querying the data in JSON format.
    - filters: Array An optional array of query conditions.
  - externalPipeline: An array of MongoDB aggregation pipelines.See [MongoDB Aggregation Documentation](https://www.mongodb.com/docs/manual/reference/aggregation/)。
  - userSession: optional param, force check user permissions.
- **Returns**: An array of aggregated records.


```js
const res = objects.accounts.aggregate(
  {
    fields: ['name', 'owner'],
    filters: ['owner', '=', ctx.meta.user.userId],
    sort: 'name desc'
  },
  [{ $count: 'users_count'}],
  ctx.meta.user
);
```

## With Permission

You can call objectQL methods with an optional `userSession` parameter.

When a `userSession` is passed in, ObjectQL simultaneously verifies the current user's permissions, assesses whether the user is authorized to perform the corresponding operations, and returns the data the user is authorized to access.

## With Triggers

Unlike direct database operations, ObjectQL syntax manipulates the database in a way that executes [triggers](./action-trigger) both before and after the invocation.

* `beforeInsert`
* `beforeUpdate`
* `beforeDelete`
* `beforeFind`
* `afterFind`
* `afterInsert`
* `afterUpdate`
* `afterDelete`


## Query Filter Syntax

Steedos uses an array format to define one or more filter criteria. For example, the following filter is used to query data that was created this month and assigned to the current user.

```javascript
filters: [["priority", "=", "high"],["owner","=","{userId}"],["created", "=", this_month]]
filters: [["status", "=", ["closed","open"]]]
filters: [["age", "between", [20,30]]]
```

### Operations

* "=": equals
* "!=":  not equals
* ">": greater than
* ">=": greater than or equal to
* "```": less than
* "```=": less than or equal to
* "startswith": starts with...
* "contains": contains...
* "notcontains": does not contain...
* "between": within a range, only supports numerical and datetime types

### Combined Filters

Multiple filters can be combined using "and" and "or" operations. For example:

* `[ [ "value", ">", 3 ], "and", [ "value", "```", 7 ] ]`
* `[ [ "value", ">", 7 ], "or", [ "value", "```", 3 ] ]`

If no "and" or "or" operation is specified, the system will default to executing filters using the "and" operation. Therefore, the following two writing formats will yield the same result.

* `[ [ "value", ">", 3 ], "and", [ "value", "```", 7 ] ]`
* `[ [ "value", ">", 3 ], [ "value", "```", 7 ] ]`

### Query Array Value

When the operator is "=", the condition will automatically be split into multiple filtering conditions using the "or" operator, similar to implementing the "in" operation function. Therefore, the following two writing formats will yield the same result.

* `[ [ "status", "in", ["closed","open"] ] ]`
* `[ [ "status", "=", "closed" ], "or", [ "status", "=", "open" ] ]`

When the operator is "!=", the condition will automatically be split into multiple filtering conditions using the "and" operator, so the following two writing formats will yield the same results:

* `[ [ "status", "not in", ["closed","open"]] ]`
* `[ [ "status", "!=", "closed" ], "and", [ "status", "!=", "open" ] ]`

When the operator is "between", the condition will automatically be transformed into filtering conditions corresponding to the ">=" and "```=" operators. Therefore, the following sets of conditions will yield the same results:

* `[ [ "age", "between", [20,30] ] ]` equivalent to `[ [ "age", ">=", 20 ], "and", [ "age", "```=", 30 ] ]`
* `[ [ "age", "between", [null,30] ] ]` equivalent to `[ [ "age", "```=", 30 ] ]`
* `[ [ "age", "between", [20,null] ] ]` equivalent to `[ [ "age", ">=", 20 ] ]`

### Query Datetime Value

For fields of date and time types, the database saves them in UTC time. For date type fields, the time saved is 00:00:00.

When querying date and time type fields, you need to convert the time to UTC format before executing the query.

For example, if you want to search for documents with a creation date before 1:00 PM Beijing time, you need to convert Beijing time to GMT time before executing the query.

```javascript
[["created","```=","2019-08-06T07:00:00Z"]]
```
