# Workflow Formula Engine Rules

## Overview

This document defines the comprehensive set of rules governing the Workflow Formula Engine in Steedos Platform. These rules apply to formula field calculations, conditional routing, default value evaluation, and form script execution within approval workflows.

**Target Audience**: Business analysts, workflow designers, and migration teams transitioning to amis-formula.

**Scope**: Formula syntax, built-in functions, field type handling, dependency resolution, and form event scripting.

---

## Table of Contents

1. [Formula Syntax Rules](#1-formula-syntax-rules)
2. [Built-in Functions](#2-built-in-functions)
3. [Field Type Handling](#3-field-type-handling)
4. [Formula Dependency Sorting](#4-formula-dependency-sorting)
5. [Default Value Evaluation](#5-default-value-evaluation)
6. [Condition Transformation](#6-condition-transformation)
7. [Context Variables](#7-context-variables)
8. [Form Script System](#8-form-script-system)
9. [Number Precision Handling](#9-number-precision-handling)

---

## 1. Formula Syntax Rules

### R-001: Field Reference Syntax
**Category**: Syntax  
**Description**: Fields are referenced using curly brace notation `{fieldName}`.

**Detailed Explanation**:
- Main form fields: `{amount}`, `{quantity}`
- Sub-table fields: `{orderItems.price}`, `{details.quantity}`
- Field names support spaces, Chinese characters, numbers, and special symbols
- Leading/trailing whitespace in field names is automatically trimmed
- Internal whitespace is preserved

**Examples**:

Input Formula | Description
---|---
`{total_amount}` | Reference main field "total_amount"
`{订单金额}` | Reference Chinese field name
`{order items.price}` | Field name with space
`{  amount  }` | Whitespace trimmed to `{amount}`
`{items.price} * {items.quantity}` | Multiple field references

**Edge Cases**:
- Empty field names `{}` are invalid
- Nested curly braces are not supported
- Field names containing only whitespace are trimmed

**amis Migration Hints**:
- amis uses `${fieldName}` instead of `{fieldName}`
- Migration tool must convert all `{` to `${` and `}` remains unchanged
- **Complexity**: Medium

---

### R-002: Formula Variable Prefix Transformation
**Category**: Syntax  
**Description**: Field references are transformed by prepending a context prefix and converting to array access notation.

**Detailed Explanation**:
The formula engine transforms `{fieldName}` patterns into `__values["fieldName"]` for evaluation:
- `{amount}` → `__values["amount"]`
- `{items.price}` → `__values["items"]["price"]`
- `{field1}.{field2}` → `__values["field1"].__values["field2"]` (dot concatenation)

Transformation algorithm:
1. Match all `{...}` patterns using regex `/(\{[^{}]*\})/g`
2. Replace `{` with `["` and `}` with `"]`
3. Replace internal `.` with `"]["`
4. Prepend context prefix (typically `__values`)

**Examples**:

Original | Transformed
---|---
`{amount} * 1.1` | `__values["amount"] * 1.1`
`{items.price} + {items.tax}` | `__values["items"]["price"] + __values["items"]["tax"]`
`sum({items.quantity})` | `sum(__values["items"]["quantity"])`

**Edge Cases**:
- String literals containing `{fieldName}` are NOT transformed (regex limitation)
- Control flow statements (if/while) with braces are not supported

**amis Migration Hints**:
- amis has native field reference without manual transformation
- No equivalent transformation needed in amis-formula
- **Complexity**: Low (automatic in amis)

---

### R-003: Field Reference Validation
**Category**: Syntax  
**Description**: The formula engine validates that referenced fields exist in the form schema before evaluation.

**Detailed Explanation**:
Before executing a formula, the engine:
1. Extracts all field references from the formula string
2. Checks each reference against the form's field definitions
3. Validates field type compatibility with formula operations
4. Skips `odata` type fields (see R-018)

**Examples**:

Formula | Validation Result
---|---
`{amount} + {tax}` | ✓ Valid if both fields exist
`{nonExistentField}` | ✗ Invalid field reference
`{odataField}` | ⊘ Skipped (odata excluded)

**Edge Cases**:
- Opinion fields are excluded from validation
- System fields like `approver`, `applicant` are always available

**amis Migration Hints**:
- amis has built-in field validation
- Implement custom validation for odata field exclusion
- **Complexity**: Low

---

## 2. Built-in Functions

### R-004: sum() - Array Summation
**Category**: Functions  
**Description**: Calculates the sum of all numeric values in an array, typically from sub-table fields.

**Detailed Explanation**:
```javascript
sum(sub_field_code_values)
```
- Accepts array of numeric values
- Undefined or empty string values are treated as `0`
- Non-numeric values throw error
- Returns `0` for empty arrays
- All values converted to float using `to_float()` method

**Examples**:

Input | Output
---|---
`sum([10, 20, 30])` | `60`
`sum([1.5, 2.5, 3])` | `7.0`
`sum([10, "", undefined, 20])` | `30` (blanks → 0)
`sum([])` | `0`
`sum([10, "abc"])` | Error: "数据内容必须全为数字"

**Edge Cases**:
- Mixed numeric/string arrays throw error
- `NaN` values throw error
- Null/undefined arrays return `0`

**amis Migration Hints**:
- amis has native `SUM()` function
- Ensure blank value handling matches (0 vs skip)
- **Complexity**: Low

---

### R-005: average() - Array Mean
**Category**: Functions  
**Description**: Calculates the arithmetic mean of numeric values in an array.

**Detailed Explanation**:
```javascript
average(sub_field_code_values)
```
- Formula: `sum(array) / count(array)`
- Returns empty string for empty arrays
- Inherits sum() validation rules

**Examples**:

Input | Output
---|---
`average([10, 20, 30])` | `20`
`average([1, 2, 3, 4])` | `2.5`
`average([100])` | `100`
`average([])` | `""` (empty string)

**Edge Cases**:
- Single-element arrays return that element
- Zero-length arrays return empty string, not error

**amis Migration Hints**:
- amis has `AVG()` function
- Handle empty array case explicitly (return "" vs 0)
- **Complexity**: Low

---

### R-006: count() - Array Length
**Category**: Functions  
**Description**: Returns the number of elements in an array.

**Detailed Explanation**:
```javascript
count(sub_field_code_values)
```
- Returns `.length` property of array
- Returns empty string for null/undefined/empty arrays

**Examples**:

Input | Output
---|---
`count([1, 2, 3])` | `3`
`count(["a", "b"])` | `2`
`count([])` | `""` (empty string)

**Edge Cases**:
- Does not validate element types
- Counts `null` and `undefined` elements

**amis Migration Hints**:
- amis has `COUNT()` function
- Return type difference: number vs empty string for empty arrays
- **Complexity**: Low

---

### R-007: max() - Array Maximum
**Category**: Functions  
**Description**: Returns the largest numeric value in an array.

**Detailed Explanation**:
```javascript
max(sub_field_code_values)
```
- Returns empty string for empty arrays
- All values converted to float
- Uses numeric sort before returning last element

**Examples**:

Input | Output
---|---
`max([10, 50, 30])` | `50`
`max([1.5, 2.9, 2.1])` | `2.9`
`max([100])` | `100`
`max([])` | `""`
`max([10, "abc"])` | Error: "数据内容必须全为数字"

**Edge Cases**:
- Negative numbers handled correctly
- String numbers converted before comparison

**amis Migration Hints**:
- amis has `MAX()` function
- Ensure numeric coercion behavior matches
- **Complexity**: Low

---

### R-008: min() - Array Minimum
**Category**: Functions  
**Description**: Returns the smallest numeric value in an array.

**Detailed Explanation**:
```javascript
min(sub_field_code_values)
```
- Returns empty string for empty arrays
- All values converted to float
- Uses numeric sort and returns first element

**Examples**:

Input | Output
---|---
`min([10, 50, 30])` | `10`
`min([1.5, 2.9, 2.1])` | `1.5`
`min([-5, 0, 5])` | `-5`
`min([])` | `""`

**Edge Cases**:
- Handles negative numbers
- Single-element arrays return that element

**amis Migration Hints**:
- amis has `MIN()` function
- **Complexity**: Low

---

### R-009: numToRMB() - Chinese Currency Conversion
**Category**: Functions  
**Description**: Converts numeric amounts to Chinese RMB text representation (大写人民币).

**Detailed Explanation**:
```javascript
numToRMB(num)
```
- Converts numbers to traditional Chinese financial notation
- Handles negative numbers with "(负)" prefix
- Maximum value: 999,999,999,999 (trillion limit)
- Minimum value: -999,999,999,999
- Automatically formats decimal places (up to 2 decimals)
- Invalid numbers return "无效数值！"

Character mappings:
- Digits: 零壹贰叁肆伍陆柒捌玖
- Units: 仟佰拾亿仟佰拾万仟佰拾元角分

**Examples**:

Input | Output
---|---
`numToRMB(123.45)` | "壹佰贰拾叁元肆角伍分"
`numToRMB(1000)` | "壹仟元整"
`numToRMB(-500)` | "(负)伍佰元整"
`numToRMB(10000)` | "壹万元整"
`numToRMB("abc")` | "无效数值！"
`numToRMB(1e12)` | "无效数值！" (exceeds limit)

**Edge Cases**:
- Zero conversion: "零元整"
- Removes redundant "零" characters
- Handles "整" suffix for whole amounts
- Decimal rounding to 2 places

**amis Migration Hints**:
- NO equivalent in amis-formula
- Requires custom function implementation
- Consider JS-based plugin or external library
- **Complexity**: High

---

### R-010: to_integer() - String to Integer
**Category**: Functions  
**Description**: Converts string values to integer numbers with fallback handling.

**Detailed Explanation**:
```javascript
String.prototype.to_integer(defaultValue)
```
- Uses `parseInt()` for conversion
- Returns parsed integer if successful
- Returns `defaultValue` if parsing fails and provided
- Returns `null` if parsing fails and no default
- Handles "0" correctly (returns 0, not falsy)

**Examples**:

Input | Output
---|---
`"123".to_integer()` | `123`
`"45.67".to_integer()` | `45` (truncates)
`"abc".to_integer(0)` | `0` (uses default)
`"abc".to_integer()` | `null` (no default)
`"0".to_integer()` | `0`

**Edge Cases**:
- Whitespace is handled by parseInt
- Leading zeros ignored
- Hex strings (0x) parsed if valid

**amis Migration Hints**:
- amis uses `INT()` function or `Number()` casting
- Implement default value logic with `IF()` or `??` operator
- **Complexity**: Medium

---

### R-011: to_float() - String to Float
**Category**: Functions  
**Description**: Converts string values to floating-point numbers with fallback handling.

**Detailed Explanation**:
```javascript
String.prototype.to_float(defaultValue)
```
- Uses `parseFloat()` for conversion
- Returns parsed float if successful
- Returns `defaultValue` if parsing fails and provided
- Returns `null` if parsing fails and no default
- Handles "0" correctly

**Examples**:

Input | Output
---|---
`"123.45".to_float()` | `123.45`
`"1.23e2".to_float()` | `123` (scientific notation)
`"abc".to_float(0.0)` | `0.0`
`"0".to_float()` | `0`

**Edge Cases**:
- Trailing non-numeric characters ignored
- Multiple decimals parse up to second decimal

**amis Migration Hints**:
- amis uses `NUMBER()` or type coercion
- **Complexity**: Medium

---

### R-012: contains() - Array Contains Element
**Category**: Functions  
**Description**: Checks if an array contains a specific element using equality comparison.

**Detailed Explanation**:
```javascript
Array.prototype.contains(ele)
```
- Returns `false` if element is falsy
- Uses `==` equality (not strict `===`)
- Iterates entire array for match

**Examples**:

Input | Output
---|---
`[1, 2, 3].contains(2)` | `true`
`["a", "b"].contains("c")` | `false`
`[1, "1"].contains("1")` | `true` (loose equality)
`[null, undefined].contains(null)` | `false` (falsy check)

**Edge Cases**:
- Null/undefined element returns false immediately
- Empty arrays return false
- Object comparison by reference, not value

**amis Migration Hints**:
- amis-formula uses `ARRAYSOME()` or `INCLUDES()`
- Mind the equality type (== vs ===)
- **Complexity**: Medium

---

### R-013: uniq() - Array Deduplication
**Category**: Functions  
**Description**: Removes duplicate elements from an array, returning unique values only.

**Detailed Explanation**:
```javascript
Array.prototype.uniq()
```
- Uses `indexOf()` to detect first occurrence
- Preserves original order
- Works with primitives (strings, numbers, booleans)
- Object comparison by reference, not deep equality

**Examples**:

Input | Output
---|---
`[1, 2, 2, 3].uniq()` | `[1, 2, 3]`
`["a", "b", "a"].uniq()` | `["a", "b"]`
`[1, "1"].uniq()` | `[1, "1"]` (different types)

**Edge Cases**:
- Empty arrays return empty
- Single-element arrays unchanged
- `null` and `undefined` treated as unique values

**amis Migration Hints**:
- amis-formula uses `UNIQ()` function
- **Complexity**: Low

---

### R-014: uniqById() - Array Deduplication by ID
**Category**: Functions  
**Description**: Removes duplicate objects from an array based on `id` or `_id` property.

**Detailed Explanation**:
```javascript
Array.prototype.uniqById()
```
- Checks for `id` property first, then `_id`
- Keeps first occurrence of each unique ID
- Returns empty array if no valid IDs found
- Null/undefined array elements are skipped

**Examples**:

Input | Output
---|---
`[{id:1,name:"A"},{id:2,name:"B"},{id:1,name:"C"}].uniqById()` | `[{id:1,name:"A"},{id:2,name:"B"}]`
`[{_id:"a"},{_id:"b"},{_id:"a"}].uniqById()` | `[{_id:"a"},{_id:"b"}]`
`[{name:"A"},{name:"B"}].uniqById()` | `[]` (no id/\_id)

**Edge Cases**:
- Objects without id/_id are excluded from result
- Mixed id and _id properties: id takes precedence
- Null elements skipped

**amis Migration Hints**:
- NO direct equivalent in amis-formula
- Implement using `ARRAYMAP()` + `UNIQ()` + `FILTER()`
- **Complexity**: High

---

### R-015: getEach() - Property Extraction
**Category**: Functions  
**Description**: Extracts a specific property from each object in an array, returning an array of values.

**Detailed Explanation**:
```javascript
Array.prototype.getEach(code)
```
- Equivalent to `.map(item => item[code])`
- Returns array of property values
- Undefined properties return `undefined` in result

**Examples**:

Input | Output
---|---
`[{name:"Alice"},{name:"Bob"}].getEach("name")` | `["Alice", "Bob"]`
`[{age:20},{age:30}].getEach("age")` | `[20, 30]`
`[{a:1},{b:2}].getEach("a")` | `[1, undefined]`

**Edge Cases**:
- Missing properties return undefined, not error
- Empty arrays return empty arrays
- Nested objects require multiple getEach() calls

**amis Migration Hints**:
- amis uses `ARRAYMAP(arr, item => item.code)`
- **Complexity**: Low

---

## 3. Field Type Handling

### R-016: Table Field Transposition
**Category**: Field Types  
**Description**: Sub-table (table type) field values are transposed from row-major to column-major format for formula evaluation.

**Detailed Explanation**:
Original format (row-major):
```json
[
  {"price": 10, "quantity": 2},
  {"price": 20, "quantity": 3},
  {"price": 30, "quantity": 1}
]
```

Transposed format (column-major):
```json
{
  "price": [10, 20, 30],
  "quantity": [2, 3, 1]
}
```

This enables aggregation formulas like:
- `sum({orderItems.price})` → `sum([10, 20, 30])` → `60`
- `average({orderItems.quantity})` → `average([2, 3, 1])` → `2`

Algorithm:
1. Extract all sub-fields from table field definition
2. Iterate over each row in table values
3. Recursively call `init_formula_values()` for each row
4. Use `getEach()` to extract each column
5. Merge column arrays into main `__values` object

**Examples**:

Input (Table Field) | Output (__values)
---|---
`items: [{a:1,b:4},{a:2,b:5}]` | `{a:[1,2], b:[4,5]}`

**Edge Cases**:
- Empty table arrays result in undefined columns
- Null rows are skipped
- Missing column values become `undefined` in array

**amis Migration Hints**:
- amis handles nested data naturally without transposition
- Use `ARRAYMAP()` + aggregation functions directly on nested arrays
- **Complexity**: High

---

### R-017: User Field Expansion
**Category**: Field Types  
**Description**: User-type fields are expanded from user IDs to full user objects with name, organization, roles, and contact information.

**Detailed Explanation**:
Input: User ID(s) - `"userId123"` or `["userId1", "userId2"]`

Output structure:
```json
{
  "name": ["张三", "李四"],
  "organization": {
    "name": ["销售部", "市场部"],
    "fullname": ["华炎集团/销售部", "华炎集团/市场部"]
  },
  "hr": {...},
  "sort_no": [...],
  "mobile": [...],
  "work_phone": [...],
  "position": [...],
  "roles": ["admin", "user", ...]
}
```

Expansion logic:
1. Fetch user records from `users` collection
2. If single user: return user object
3. If multiple users: merge properties into arrays using `getProperty()`
4. Flatten roles arrays and deduplicate

**Examples**:

Formula | Result
---|---
`{approver.name}` | "张三" (single user)
`{approvers.name}` | ["张三", "李四"] (multiple users)
`{approver.organization.name}` | "销售部"

**Edge Cases**:
- Non-existent user IDs return empty objects
- Deleted users may cause formula errors

**amis Migration Hints**:
- amis does not auto-expand references
- Use explicit JOIN or LOOKUP functions
- **Complexity**: High

---

### R-018: Group/Organization Field Expansion
**Category**: Field Types  
**Description**: Group-type fields are expanded from organization IDs to organization objects with id, name, and fullname.

**Detailed Explanation**:
Input: Organization ID(s)

Output structure:
```json
{
  "id": ["orgId1", "orgId2"],
  "name": ["销售部", "市场部"],
  "fullname": ["华炎集团/销售部", "华炎集团/市场部"]
}
```

Similar to user expansion but simpler structure.

**Examples**:

Formula | Result
---|---
`{department.name}` | "销售部"
`{departments.fullname}` | ["华炎集团/销售部", "..."]

**Edge Cases**:
- Invalid organization IDs return empty objects

**amis Migration Hints**:
- Requires explicit data fetching in amis
- **Complexity**: High

---

### R-019: OData Field Exclusion
**Category**: Field Types  
**Description**: Fields with `type: 'odata'` are excluded from formula computation entirely.

**Detailed Explanation**:
OData fields represent external data source connections that:
- May not be loaded at formula evaluation time
- Could cause performance issues with large datasets
- Have complex query semantics incompatible with simple formulas

During formula field collection, odata fields are skipped:
```javascript
if(field.type === 'odata'){
    continue; // Skip this field
}
```

OData field values in `__values` are assigned as-is (empty object by default):
```javascript
__values[field.code] = autoFormDoc[field.code] || {}
```

**Examples**:

Field Definition | Formula Behavior
---|---
`{normalField}` | ✓ Evaluated
`{odataField}` | ⊘ Skipped
`{odataField.subField}` | ⊘ Skipped

**Edge Cases**:
- Referencing odata fields in formulas may cause errors or undefined results
- Nested fields within odata fields are also excluded

**amis Migration Hints**:
- amis supports external data sources differently
- Document odata field limitations explicitly
- **Complexity**: Medium

---

### R-020: Opinion Field Exclusion
**Category**: Field Types  
**Description**: Opinion fields (approval comments/signatures) are excluded from formula computation.

**Detailed Explanation**:
Opinion fields are identified using a helper method:
```javascript
if(InstanceformTemplate.helpers.isOpinionField(field)){
    continue; // Skip
}
```

These fields contain approval history data, which:
- Is generated during workflow execution, not at form submission
- Is not suitable for pre-computation formulas
- May not exist when default values are calculated

**Examples**:

Field Type | Excluded?
---|---
Approval comment | Yes
Signature field | Yes
Regular text field | No

**Edge Cases**:
- Opinion fields in sub-tables are also excluded

**amis Migration Hints**:
- Define opinion field types explicitly in migration tool
- **Complexity**: Low

---

## 4. Formula Dependency Sorting

### R-021: Bubble Sort Dependency Algorithm
**Category**: Dependency Sorting  
**Description**: Formula fields are sorted using bubble sort to ensure dependent formulas evaluate after their dependencies.

**Detailed Explanation**:
The sorting algorithm ensures that if Formula B references Field A, then Formula A must be calculated before Formula B.

Algorithm pseudocode:
```javascript
i = formulas.length
while i > 0:
    for j = 0 to i-1:
        current_field = formulas[j]
        next_field = formulas[j+1]
        
        if NOT codeIsUseInFormula(current_field.code, next_field.formula):
            // Current field is NOT used by next formula
            // Swap positions
            formulas[j] = next_field
            formulas[j+1] = current_field
    i--
```

The key check `codeIsUseInFormula(code, formula)`:
- Returns `true` if `{code}` or `{code.subfield}` appears in formula
- Uses regex matching with word boundary checks
- Handles both direct references and sub-field references

**Examples**:

Original Order | Sorted Order | Reason
---|---|---
1. `{B} = {A} * 2`<br>2. `{A} = 100` | 1. `{A} = 100`<br>2. `{B} = {A} * 2` | B depends on A
1. `{total} = {price} * {qty}`<br>2. `{price} = 100`<br>3. `{qty} = 5` | 1. `{price} = 100`<br>2. `{qty} = 5`<br>3. `{total} = {price} * {qty}` | Total depends on both

**Edge Cases**:
- Circular dependencies cause infinite loops (not detected)
- Self-referencing formulas `{A} = {A} + 1` not prevented
- Complex nested dependencies may require multiple passes

**amis Migration Hints**:
- amis uses reactive dependency graph (automatically sorted)
- No manual sorting required
- **Complexity**: Low (automatic in amis)

---

### R-022: Dependency Detection via Code Search
**Category**: Dependency Sorting  
**Description**: Dependencies are detected by searching for `{fieldCode}` or `{fieldCode.subfield}` patterns in formula strings.

**Detailed Explanation**:
The `codeIsUseInFormula(code, formula)` function:
1. Constructs pattern `{code}` for direct reference
2. Checks if formula exactly equals `{code}` (direct assignment)
3. Searches for `{code}` with non-word character boundaries
4. Constructs pattern `{code.` for sub-field reference
5. Searches with left-side word boundary check

Word boundary check prevents false positives:
- `{amount}` in formula `{total_amount}` → NOT a match
- `{amount}` in formula `{amount} + 10` → Match

**Examples**:

Code | Formula | Is Used?
---|---|---
`amount` | `{amount} * 1.1` | ✓ Yes
`amount` | `{total_amount}` | ✗ No (part of longer name)
`items` | `sum({items.price})` | ✓ Yes (sub-field)
`price` | `{price}` | ✓ Yes (exact match)

**Edge Cases**:
- Formula `"{amount}"` (quoted) still matches
- Comments in formulas not excluded
- Multiple occurrences all detected

**amis Migration Hints**:
- amis auto-detects dependencies via AST parsing
- **Complexity**: Low

---

## 5. Default Value Evaluation

### R-023: Default Value Formula Execution
**Category**: Default Values  
**Description**: Default value formulas are executed once when a form is initialized, before user interaction.

**Detailed Explanation**:
Default values are evaluated:
- On form load (new record creation)
- After form schema is loaded
- Before rendering form fields

Execution context:
- `__values` contains empty or initial field values
- `approver` is current user
- `applicant` is form initiator
- Dependent fields are evaluated in sorted order

**Examples**:

Field | Default Formula | Result (on load)
---|---|---
`submitDate` | `TODAY()` | Current date
`totalPrice` | `{price} * {quantity}` | 0 (if price/qty empty)
`approverName` | `{approver.name}` | Current user's name

**Edge Cases**:
- Formulas referencing empty fields may return 0 or empty string
- User context variables always available
- Sub-table default values evaluated per row

**amis Migration Hints**:
- amis supports `defaultValue` property with formulas
- Use `data.` prefix for field references
- **Complexity**: Medium

---

### R-024: Blank Value Handling in Defaults
**Category**: Default Values  
**Description**: Blank values in default formulas are handled according to field type: numbers default to 0, text to empty string.

**Detailed Explanation**:
When a referenced field is blank in a default formula:

Field Type | Blank Behavior
---|---
Number | `0`
Currency | `0`
Percent | `0`
Text | `""`
Date | `null`
Datetime | `null`
Checkbox | `false`
Picklist | `""`

This is implemented via `SteedosFormulaBlankValue` enum.

**Examples**:

Formula | Field Values | Result
---|---|---
`{price} * {qty}` | price=blank, qty=blank | `0 * 0 = 0`
`{firstName} + " " + {lastName}` | Both blank | `" "` (space only)
`{total} + 100` | total=blank | `0 + 100 = 100`

**Edge Cases**:
- Arithmetic operations on blanks don't throw errors
- String concatenation with blanks produces empty strings
- Comparison with blanks uses blank default values

**amis Migration Hints**:
- amis uses `null` for blanks by default
- Wrap in `IF(ISEMPTY(field), 0, field)` for explicit 0 default
- **Complexity**: Medium

---

## 6. Condition Transformation

### R-025: Assignment Operator Conversion
**Category**: Condition Transformation  
**Description**: Single equals `=` in condition expressions are converted to double equals `==` for comparison.

**Detailed Explanation**:
Workflow routing conditions use formula syntax that may contain:
- Assignment operators `=` (incorrect for comparison)
- Comparison operators `==` (correct)

Transformation rules:
1. Replace all `=` with `==`
2. Restore `>=` (not `>==`) - replace `>==` with `>=`
3. Restore `<=` (not `<==`) - replace `<==` with `<=`
4. Restore `===` (strict equality) - replace `====` with `===`
5. Restore `==` (equality) - replace `====` with `==`

Regex application order matters to avoid over-replacement.

**Examples**:

Original Condition | Transformed | Description
---|---|---
`{amount}=1000` | `{amount}==1000` | Assignment → Comparison
`{status}="approved"` | `{status}=="approved"` | String comparison
`{price}>=100` | `{price}>=100` | Already correct
`{qty}<=50` | `{qty}<=50` | Already correct

**Edge Cases**:
- Multiple `=` in one line all transformed
- String literals with `=` inside may be affected
- No distinction between intentional assignment and comparison typo

**amis Migration Hints**:
- amis-formula is stricter about operator usage
- Validate condition syntax before migration
- **Complexity**: Low

---

### R-026: Condition Variable Substitution
**Category**: Condition Transformation  
**Description**: Field references in conditions are transformed to use `Form_formula.field_values` context prefix.

**Detailed Explanation**:
Similar to R-002, but for routing conditions:
- `{field}` → `Form_formula.field_values["field"]`
- Enables evaluation in condition context

Before evaluation:
1. Apply R-025 operator conversion
2. Apply prefix transformation using `prependPrefixForFormula()`
3. Evaluate with `eval()`

**Examples**:

Original | Transformed
---|---
`{amount}>1000` | `Form_formula.field_values["amount"]>1000`
`{status}="approved"` | `Form_formula.field_values["status"]=="approved"`

**Edge Cases**:
- Newlines in conditions replaced with `\n` before eval
- Multi-line conditions supported

**amis Migration Hints**:
- amis uses declarative condition definitions
- Convert to amis expression syntax: `${data.amount > 1000}`
- **Complexity**: Medium

---

### R-027: Multi-Line Condition Handling
**Category**: Condition Transformation  
**Description**: Newline characters in conditions are escaped before evaluation to prevent JavaScript syntax errors.

**Detailed Explanation**:
Formula conditions may span multiple lines for readability:
```
{amount} > 1000 &&
{status} == "approved"
```

Before `eval()`:
- Replace `/[\r\n]+/g` with `\\n` (escaped newline)
- Ensures condition evaluates as single expression

**Examples**:

Original Condition | After Escape | Evaluation
---|---|---
`{a} > 1\n&& {b} < 10` | `{a} > 1\\n&& {b} < 10` | ✓ Valid JS
`{status}\n=="approved"` | `{status}\\n=="approved"` | ✓ Valid

**Edge Cases**:
- Windows line endings (`\r\n`) also handled
- Multiple consecutive newlines collapsed to single `\n`

**amis Migration Hints**:
- amis accepts multi-line expressions naturally
- No escaping needed in amis
- **Complexity**: Low

---

## 7. Context Variables

### R-028: approver Variable
**Category**: Context Variables  
**Description**: `{approver}` provides access to the current approval step handler's user information.

**Detailed Explanation**:
The `approver` variable is populated with the user object of the person currently processing the approval step.

Structure:
```json
{
  "name": "张三",
  "organization": {
    "name": "销售部",
    "fullname": "华炎集团/销售部"
  },
  "roles": ["admin", "user"],
  "mobile": "13800138000",
  "work_phone": "010-12345678",
  "position": "经理",
  "hr": {...},
  "sort_no": 1
}
```

Usage in formulas:
- `{approver.name}` - Approver's display name
- `{approver.organization.name}` - Department name
- `{approver.mobile}` - Mobile phone number

**Examples**:

Formula | Result (when approver is user123)
---|---
`{approver.name}` | "张三"
`{approver.organization.name}` | "销售部"
`{approver.roles}.contains("admin")` | `true`

**Edge Cases**:
- Initial submission step: approver = applicant
- System auto-approval: approver may be system user
- Approver changes during re-routing

**amis Migration Hints**:
- Define `approver` in amis data context explicitly
- Fetch user data via API and inject into form data
- **Complexity**: High

---

### R-029: applicant Variable
**Category**: Context Variables  
**Description**: `{applicant}` provides access to the workflow initiator's user information.

**Detailed Explanation**:
The `applicant` variable is populated with the user object of the person who initiated the workflow.

Structure: Same as `approver` (see R-028)

Usage:
- `{applicant.name}` - Applicant's name
- `{applicant.organization.fullname}` - Full org path
- `{applicant.mobile}` - Contact phone

Difference from `approver`:
- `applicant` remains constant throughout workflow
- `approver` changes at each approval step

**Examples**:

Formula | Result
---|---
`{applicant.name}` | "李四" (initiator)
`{applicant.organization.name}` | "市场部"

**Edge Cases**:
- Draft forms may not have applicant yet
- Proxy submission: applicant is proxy, not original requester

**amis Migration Hints**:
- Store applicant info in workflow context at initiation
- Inject into amis data layer
- **Complexity**: High

---

### R-030: $user Variable
**Category**: Context Variables  
**Description**: `$user` references the current logged-in user in formula context, similar to session variables.

**Detailed Explanation**:
The `$user` variable represents the current user session:
- Used in formulas for user-specific calculations
- Typically same as `approver` during approval steps
- May differ from `applicant` if different user is viewing/editing

Structure: Same as `approver` and `applicant`

Usage:
- Access control: `{$user.roles}.contains("admin")`
- Personalization: `"Welcome " + {$user.name}`

**Examples**:

Formula | Result
---|---
`{$user.name}` | Current user's name
`{$user.roles}` | ["user", "editor"]

**Edge Cases**:
- Anonymous access: $user may be null
- System operations: $user may be system account

**amis Migration Hints**:
- Map to amis `window.user` or page context variable
- **Complexity**: Medium

---

## 8. Form Script System

### R-031: CoreForm Event System
**Category**: Form Scripts  
**Description**: The CoreForm system provides event handlers for form lifecycle events (OnLoad, OnChange, etc.).

**Detailed Explanation**:
Form scripts are JavaScript code blocks that:
1. Are stored in `form_version.form_script` property
2. Are evaluated once during form initialization via `eval()`
3. Define event handlers in `CoreForm` object namespace
4. Are triggered at specific form lifecycle points

Event handler structure:
```javascript
CoreForm = {
  form_OnLoad: function() {
    // Executed when form loads
  },
  fieldName: {
    onChange: function() {
      // Executed when field changes
    }
  }
}
```

Supported events:
- `form_OnLoad`: Form initialization
- `fieldName.onChange`: Field value change
- `fieldName.onBlur`: Field loses focus
- Custom events as defined

**Examples**:

Form Script:
```javascript
CoreForm = {
  form_OnLoad: function() {
    console.log("Form loaded");
  },
  amount: {
    onChange: function() {
      console.log("Amount changed");
    }
  }
}
```

Execution flow:
1. Form loads → `initFormScripts()` called
2. Script evaluated → CoreForm populated
3. User interacts → Events trigger via `runFormScripts()`

**Edge Cases**:
- Empty scripts (whitespace only) are skipped
- Script evaluation errors logged, don't crash form
- Multiple event handlers for same field allowed (last one wins)

**amis Migration Hints**:
- Map to amis event actions: `onEvent`, `onChange`
- Convert imperative scripts to declarative amis actions
- Use amis APIs: `setValue`, `getValue`, `reload`
- **Complexity**: High

---

### R-032: Form Script Initialization
**Category**: Form Scripts  
**Description**: Form scripts are loaded and evaluated during form version initialization using JavaScript eval().

**Detailed Explanation**:
Initialization process:
1. Fetch form version from `WorkflowManager.getInstanceFormVersion()`
2. Extract `form_script` property
3. Check if script is non-empty (after removing whitespace/newlines)
4. Execute `eval(form_script)` to define CoreForm handlers
5. Log errors if evaluation fails

Script validation:
```javascript
if(form_script && form_script.replace(/\n/g,"").replace(/\s/g,"").length > 0){
    eval(form_script);
}
```

This ensures truly empty scripts don't cause errors.

**Examples**:

Form Script | Initialization Result
---|---
Valid JS defining CoreForm | ✓ Handlers registered
Empty string | ⊘ Skipped (logged)
Invalid syntax | ✗ Error logged, form continues

**Edge Cases**:
- Syntax errors in scripts don't prevent form load
- Global variable pollution from scripts possible
- Scripts can access form context via `InstanceManager`

**amis Migration Hints**:
- No equivalent of eval() in amis (by design, security)
- Extract script logic and convert to amis action definitions
- **Complexity**: High

---

### R-033: Form Script Execution Trigger
**Category**: Form Scripts  
**Description**: Form scripts are triggered by calling runFormScripts(formKey, eventName) with specific field and event identifiers.

**Detailed Explanation**:
Execution flow:
```javascript
runFormScripts(formKey, eventName)
  → Check if CoreForm[formKey][eventName] is a function
    → If yes, execute via eval()
```

Special case: `form_OnLoad` always executes first if defined.

Parameters:
- `formKey`: Field code (e.g., "amount", "status")
- `eventName`: Event name (e.g., "onChange", "onBlur")

Example invocation:
```javascript
runFormScripts("amount", "onChange");
  → Executes CoreForm.amount.onChange()
```

**Examples**:

Call | Executed Handler
---|---
`runFormScripts("", "")` | Only `form_OnLoad` (if defined)
`runFormScripts("price", "onChange")` | `form_OnLoad` + `CoreForm.price.onChange`
`runFormScripts("unknown", "onClick")` | Only `form_OnLoad`

**Edge Cases**:
- Undefined handlers are silently skipped
- Errors in handlers are logged but don't crash form
- Re-entrant calls possible (handler triggers another field change)

**amis Migration Hints**:
- Map to amis `onEvent` with `componentId` targeting
- Use `${event.data.fieldName}` for dynamic field handling
- **Complexity**: Medium

---

### R-034: CoreForm Instance Management
**Category**: Form Scripts  
**Description**: CoreForm.instanceform object provides access to form state and field values during script execution.

**Detailed Explanation**:
`CoreForm.instanceform` is a proxy to the current form instance, allowing scripts to:
- Read field values: `CoreForm.instanceform.fieldName`
- Write field values: `CoreForm.instanceform.fieldName = value`
- Access form metadata

Instance is initialized:
```javascript
CoreForm = {};
CoreForm.instanceform = {};
```

Before each script execution, instance is refreshed with current form state.

**Examples**:

Script Code | Effect
---|---
`CoreForm.instanceform.amount` | Reads `amount` field value
`CoreForm.instanceform.total = 100` | Sets `total` field to 100
`CoreForm.instanceform` | Returns entire form data object

**Edge Cases**:
- Direct mutation may bypass validation
- Circular references between fields possible
- Non-existent fields return undefined

**amis Migration Hints**:
- Map to amis `data` context object
- Use `setValue(fieldName, value)` instead of direct assignment
- **Complexity**: High

---

## 9. Number Precision Handling

### R-035: Decimal Place Rounding
**Category**: Number Precision  
**Description**: Numeric formula results are rounded to specified decimal places using toFixed() method.

**Detailed Explanation**:
When a formula field has a `digits` property:
1. Formula is evaluated to produce numeric result
2. Result is rounded using `value.toFixed(digits)`
3. Rounded value is formatted for display using `Steedos.numberToString()`

Example:
```javascript
if('digits' in formula_field){
    var value = Form_formula.field_values[formula_field.code];
    if(typeof(value) == 'number'){
        value = value.toFixed(formula_field.digits);
    }
}
```

Field configuration:
```json
{
  "code": "total",
  "formula": "{price} * {qty}",
  "digits": 2
}
```

**Examples**:

Formula Result | Digits | Displayed Value
---|---|---
`123.456789` | `2` | `"123.46"`
`100.00` | `0` | `"100"`
`99.995` | `2` | `"100.00"` (banker's rounding)
`"abc"` | `2` | `"abc"` (non-numeric ignored)

**Edge Cases**:
- Non-numeric results bypass rounding
- Negative numbers handled correctly
- Very large numbers may lose precision
- `toFixed()` uses banker's rounding (round half to even)

**amis Migration Hints**:
- amis uses `ROUND()` function explicitly
- `FIXED()` function for decimal places
- **Complexity**: Low

---

### R-036: Number Display Formatting
**Category**: Number Precision  
**Description**: Formatted numbers are displayed in a read-only companion field with thousand separators and proper localization.

**Detailed Explanation**:
For numeric formula fields with `digits`:
1. Hidden input stores raw numeric value
2. Visible read-only field displays formatted value
3. Formatting applied via `Steedos.numberToString(value, digits)`

DOM structure:
```html
<input type="text" class="coreform-read-only-number" value="1,234.56" readonly>
<input type="hidden" name="field_total" value="1234.56">
```

Formatting rules:
- Thousand separators: `1234567` → `"1,234,567"`
- Decimal places: Controlled by `digits` parameter
- Localization: Uses current locale settings

**Examples**:

Raw Value | Digits | Formatted Display
---|---|---
`1234.567` | `2` | `"1,234.57"`
`1000000` | `0` | `"1,000,000"`
`0.123` | `3` | `"0.123"`

**Edge Cases**:
- Zero values: `"0.00"` (with decimals) or `"0"` (without)
- Negative values: `"-1,234.56"`
- Very small numbers may display as `"0.00"` if digits insufficient

**amis Migration Hints**:
- amis `input-number` component has built-in formatting
- Set `precision` and `thousandSeparator` properties
- **Complexity**: Low

---

### R-037: Float Conversion in Aggregation
**Category**: Number Precision  
**Description**: Array values are converted to float before aggregation operations to ensure numeric calculations.

**Detailed Explanation**:
In aggregation functions (sum, average, max, min):
1. Each array element converted via `toString().to_float()`
2. Handles string numbers: `"123.45"` → `123.45`
3. Handles undefined/empty: `""` → `0` (in sum)
4. Throws error for non-numeric strings

Conversion before operation:
```javascript
for(var i=0; i < sub_field_code_values.length; i++){
    sub_field_code_values[i] = sub_field_code_values[i].toString().to_float();
}
```

**Examples**:

Input Array | Converted Array
---|---
`[10, "20", 30]` | `[10, 20, 30]`
`["1.5", "2.5"]` | `[1.5, 2.5]`
`[10, "", undefined, 20]` | `[10, 0, 0, 20]` (sum context)
`[10, "abc"]` | Error: "数据内容必须全为数字"

**Edge Cases**:
- Boolean values: `true` → `1`, `false` → `0`
- Null: `null.toString()` throws error
- Scientific notation: `"1e2"` → `100`

**amis Migration Hints**:
- amis coerces types automatically in most cases
- Explicit `NUMBER()` wrapper for strict type control
- **Complexity**: Medium

---

## Summary Table

### Migration Complexity Overview

Rule ID | Category | Rule Name | amis Migration Complexity
---|---|---|---
R-001 | Syntax | Field Reference Syntax | Medium
R-002 | Syntax | Formula Variable Prefix | Low
R-003 | Syntax | Field Reference Validation | Low
R-004 | Functions | sum() - Array Summation | Low
R-005 | Functions | average() - Array Mean | Low
R-006 | Functions | count() - Array Length | Low
R-007 | Functions | max() - Array Maximum | Low
R-008 | Functions | min() - Array Minimum | Low
R-009 | Functions | numToRMB() - Chinese Currency | High
R-010 | Functions | to_integer() - String to Integer | Medium
R-011 | Functions | to_float() - String to Float | Medium
R-012 | Functions | contains() - Array Contains | Medium
R-013 | Functions | uniq() - Array Deduplication | Low
R-014 | Functions | uniqById() - ID-based Deduplication | High
R-015 | Functions | getEach() - Property Extraction | Low
R-016 | Field Types | Table Field Transposition | High
R-017 | Field Types | User Field Expansion | High
R-018 | Field Types | Group/Organization Expansion | High
R-019 | Field Types | OData Field Exclusion | Medium
R-020 | Field Types | Opinion Field Exclusion | Low
R-021 | Dependency | Bubble Sort Algorithm | Low (automatic)
R-022 | Dependency | Dependency Detection | Low
R-023 | Default Values | Default Formula Execution | Medium
R-024 | Default Values | Blank Value Handling | Medium
R-025 | Conditions | Assignment Operator Conversion | Low
R-026 | Conditions | Variable Substitution | Medium
R-027 | Conditions | Multi-Line Handling | Low
R-028 | Context | approver Variable | High
R-029 | Context | applicant Variable | High
R-030 | Context | $user Variable | Medium
R-031 | Form Scripts | CoreForm Event System | High
R-032 | Form Scripts | Script Initialization | High
R-033 | Form Scripts | Script Execution Trigger | Medium
R-034 | Form Scripts | Instance Management | High
R-035 | Precision | Decimal Place Rounding | Low
R-036 | Precision | Number Display Formatting | Low
R-037 | Precision | Float Conversion | Medium

### Complexity Legend

**Low (13 rules)**: Direct amis equivalents exist or automatic handling
- Simple function mapping
- Built-in amis features
- Automated transformations

**Medium (12 rules)**: Requires adaptation or configuration
- Syntax differences
- Type handling adjustments
- Context variable mapping
- Minor logic changes

**High (12 rules)**: Complex migration or custom implementation
- No direct amis equivalent
- Requires custom functions or plugins
- Complex data transformations
- Event system redesign
- Context variable infrastructure

---

## Migration Strategy Recommendations

### Phase 1: Foundation (Low Complexity Items)
1. Map basic aggregation functions (sum, average, count, max, min)
2. Implement field reference syntax conversion (`{field}` → `${data.field}`)
3. Set up dependency auto-detection (leverage amis reactive system)
4. Configure number formatting (precision, thousand separators)

### Phase 2: Adaptation (Medium Complexity Items)
1. Implement type coercion helpers (to_integer, to_float wrappers)
2. Map condition syntax (= → ==, variable substitution)
3. Set up context variables ($user mapping)
4. Adapt blank value handling logic
5. Implement array utility functions (contains wrapper)

### Phase 3: Custom Implementation (High Complexity Items)
1. **Priority 1**: User/Group field expansion (critical for permissions)
   - Implement data loading layer
   - Create lookup/join helpers
   
2. **Priority 2**: Table field transposition (critical for sub-table formulas)
   - Develop data transformer
   - Test aggregation scenarios
   
3. **Priority 3**: numToRMB() function (business-specific)
   - Port JS implementation or use library
   - Create custom amis function plugin
   
4. **Priority 4**: uniqById() function
   - Implement using amis array functions
   
5. **Priority 5**: CoreForm event system
   - Redesign as amis action chains
   - Document event mapping guide
   - Consider manual conversion for complex scripts

### Testing Priorities
1. **Critical**: Aggregation functions (sum, average, count)
2. **Critical**: User/Group context variables (approver, applicant)
3. **High**: Table field formulas
4. **High**: Conditional routing logic
5. **Medium**: Number precision/formatting
6. **Medium**: Array utilities (uniq, contains, getEach)
7. **Low**: Form scripts (manual review often needed)

### Documentation Deliverables
1. Formula syntax quick reference (Workflow → amis mapping)
2. Function equivalency table
3. Context variable setup guide
4. Form script migration playbook
5. Edge case handling examples

---

## Appendix: Formula Evaluation Context

### Complete __values Structure

```javascript
{
  // Main form fields
  "field1": <value>,
  "field2": <value>,
  
  // Sub-table columns (transposed)
  "tableField.column1": [value1, value2, ...],
  "tableField.column2": [value1, value2, ...],
  
  // Context variables
  "approver": {
    "name": "...",
    "organization": { "name": "...", "fullname": "..." },
    "roles": ["role1", "role2"],
    "mobile": "...",
    "work_phone": "...",
    "position": "...",
    "hr": {...}
  },
  "applicant": { /* Same structure as approver */ },
  
  // User-expanded fields
  "selectedUser": {
    "name": ["user1", "user2"],
    "organization": {
      "name": ["dept1", "dept2"],
      "fullname": ["org/dept1", "org/dept2"]
    },
    "roles": ["role1", "role2", ...],
    // ... other user properties
  },
  
  // Organization-expanded fields
  "selectedOrg": {
    "id": ["orgId1", "orgId2"],
    "name": ["dept1", "dept2"],
    "fullname": ["org/dept1", "org/dept2"]
  }
}
```

### Formula Evaluation Order

1. **Initialization Phase**
   - Load form schema and values
   - Expand user/group fields
   - Transpose table fields
   - Build `__values` object
   - Add context variables (approver, applicant)

2. **Dependency Sorting Phase**
   - Extract all formula field definitions
   - Detect dependencies via `codeIsUseInFormula()`
   - Apply bubble sort algorithm
   - Generate execution order

3. **Formula Execution Phase**
   - Iterate through sorted formula fields
   - Transform formula string (prepend prefix)
   - Evaluate using `eval()`
   - Store result in `__values`
   - Update form field value
   - Apply precision formatting if needed

4. **Form Script Execution Phase**
   - Load form_script from form version
   - Execute `initFormScripts()` to define CoreForm
   - Trigger `form_OnLoad` event
   - Register field change listeners

5. **Condition Evaluation Phase** (for routing)
   - Extract step line conditions
   - Transform operators (= → ==)
   - Apply variable prefix
   - Evaluate condition expressions
   - Determine next steps

---

## Change Log

**Version 1.0** - Initial documentation
- Documented 37 formula engine rules
- Categorized by functionality
- Added migration complexity ratings
- Included comprehensive examples and edge cases

---

## References

This document is based on analysis of the Steedos Workflow formula engine. For technical implementation details, consult the platform source code.

**Maintained by**: Steedos Migration Team  
**Last Updated**: 2024