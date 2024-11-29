

function join(prefix, key) {
    return prefix ? `${prefix}.${key}` : key;
}

const arrayOperatorKeyRegex = /^(a|[su]\d+)$/;

function isArrayOperatorKey(field) {
    return arrayOperatorKeyRegex.test(field);
}

function isArrayOperator(operator) {
    return operator.a === true && Object.keys(operator).every(isArrayOperatorKey);
}

function flattenObjectInto(target, source, prefix) {
    if (Array.isArray(source) || typeof source !== 'object' || source === null ||
        source instanceof Mongo.ObjectID) {
        target[prefix] = source;
    } else {
        const entries = Object.entries(source);
        if (entries.length) {
        entries.forEach(([key, value]) => {
            flattenObjectInto(target, value, join(prefix, key));
        });
        } else {
        target[prefix] = source;
        }
    }
}

const logDebugMessages = !!process.env.OPLOG_CONVERTER_DEBUG;

function convertOplogDiff(oplogEntry, diff, prefix) {
    if (logDebugMessages) {
        console.log(`convertOplogDiff(${JSON.stringify(oplogEntry)}, ${JSON.stringify(diff)}, ${JSON.stringify(prefix)})`);
    }

    Object.entries(diff).forEach(([diffKey, value]) => {
        if (diffKey === 'd') {
        // Handle `$unset`s.
        if (oplogEntry.$unset === null || oplogEntry.$unset === undefined) {
            oplogEntry.$unset = {};
        }
        Object.keys(value).forEach(key => {
            oplogEntry.$unset[join(prefix, key)] = true;
        });
        } else if (diffKey === 'i') {
        // Handle (potentially) nested `$set`s.
        if (oplogEntry.$set === null || oplogEntry.$set === undefined) {
            oplogEntry.$set = {};
        }
        flattenObjectInto(oplogEntry.$set, value, prefix);
        } else if (diffKey === 'u') {
        // Handle flat `$set`s.
        if (oplogEntry.$set === null || oplogEntry.$set === undefined) {
            oplogEntry.$set = {};
        }
        Object.entries(value).forEach(([key, value]) => {
            oplogEntry.$set[join(prefix, key)] = value;
        });
        } else {
        // Handle s-fields.
        const key = diffKey.slice(1);
        if (isArrayOperator(value)) {
            // Array operator.
            Object.entries(value).forEach(([position, value]) => {
            if (position === 'a') {
                return;
            }

            const positionKey = join(join(prefix, key), position.slice(1));
            if (position[0] === 's') {
                convertOplogDiff(oplogEntry, value, positionKey);
            } else if (value === null) {
                if (oplogEntry.$unset === null || oplogEntry.$unset === undefined) {
                oplogEntry.$unset = {};
                }
                oplogEntry.$unset[positionKey] = true;
            } else {
                if (oplogEntry.$set === null || oplogEntry.$set === undefined) {
                oplogEntry.$set = {};
                }
                oplogEntry.$set[positionKey] = value;
            }
            });
        } else if (key) {
            // Nested object.
            convertOplogDiff(oplogEntry, value, join(prefix, key));
        }
        }
    });
}

export function oplogV2V1Converter(oplogEntry) {
  // Pass-through v1 and (probably) invalid entries.
  if (oplogEntry.$v !== 2 || !oplogEntry.diff) {
    return oplogEntry;
  }

  const convertedOplogEntry = { $v: 2 };
  convertOplogDiff(convertedOplogEntry, oplogEntry.diff, '');
  return convertedOplogEntry;
}