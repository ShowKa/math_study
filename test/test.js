let Matrix = require("../lib/Matrix.js");
let Vector = require("../lib/Vector.js");
let tool = require("../lib/tool.js");
let assert = require("assert");
let l = console.log;

it('Eigen Value 2D', function() {
    let mat = new Matrix([
        [8, 1],
        [4, 5]
    ]);
    let answer = mat.getEigenValue2D();
    assert.equal(4, answer[0]);
    assert.equal(9, answer[1]);
});

it('Eigen Value case 1', function() {
    let mat = new Matrix([
        [0, -1, -1],
        [2, 3, 3],
        [0, 0, 1]
    ]);
    let answer = mat.getEigenValue();
    assert.equal(1, answer[0]);
    assert.equal(1, answer[1]);
    assert.equal(2, answer[2]);
});

it('Eigen Value case 2', function() {
    let mat = new Matrix([
        [-2, -2, -1],
        [6, 5, 2],
        [-2, -1, 1]
    ]);
    let answer = mat.getEigenValue();
    assert.equal(1, tool.floatFormat(answer[0], 4));
    assert.equal(1, tool.floatFormat(answer[1], 4));
    assert.equal(2, tool.floatFormat(answer[2], 4));
});

it('Eigen Value case 3', function() {
    let mat = new Matrix([
        [1, 0.5, 1 / 3, 0.25],
        [0.5, 1, 2 / 3, 0.5],
        [1 / 3, 2 / 3, 1, 0.75],
        [0.25, 0.5, 0.75, 1]
    ]);
    let answer = mat.getEigenValue();
    assert.equal(0.2078, tool.floatFormat(answer[0], 4));
    assert.equal(0.4078, tool.floatFormat(answer[1], 4));
    assert.equal(0.8482, tool.floatFormat(answer[2], 4));
    assert.equal(2.5362, tool.floatFormat(answer[3], 4));
});

it('Eigen Value case 4 : Triangular Matrix', function() {
    let mat = new Matrix([
        [2, 0, 0, 0],
        [1, 2, 0, 0],
        [0, 1, 3, 0],
        [0, 0, 1, 3]
    ]);
    let answer = mat.getEigenValue();
    assert.equal(2, tool.floatFormat(answer[0], 4));
    assert.equal(2, tool.floatFormat(answer[1], 4));
    assert.equal(3, tool.floatFormat(answer[2], 4));
    assert.equal(3, tool.floatFormat(answer[3], 4));
});


it('subtract', function() {
    let mat = new Matrix([
        [8, 1, 4],
        [4, 5, 5],
        [1, 2, 3]
    ])
    let ret = mat.subtract(0, 2, 0, 2);
    assert.equal(8, ret.matrix[0][0]);
    assert.equal(5, ret.matrix[1][1]);
    assert.equal(2, ret.rowSize);
    assert.equal(2, ret.columnSize);
});


it('QR', function() {
    let mat = new Matrix([
        [4, 1, -2, 2],
        [1, 2, 0, 1],
        [-2, 0, 3, -2],
        [2, 1, -2, -1]
    ]);
    let [Q, R] = mat.getQR();
    let A = Q.product(R);
    let B = mat.getHessenberg();
    matrixCheck(A, B);
});

it('linear equation', function() {
    let mat = new Matrix([
        [1, 1, 1],
        [3, 2, -2],
        [2, -1, 3]
    ]);
    let answer = mat.linearEquation(new Vector(6, 1, 9));
    assert.equal(1, answer[0]);
    assert.equal(2, answer[1]);
    assert.equal(3, answer[2]);
});

it('inverse', function() {
    // get inverse
    let mat = new Matrix([
        [1, 1, -1],
        [-2, 0, 1],
        [0, 2, 1]
    ]);
    let inverse = mat.getInverse();
    let expected = new Matrix([
        [-0.5, -0.75, 0.25],
        [0.5, 0.25, 0.25],
        [-1, -0.5, 0.5]
    ]);
    matrixCheck(expected, inverse);
});

it('transform similarity', function() {
    let d = new Matrix([
        [5, 4],
        [1, 2]
    ]);
    let p = new Matrix([
        [4, 1],
        [1, -1]
    ]);
    let A = d.transformSimilarity(p);
    let expected = new Matrix([
        [6, 0],
        [0, 1]
    ]);
    matrixCheck(expected, A);
});

it('Determinant', function() {
    let mat = new Matrix([
        [1, -2, 3, 2],
        [-2, 2, 0, 2],
        [2, 4, -1, -2],
        [3, 5, -7, -6]
    ]);
    let det = mat.getDeterminant();
    assert.equal(-102, det);
});


function matrixCheck(A, B, precise = 4) {
    let a = A.matrix;
    let b = B.matrix;
    for (let r = 0; r < A.rowSize; r++) {
        for (let c = 0; c < A.columnSize; c++) {
            assert.equal(tool.floatFormat(a[r][c], precise), tool.floatFormat(b[r][c], precise));
        }
    }
}
