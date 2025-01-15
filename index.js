/**
 * Module providing general utility classes and functions.
 */

'use strict';

/**
 * Return the integer corresponding to the value passed as argument if it is a finite integer,
 * or the specified default value if the value is undefined.
 * The optional validator function is a boolean function returning whether the integer is valid or not.
 * The validator argument is ignored if it is preceded by the errorMessage argument.
 * @param {Number} value Value
 * @param {Function} validator Optional validator function
 * @param {String} errorMessage Optional error message used in the exception
 * @param {Number} defaultValue Returned value if value is undefined
 * @returns Integer corresponding to value or default value.
 * @throws {TypeError} if value is not strictly an integer
 * @throws {RangeError} if value does not pass the validation
 */
function getInteger(value, validator, errorMessage, defaultValue) {
    if (value === undefined) {
        if (arguments.length > 1) {
            defaultValue = arguments[arguments.length - 1];
            if (typeof defaultValue === "number" && isInteger(defaultValue)) {
                return defaultValue;
            }
        }
        return undefined;
    }
    if (!isInteger(value)) {
        if (arguments.length > 1 && typeof arguments[1] === "string") {
            errorMessage = arguments[1];
        } else {
            errorMessage = `${value} is not an integer`;
        }
        throw new TypeError(errorMessage);
    }
    const n = parseInt(value);
    if (arguments.length > 1 && typeof arguments[1] === "function") {
        if (!validator(n)) {
            if (!(arguments.length > 2 && typeof arguments[2] === "string")) {
                errorMessage = `${value} is not a valid value`;
            }
            throw new RangeError(errorMessage);
        }
    }
    return n;
}

/**
 * Return whether the value passed as argument is strictly a finite integer or not.
 * @param {Number} value Value to validate
 * @returns Boolean
 */
function isInteger(value) {
    isFinite(value) && Math.floor(value) == value;
}

/**
 * Function to handle optional function arguments with default values.
 * @param {*} args The arguments variable
 * @param {*} types The list of argument types (typeof)
 * @param {*} dflts The list of argument default values.
 * @returns The resulting list of arguments.
 */
function handleOptionalArgs(args, types, dflts) {
    const rslt = [];
    let index = 0;
    while (types.length) {
        const arg = args[index];
        const type = types.shift();
        const dflt = dflts.shift();
        if (typeof arg === type) {
            rslt.push(arg === undefined || arg === null ? dflt : arg);
            index++;
        } else {
            rslt.push(dflt);
            if (arg === undefined || arg === null ) index++;
        }
    }
    return rslt;
}

/**
 * Set the property of an object.
 * If target is undefined or null a new object is created and returned.
 * The function does nothing if key or value are either undefined or null.
 * If key or value are functions they are evaluated first.
 * @param {Object} target Target object.
 * @param {any} key Property key.
 * @param {any} value Property value.
 * @return the target object.
 */
function setProperty(target, key, value) {
    if (target === undefined || target === null) target = {};
    if (key !== undefined && key !== null &&
        value !== undefined && value !== null) {
        if (typeof key === "function") key = key();
        if (typeof value === "function") value = value();
        target[key] = value;
    }
    return target;
};

/**
 * This function works similarly than Object#assign by assigning properties of source
 * objects to a target object from left to right, but differently than Object#assign
 * it ignores properties that are either undefined or null (see function setProperty()
 * in this module).
 * If target is undefined or null a new object is created, used and returned.
 * @param {Object} target Target object.
 * @param {...Object} sources Source objects. 
 * @returns The target object.
 */
function merge(target, ...sources) {
    if (target === undefined || target === null) target = {};
    for (let source of sources) {
        if (source === undefined || source === null) continue;
        for (let [ key, value ] of Object.entries(source)) {
            setProperty(target, key, value);
        }
    }
    return target;
}

const factorialCache = [];
const maxFactorialArgument = 170;

/**
 * Return the factorial n! of the integer n.
 * @param {Number} n Number
 * @returns The factorial or Infinity if n is greater than 170.
 * @throws {TypeError} if n is not an integer.
 * @throws {RangeError} if n is a negative integer.
 */
function factorial(n) {
    n = getInteger(n, n => n >= 0, "Factorial argument must be a non-negative integer");
    if (n > maxFactorialArgument) return Infinity;
    if (factorialCache[n] === undefined) {
        const f = (n) => n > 1 ? n * f(n - 1) : 1;
        factorialCache[n] = f(n);    
    }
    return factorialCache[n];
}

/**
 * Return the addition of an array of numbers.
 * @param {Array<number>} numbers Array of numbers
 * @returns The addition.
 */
function sum(numbers) {
    if (numbers === undefined || !Array.isArray(numbers) || numbers.length === 0) return undefined;
    return numbers.reduce((previous, current) => previous += current);
}

/**
 * Return the multiplication of an array of numbers.
 * @param {Array<number>} numbers Array of numbers
 * @returns The multiplication.
 */
function mult(numbers) {
    if (numbers === undefined || !Array.isArray(numbers) || numbers.length === 0) return undefined;
    return numbers.reduce((previous, current) => previous *= current);
}

/**
 * Generator of a sequence of integers in a specific range.
 * Enumerations can be both, ascending and descending.
 * @param {Number} start Start value (inclusive).
 * @param {Number} end End value (inclusive).
 * @returns Generator function.
 */
function* enumeration(start = 0, end = start) {
    if (start <= end) {
        for (let i = start; i <= end; i++) {
            yield i;
        }
    } else {
        for (let i = start; i >= end; i--) {
            yield i;
        }
    }
}

/**
 * Generator of a sequence of specified items.
 * The generator skips undefined items and flatten arrays.
 * @param {any} items Items generated by the generator
 * @returns Generator function.
 */
function* sequenceOf(...items) {
    for (const item of items.flat()) if (item) yield item;
}

/**
 * Factory function returning an iterable producing a sub-sequence of a sequence.
 * @param {Function} sequence Iterable.
 * @param {Number} start Optional start index; defaults to 0.
 * @param {Number} length Optional number of elements to be generated; defaults to Number.MAX_SAFE_INTEGER.
 * @returns Iterable object.
 */
function subSequence(sequence, start = 0, length = Number.MAX_SAFE_INTEGER) {
    // The function delegate directly to sequence if the start and length argumnts have default values
    if (start === 0 && length === Number.MAX_SAFE_INTEGER) return sequence;
    // Return a custom generator
    return {
        [Symbol.iterator]() {
            // Get the sequence's iterator
            const iterator = sequence[Symbol.iterator]();
            let i = 0, n = 0;
            // Return a new iterator
            return {
                next() {
                    while (i < start) {
                        i++;
                        iterator.next();
                    }
                    if (n < length) {
                        n++;
                        return iterator.next();
                    }
                    return { done: true };
                }
            }
        }
    }
}

/**
 * Factory function returning an iterable mapping the elements of a sequence.
 * @param {Function} sequence Iterable.
 * @param {Function} callbackFn Callback function implementing the mapping operation.
 *   The function is called with the following arguments:
 *    - element: The current element being processed in the sequence.
 *    - index: The zero-based index of the current element being processed in the sequence.
 * @returns Iterable object.
 */
function mappedSequence(sequence, callbackFn) {
    // The function delegate directly to sequence if the second argument is undefined
    if (callbackFn === undefined) return sequence;
    // Return a custom generator
    return {
        [Symbol.iterator]() {
            // Get the sequence's iterator
            const iterator = sequence[Symbol.iterator]();
            let index = 0;
            // Return a new iterator
            return {
                next() {
                    let { value, done } = iterator.next();
                    if (done) return { done: true };
                    value = callbackFn(value, index++);
                    return { value, done };
                }
            }
        }
    }
}

module.exports = {
    getInteger, isInteger, handleOptionalArgs, setProperty, merge,
    factorial, sum, mult,
    enumeration, sequenceOf, subSequence, mappedSequence,
}
