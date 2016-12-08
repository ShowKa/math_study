// H = I -2 * u * u^T
// u = ( x - √ ( x^2 + y^2 + z^2 ) , y, z )^t  && |u| = 1
// A' = diag(1, H) * A * diag(1, H)
// A'' = diag(I2, H) * A' * diag(I2, H)

const Matrix = require("./lib/Matrix");

let a = new Matrix([
    [1, 2],
    [3, 4]
]);

let b = new Matrix([
    [5, 6],
    [7, 8]
]);

console.log(a.times(b));
