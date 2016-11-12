// (e^x)' = e^x
// (e^x)' = lim(h->0) { e^(x+h) - e^x } / h
// = lim(h->0) {  ( e^h - 1 ) * e^x / h }
// = e^x * lim(h->0) {  ( e^h - 1 ) / h }
// lim(h->0) { ( e^h - 1 ) / h } = 1

// f(x) = e^x
// f'(x) = e^x

// f(x) = f(0) + f'(0) * x / 1!  + f''(0) * x^2 / 2! + f'''(0) * x^3 / 3! + ....
// e = f(0) = 1 + 1 / 1! + 1 / 2! + 1 / 3! + ....
const argv = require("argv");
const n = argv.run().targets[0];

// tool
var tool = require("./lib/tool");
const factorial = tool.factorial;

var e = 0;
e += 1;

for (var i = 1; i < n; i++) {
    e += (1 / factorial(i));
}

console.log(e);
