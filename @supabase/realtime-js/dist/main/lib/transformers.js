"use strict";
/**
 * Helpers to convert the change Payload into native JS types.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.toTimestampString = exports.toArray = exports.toJson = exports.toIntRange = exports.toInt = exports.toFloat = exports.toDateRange = exports.toDate = exports.toBoolean = exports.convertCell = exports.convertColumn = exports.convertChangeData = exports.PostgresTypes = void 0;
// Adapted from epgsql (src/epgsql_binary.erl), this module licensed under
// 3-clause BSD found here: https://raw.githubusercontent.com/epgsql/epgsql/devel/LICENSE
var PostgresTypes;
(function (PostgresTypes) {
    PostgresTypes["abstime"] = "abstime";
    PostgresTypes["bool"] = "bool";
    PostgresTypes["date"] = "date";
    PostgresTypes["daterange"] = "daterange";
    PostgresTypes["float4"] = "float4";
    PostgresTypes["float8"] = "float8";
    PostgresTypes["int2"] = "int2";
    PostgresTypes["int4"] = "int4";
    PostgresTypes["int4range"] = "int4range";
    PostgresTypes["int8"] = "int8";
    PostgresTypes["int8range"] = "int8range";
    PostgresTypes["json"] = "json";
    PostgresTypes["jsonb"] = "jsonb";
    PostgresTypes["money"] = "money";
    PostgresTypes["numeric"] = "numeric";
    PostgresTypes["oid"] = "oid";
    PostgresTypes["reltime"] = "reltime";
    PostgresTypes["time"] = "time";
    PostgresTypes["timestamp"] = "timestamp";
    PostgresTypes["timestamptz"] = "timestamptz";
    PostgresTypes["timetz"] = "timetz";
    PostgresTypes["tsrange"] = "tsrange";
    PostgresTypes["tstzrange"] = "tstzrange";
})(PostgresTypes = exports.PostgresTypes || (exports.PostgresTypes = {}));
/**
 * Takes an array of columns and an object of string values then converts each string value
 * to its mapped type.
 *
 * @param {{name: String, type: String}[]} columns
 * @param {Object} records
 * @param {Object} options The map of various options that can be applied to the mapper
 * @param {Array} options.skipTypes The array of types that should not be converted
 *
 * @example convertChangeData([{name: 'first_name', type: 'text'}, {name: 'age', type: 'int4'}], {first_name: 'Paul', age:'33'}, {})
 * //=>{ first_name: 'Paul', age: 33 }
 */
exports.convertChangeData = (columns, records, options = {}) => {
    let result = {};
    let skipTypes = typeof options.skipTypes !== 'undefined' ? options.skipTypes : [];
    Object.entries(records).map(([key, value]) => {
        result[key] = exports.convertColumn(key, columns, records, skipTypes);
    });
    return result;
};
/**
 * Converts the value of an individual column.
 *
 * @param {String} columnName The column that you want to convert
 * @param {{name: String, type: String}[]} columns All of the columns
 * @param {Object} records The map of string values
 * @param {Array} skipTypes An array of types that should not be converted
 * @return {object} Useless information
 *
 * @example convertColumn('age', [{name: 'first_name', type: 'text'}, {name: 'age', type: 'int4'}], ['Paul', '33'], [])
 * //=> 33
 * @example convertColumn('age', [{name: 'first_name', type: 'text'}, {name: 'age', type: 'int4'}], ['Paul', '33'], ['int4'])
 * //=> "33"
 */
exports.convertColumn = (columnName, columns, records, skipTypes) => {
    let column = columns.find((x) => x.name == columnName);
    if (!column || skipTypes.includes(column.type)) {
        return noop(records[columnName]);
    }
    else {
        return exports.convertCell(column.type, records[columnName]);
    }
};
/**
 * If the value of the cell is `null`, returns null.
 * Otherwise converts the string value to the correct type.
 * @param {String} type A postgres column type
 * @param {String} stringValue The cell value
 *
 * @example convertCell('bool', 'true')
 * //=> true
 * @example convertCell('int8', '10')
 * //=> 10
 * @example convertCell('_int4', '{1,2,3,4}')
 * //=> [1,2,3,4]
 */
exports.convertCell = (type, stringValue) => {
    try {
        if (stringValue === null)
            return null;
        // if data type is an array
        if (type.charAt(0) === '_') {
            let arrayValue = type.slice(1, type.length);
            return exports.toArray(stringValue, arrayValue);
        }
        // If not null, convert to correct type.
        switch (type) {
            case PostgresTypes.abstime:
                return noop(stringValue); // To allow users to cast it based on Timezone
            case PostgresTypes.bool:
                return exports.toBoolean(stringValue);
            case PostgresTypes.date:
                return noop(stringValue); // To allow users to cast it based on Timezone
            case PostgresTypes.daterange:
                return exports.toDateRange(stringValue);
            case PostgresTypes.float4:
                return exports.toFloat(stringValue);
            case PostgresTypes.float8:
                return exports.toFloat(stringValue);
            case PostgresTypes.int2:
                return exports.toInt(stringValue);
            case PostgresTypes.int4:
                return exports.toInt(stringValue);
            case PostgresTypes.int4range:
                return exports.toIntRange(stringValue);
            case PostgresTypes.int8:
                return exports.toInt(stringValue);
            case PostgresTypes.int8range:
                return exports.toIntRange(stringValue);
            case PostgresTypes.json:
                return exports.toJson(stringValue);
            case PostgresTypes.jsonb:
                return exports.toJson(stringValue);
            case PostgresTypes.money:
                return exports.toFloat(stringValue);
            case PostgresTypes.numeric:
                return exports.toFloat(stringValue);
            case PostgresTypes.oid:
                return exports.toInt(stringValue);
            case PostgresTypes.reltime:
                return noop(stringValue); // To allow users to cast it based on Timezone
            case PostgresTypes.time:
                return noop(stringValue); // To allow users to cast it based on Timezone
            case PostgresTypes.timestamp:
                return exports.toTimestampString(stringValue); // Format to be consistent with PostgREST
            case PostgresTypes.timestamptz:
                return noop(stringValue); // To allow users to cast it based on Timezone
            case PostgresTypes.timetz:
                return noop(stringValue); // To allow users to cast it based on Timezone
            case PostgresTypes.tsrange:
                return exports.toDateRange(stringValue);
            case PostgresTypes.tstzrange:
                return exports.toDateRange(stringValue);
            default:
                // All the rest will be returned as strings
                return noop(stringValue);
        }
    }
    catch (error) {
        console.log(`Could not convert cell of type ${type} and value ${stringValue}`);
        console.log(`This is the error: ${error}`);
        return stringValue;
    }
};
const noop = (stringValue) => {
    return stringValue;
};
exports.toBoolean = (stringValue) => {
    switch (stringValue) {
        case 't':
            return true;
        case 'f':
            return false;
        default:
            return null;
    }
};
exports.toDate = (stringValue) => {
    return new Date(stringValue);
};
exports.toDateRange = (stringValue) => {
    let arr = JSON.parse(stringValue);
    return [new Date(arr[0]), new Date(arr[1])];
};
exports.toFloat = (stringValue) => {
    return parseFloat(stringValue);
};
exports.toInt = (stringValue) => {
    return parseInt(stringValue);
};
exports.toIntRange = (stringValue) => {
    let arr = JSON.parse(stringValue);
    return [parseInt(arr[0]), parseInt(arr[1])];
};
exports.toJson = (stringValue) => {
    return JSON.parse(stringValue);
};
/**
 * Converts a Postgres Array into a native JS array
 *
 * @example toArray('{1,2,3,4}', 'int4')
 * //=> [1,2,3,4]
 * @example toArray('{}', 'int4')
 * //=> []
 */
exports.toArray = (stringValue, type) => {
    // this takes off the '{' & '}'
    let stringEnriched = stringValue.slice(1, stringValue.length - 1);
    // converts the string into an array
    // if string is empty (meaning the array was empty), an empty array will be immediately returned
    let stringArray = stringEnriched.length > 0 ? stringEnriched.split(',') : [];
    let array = stringArray.map((string) => {
        return exports.convertCell(type, string);
    });
    return array;
};
/**
 * Fixes timestamp to be ISO-8601. Swaps the space between the date and time for a 'T'
 * See https://github.com/supabase/supabase/issues/18
 *
 * @example toTimestampString('2019-09-10 00:00:00')
 * //=> '2019-09-10T00:00:00'
 */
exports.toTimestampString = (stringValue) => {
    return stringValue.replace(' ', 'T');
};
//# sourceMappingURL=transformers.js.map