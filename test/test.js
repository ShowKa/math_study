let Matrix = require("../lib/Matrix.js");
let tool = require("../lib/tool.js");
let assert = require("assert");
let l = console.log;

it('Eigen Value 2D', function() {
    let mat = new Matrix([
        [8, 1],
        [4, 5]
    ])
    let answer = mat.getEigenValue2D();
    assert.equal(4, answer[0]);
    assert.equal(9, answer[1]);
});

it('Eigen Value case 1', function() {
    let mat = new Matrix([
        [0, -1, -1],
        [2, 3, 3],
        [0, 0, 1]
    ])
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
    ])
    let answer = mat.getEigenValue();
    assert.equal(1, answer[0]);
    assert.equal(1, answer[1]);
    assert.equal(2, answer[2]);
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
