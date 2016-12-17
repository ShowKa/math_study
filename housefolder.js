// H = I -2 * u * u^T
// u = ( x - √ ( x^2 + y^2 + z^2 ) , y, z )^t  && |u| = 1
// A' = diag(1, H) * A * diag(1, H)
// A'' = diag(I2, H) * A' * diag(I2, H)
const l = console.log;

const Matrix = require("./lib/Matrix");
const Vector = require("./lib/Vector");

let a = new Matrix([
    [4, 2, 3, 4],
    [1, 2, 3, 4],
    [-2, 2, 3, 4],
    [2, 2, 3, 4]
]);
a.housefolder();

// linear equation
let b = new Matrix([
    [1, 1, 1],
    [3, 2, -2],
    [2, -1, 3]
]);
l(b.linearEquation(new Vector(6, 1, 9)));


// get inverse
let c = new Matrix([
    [1, 1, -1],
    [-2, 0, 1],
    [0, 2, 1]
]);
l(c.getInverse());

// transform similarity
let d = new Matrix([
    [5, 4],
    [1, 2]
]);

let p = new Matrix([
    [4, 1],
    [1, -1]
]);

l(d.transformSimilarity(p));
