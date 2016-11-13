// sinx = x− x^3 / 3! + x^5 / 5! − x^7 / 7! + ...
const argv = require("argv");

var n = argv.run().targets[0];
var loop = argv.run().targets[1];
if (!loop) {
    loop = 15;
}

// tool
const tool = require("./lib/tool");
const factorial = tool.factorial;
const power = tool.power;

n = n % (2 * Math.PI);
var answer = n;
for (let i = 1; i <= loop; i++) {
    let sign = (i % 2 == 0) ? 1 : -1;
    let odd = (2 * i + 1);
    answer += (power(n, odd) / factorial(odd)) * sign;
}

console.log(answer);
