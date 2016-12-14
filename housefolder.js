// H = I -2 * u * u^T
// u = ( x - √ ( x^2 + y^2 + z^2 ) , y, z )^t  && |u| = 1
// A' = diag(1, H) * A * diag(1, H)
// A'' = diag(I2, H) * A' * diag(I2, H)
const l = console.log;

const Matrix = require("./lib/Matrix");

let a = new Matrix([
    [4, 2, 3, 4],
    [1, 2, 3, 4],
    [-2, 2, 3, 4],
    [2, 2, 3, 4]
]);

a.housefolder();

let b = new Matrix([
    [2, 6, 4],
    [5, 7, 9]
]);

// let [low, up] = b.getLU();
// l(low);
// l(up);

let c = new Matrix([
    [8, 16, 24, 32],
    [2, 7, 12, 17],
    [6, 17, 32, 59],
    [7, 22, 46, 105]
]);

let [low2, up2] = c.getLU();
l(low2);
l(up2);
