const l = console.log;

const Matrix = require("./lib/Matrix");
const Vector = require("./lib/Vector");

// QR
let a = new Matrix([
    [4, 1, -2, 2],
    [1, 2, 0, 1],
    [-2, 0, 3, -2],
    [2, 1, -2, -1]
]);
let [Q, R] = a.getQR();
// l(Q);
// l(R);
// l(Q.product(R));
// l(a.getHessenberg());

// linear equation
let b = new Matrix([
    [1, 1, 1],
    [3, 2, -2],
    [2, -1, 3]
]);
// l(b.linearEquation(new Vector(6, 1, 9)));


// get inverse
let c = new Matrix([
    [1, 1, -1],
    [-2, 0, 1],
    [0, 2, 1]
]);
// l(c.getInverse());

// transform similarity
let d = new Matrix([
    [5, 4],
    [1, 2]
]);

let p = new Matrix([
    [4, 1],
    [1, -1]
]);

// l(d.transformSimilarity(p));

// Determinant
let e = new Matrix([
    [1, -2, 3, 2],
    [-2, 2, 0, 2],
    [2, 4, -1, -2],
    [3, 5, -7, -6]
]);
// l(e.getDeterminant());

// EigenValue
let f = new Matrix([
    [2, 0, 0],
    [0, 3, 4],
    [0, 4, 9]
]);

l(f.getEigenValue());

let g = new Matrix([
    [2, 0, 0, 0],
    [1, 2, 0, 0],
    [0, 1, 3, 0],
    [0, 0, 1, 3]
]);

// l(g.getEigenValue());

let h = new Matrix([
    [2, 1],
    [-0.5, -1.5]
]);

// l(h.getEigenValue());
