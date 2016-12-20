let Matrix = require("../lib/Matrix.js");
let assert = require("assert");

it('Eigen Value 2D', function() {
    let mat = new Matrix([
        [8, 1],
        [4, 5]
    ])
    let answer = mat.getEigenValue2D();
    assert.equal(4, answer[0]);
    assert.equal(9, answer[1]);
});
