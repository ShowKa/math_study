const Vector = require("./Vector");
const tool = require("./tool");
const l = console.log;

class Matrix {
    constructor(matrix) {
        Object.assign(this, {
            matrix
        });
        this.rowSize = matrix.length;
        this.columnSize = matrix[0].length;
    }

    static isMatrix(_mat) {
        return _mat instanceof Matrix;
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
            answer.push(tool.floatFormat(v));
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

    getColumn(i) {
        let answer = [];
        for (var r = 0; r < this.rowSize; r++) {
            answer.push(this.matrix[r][i]);
        }
        return answer;
    }

    // H = I -2 * u * u^T
    // u = ( x - √ ( x^2 + y^2 + z^2 ) , y, z )^t  && |u| = 1
    // A' = diag(1, H) * A * diag(1, H)
    // A'' = diag(I2, H) * A' * diag(I2, H)
    housefolder() {
        for (let c = 0; c < this.columnSize; c++) {
            // 1列目
            let column = this.getColumn(c);
            // 上(1つめ)の値を退避
            let spliced = column.splice(0, c + 1);
            let vector = new Vector(column);
            let _u = [];
            _u.push(vector.elements[0] - vector.getNorm());
            for (let key in vector.elements) {
                if (key == 0) {
                    continue;
                }
                _u.push(vector.elements[key]);
            }
            let u = new Vector(_u);
            u.normalize();
        }
    }
}

module.exports = Matrix;
