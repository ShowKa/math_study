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

    multiply(i) {
        for (let r in this.matrix) {
            for (let c in this.matrix[r]) {
                this.matrix[r][c] *= i;
            }
        }
        return this;
    }

    product(b) {
        if (this.columnSize !== b.rowSize) {
            throw new Error("Illeagal Arguments");
        }
        let rows = this.rowSize;
        let cols = b.columnSize;
        let answer = [];
        for (let r = 0; r < rows; r++) {
            let newRow = [];
            let aRow = this.matrix[r];
            for (let c = 0; c < cols; c++) {
                let v = 0;
                let bCol = b.getColumn(c);
                for (let k in aRow) {
                    v += aRow[k] * bCol[k];
                }
                newRow.push(v);
            }
            answer.push(newRow);
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

            let arr_a = [];
            let arr_t = [];
            let arr_i = [];
            for (let v of u.elements) {
                arr_a.push([v]);
                arr_t.push(v);
                arr_i.push(1);
            }
            let a = new Matrix(arr_a).product(new Matrix([arr_t])).multiply(2);
        }
    }
}

module.exports = Matrix;
