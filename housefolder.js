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


let c = new Matrix([
    [1, 2, 3],
    [3, 4, 5],
    [7, 8, 9]
]);
let b = new DiagMatrix(1, 1, c, 1, c, 1, 1, c);
console.log(b);

a.housefolder();
