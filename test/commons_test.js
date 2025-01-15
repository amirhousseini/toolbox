#!/usr/bin/env node

const { getInteger, isInteger, setProperty, merge, } = require('../lib/commons.js');
const { format } = require('node:util');
const { cpus } = require('node:os');

getIntegerTest(0);
getIntegerTest("1");
getIntegerTest("a");
getIntegerTest(3.14);
getIntegerTest(-20);
getIntegerTest(NaN);
getIntegerTest(Infinity);
getIntegerTest(undefined);
getIntegerTest({});

function getIntegerTest(value) {
    console.log(`isInteger(${value}) -> ${isInteger(value)}`);
    try {
        console.log(`getInteger(${value}) -> ${getInteger(value)}`);
    } catch(e) {
        console.log(`getInteger(${value}) -> ${e}`);
    }
}

getIntegerTestWithValidator(0, n => 10 <= n && n < 20);
getIntegerTestWithValidator(10, n => 10 <= n && n < 20);
getIntegerTestWithValidator(15, n => 10 <= n && n < 20);
getIntegerTestWithValidator(20, n => 10 <= n && n < 20);
getIntegerTestWithValidator(30, n => 10 <= n && n < 20);

function getIntegerTestWithValidator(value, validator) {
    try {
        console.log(`getInteger(${value}, n => 10 <= n && n < 20) -> ${getInteger(value, validator)}`);
    } catch(e) {
        console.log(`getInteger(${value}, n => 10 <= n && n < 20) -> ${e}`);
    }
}

console.log();

function blabla(filename, data, size) {
    [filename, data, size] = handleOptionalArgs(
        arguments,
        ["string", "object", "number"],
        [require.main.filename, {}, cpus().length]);
    console.log(`filename = ${filename}`);
    console.log(`data = ${JSON.stringify(data)}`);
    console.log(`size = ${size}`);
    console.log();
}

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

blabla();
blabla("/home/dev/projects/mnemonic-discovery/bin/discover_btc_mnemonics.js");
blabla({taskId:34});
blabla(4);
blabla({taskId:34}, 6);
blabla(7, {taskId:34});
blabla(undefined, 5);
blabla("/home/dev/projects/mnemonic-discovery/bin/discover_btc_mnemonics.js", 5);

let target = {};
const source1 = { a:1, b:2, c:3,};
//const source2 = { a:4, b:5, c:6,};
const source2 = { a:4, b:null, c:6,};

//console.log(format(Object.assign(target, source1, source2)));
console.log(format(merge(target, source1, source2)));

const f = () => 'd';
target = setProperty(undefined, {x:9, y:0}, f);
console.log(format(target));
console.log(`target[${{x:9, y:0}}] = ${format(target[{x:9, y:0}])}`);

console.log(format(merge(null, null)));