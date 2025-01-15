#!/usr/bin/env node

const { factorial, sum, mult } = require('../lib/math_ext.js');

factorialTest(0);
factorialTest(5);
factorialTest(-1);
factorialTest("a");
for (let n = 0; n < 180; n++) {
    factorialTest(n)
}

function factorialTest(n) {
    try {
        console.log(`factorial(${n}) -> ${factorial(n)}`);
    } catch (e) {
        console.log(`factorial(${n}) -> ${e}`);
    }
}

console.log("sum()              ->", sum());
console.log("sum([])            ->", sum([]));
console.log("sum(1)             ->", sum(1));
console.log("sum([1, 2, 3, 4])  ->", sum([1, 2, 3, 4]));

console.log("mult()             ->", mult());
console.log("mult([])           ->", mult([]));
console.log("mult(1)            ->", mult(1));
console.log("mult([1, 2, 3, 4]) ->", mult([1, 2, 3, 4]));
