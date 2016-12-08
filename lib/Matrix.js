const Vector = require("./Vector");

class Matrix {
    constructor(matrix) {
        Object.assign(this, {
            matrix
        });
        this.rowSize = matrix.length;
        this.columnSize = matrix[0].length;
    }

    times(b) {
        if (this.columnSize !== b.rowSize) {
            throw new Error("Illeagal Arguments");
        }
        let rows = this.rowSize;
        let cols = this.columnSize;
        let answer = [];
        for (var i = 0; i < rows; i++) {
            let newrow = [];
            for (var j = 0; j < cols; j++) {
                let newValue = 0;
                for (var k = 0; k < cols; k++) {
                    let v1 = this.matrix[i][k];
                    let v2 = b.matrix[k][j];
                    newValue += v1 * v2;
                }
                newrow.push(newValue);
            }
            answer.push(newrow);
        }
        return new Matrix(answer);
    }

    productVector(vector) {

        let _v;
        if (Array.isArray(vector)) {
            _v = vector;
        } else {
            _v = vector.elements;
        }

        let mat = this.matrix;
        let answer = [];
        for (let r in mat) {
            let row = mat[r];
            let v = 0;
            for (let c in row) {
                v += row[c] * _v[c];
            }
            answer.push(floatFormat(v));
        }
        return answer;
    }

    sweepOut() {
        let mat = this.matrix;
        let answer = [];
        for (let r in mat) {
            let row = mat[r];

            let diviser = row[r];
            for (let c in row) {
                let column = row[c];
                row[c] = column / diviser;
            }

            for (let ar in mat) {
                if (ar === r) continue;
                let anotherRow = mat[ar];
                let multiplier = anotherRow[r];
                if (multiplier === 0) continue;
                for (let ac in anotherRow) {
                    let anotherColumn = anotherRow[ac];
                    anotherRow[ac] = anotherColumn - row[ac] * multiplier;
                }
            }
        }
        return this;
    }
}

function floatFormat(number) {
    const precise = 10;
    let _pow = Math.pow(10, precise);
    return Math.round(number * _pow) / _pow;
}

module.exports = Matrix;
