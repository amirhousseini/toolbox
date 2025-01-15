#!/usr/bin/env node

const { mappedSequence, sequenceOf, subSequence, enumeration } = require('../lib/generator_utils.js');

console.log("-------------------------------------------------------------------------------");

console.log(Array.from(mappedSequence(sequenceOf(111, 222, 333, 444, 555), e => e * 2)));

console.log("-------------------------------------------------------------------------------");

let g = mappedSequence(sequenceOf(111, 222, 333, 444, 555), e => e * 2);
n = 0;
for (let item of g) {
    console.log("%d\t", n++, item);
}
console.log(`Total of ${n} items.`);

console.log("-------------------------------------------------------------------------------");

console.log(Array.from(sequenceOf("AAA", ["BBB", "CCC"], undefined, "DDD", (n) => 5*n, 111, 222, 333, 444, 555)));

console.log("-------------------------------------------------------------------------------");

g = sequenceOf("AAA", ["BBB", "CCC"], undefined, "DDD", (n) => 5*n, 111, 222, 333, 444, 555);
n = 0
for (let item of g) {
    if (typeof item === "function") {
        console.log("%d\t", n++, (item)(2));
    } else {
        console.log("%d\t", n++, item);
    }
}
console.log(`Total of ${n} items.`);

console.log("-------------------------------------------------------------------------------");

console.log(`enumeration(1, 10): ${[...enumeration(1, 10)]}`);

console.log("-------------------------------------------------------------------------------");

console.log(`enumeration(10, 1): ${[...enumeration(10, 1)]}`);

console.log("-------------------------------------------------------------------------------");

console.log(`enumeration(5): ${[...enumeration(5)]}`);

console.log("-------------------------------------------------------------------------------");

console.log(`enumeration(): ${[...enumeration()]}`);

console.log("-------------------------------------------------------------------------------");

console.log(`enumeration(1, 10): ${[...enumeration(1, 10)]}`);

console.log("-------------------------------------------------------------------------------");

g = mappedSequence(enumeration(1, 10), (taskId) => ({ taskId }));
n = 0;
for (let item of g) {
    console.log("%d\t", n++, item);
}
console.log(`Total of ${n} items.`);

console.log("-------------------------------------------------------------------------------");

let iter = mappedSequence(enumeration(1, 10), (taskId) => ({ taskId }))[Symbol.iterator]();
n = 0;
while (true) {
    const { value, done } = iter.next();
    if (done) break;
    console.log("%d\t", n++, value);
}
console.log(`Total of ${n} items.`);

console.log("-------------------------------------------------------------------------------");

// Generator
g = enumeration(1, 5);
console.log(typeof g[Symbol.iterator]);      // 'function'
console.log(typeof g.next);                  // 'function'
console.log(g[Symbol.iterator]() === g);     // true
console.log(Array.from(enumeration(1, 5))); // [1, 2, 3, 4, 5]
console.log([...enumeration(1, 5)]);        // [1, 2, 3, 4, 5]

console.log("-------------------------------------------------------------------------------");

// Iterable
g = mappedSequence(enumeration(1, 5), (taskId) => ({ taskId }));
console.log(typeof g[Symbol.iterator]);      // 'function'
console.log(typeof g.next);                  // 'function'
console.log(g[Symbol.iterator]() === g);     // true
console.log(Array.from(mappedSequence(enumeration(1, 5), (taskId) => ({ taskId }))));
console.log([...mappedSequence(enumeration(1, 5), (taskId) => ({ taskId }))]);

console.log("-------------------------------------------------------------------------------");

function printGeneratorValues(iterable) {
    const iter = iterable[Symbol.iterator]();
    n = 0;
    while (true) {
        const { value, done } = iter.next();
        if (done) break;
        console.log("%d\t", n++, value);
    }
    console.log(`Total of ${n} items.`);
}

printGeneratorValues(mappedSequence(enumeration(1, 10), (taskId) => ({ taskId })));

console.log("-------------------------------------------------------------------------------");

console.log(`subSequence(enumeration(1, 100), 20, 10): ${[...subSequence(enumeration(1, 100), 20, 10)]}`);

console.log("-------------------------------------------------------------------------------");
