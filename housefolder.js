// H = I -2 * u * u^T
// u = ( x - √ ( x^2 + y^2 + z^2 ) , y, z )^t  && |u| = 1
// A' = diag(1, H) * A * diag(1, H)
// A'' = diag(I2, H) * A' * diag(I2, H)

const Matrix = require("./lib/Matrix");
const DiagMatrix = require("./lib/DiagMatrix");

let a = new Matrix([
    [1],
    [1],
    [1],
    [1]
]);

a.housefolder();
