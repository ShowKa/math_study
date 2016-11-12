// f(x) = 1 / x
// f'(x) = -1 * ( 1 / x^2 )
// f''(x) = 2 * ( 1 / x^3 )
// f'''(x) = -6 * ( 1 / x^4 )

// Taylor series is centered at 1
// f(x) = f(1) + f'(1) * (x-1)^1 / 1!  + f''(1) * (x-1)^2 / 2! + f'''(1) * (x-1)^3 / 3! + ....

// Taylor series is centered at c
// f(x) = f(c) + f'(c) * (x-c)^1 / 1!  + f''(c) * (x-c)^2 / 2! + f'''(c) * (x-c)^3 / 3! + ....

const argv = require("argv");
const center = argv.run().targets[0];
const target = argv.run().targets[1];
var loop = argv.run().targets[2];
if (!loop) {
    loop = 15;
}

// tool
var tool = require("./lib/tool");
const power = tool.power;
const factorial = tool.factorial;

var answer = 1 / center;
var b = 1;

for (var i = 1; i < loop; i++) {
    b *= (-1 * i);
    var f = b * (1 / power(center, i + 1));
    answer += f * power(target - center, i) / factorial(i);
}

console.log(answer);
