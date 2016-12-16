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

let [p1, low1, up1] = b.getLU();
l(low1);
l(up1);

let c = new Matrix([
    [8, 16, 24, 32],
    [2, 7, 12, 17],
    [6, 17, 32, 59],
    [7, 22, 46, 105]
]);

let [p2, low2, up2] = c.getLU();
l(low2);
l(up2);

let d = new Matrix([
    [8, 0, 24, 32],
    [2, 0, 12, 17],
    [6, 17, 32, 59],
    [7, 22, 46, 105]
]);

let [p3, low3, up3] = d.getLU();
l(p3);
l(low3);
l(up3);
l(p3.product(low3).product(up3));
