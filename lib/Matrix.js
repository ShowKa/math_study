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

    add(b) {
        for (let r in this.matrix) {
            for (let c in this.matrix[r]) {
                this.matrix[r][c] += b.matrix[r][c];
            }
        }
        return this;
    }

    diff(b) {
        let _b = new Matrix(b.matrix);
        return this.add(_b.multiply(-1));
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
                newRow.push(tool.floatFormat(v));
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
            let H = new DiagMatrix(...arr_i).diff(new Matrix(arr_a).product(new Matrix([arr_t])).multiply(2));
            let A = new DiagMatrix(1, H).product(this).product(new DiagMatrix(1, H));
            if (c == 0) l(A);
        }
    }
}

class DiagMatrix extends Matrix {
    constructor(...elements) {
        let matrix = [];
        let c = 0;
        for (let i = 0; i < elements.length; i++) {
            if (Matrix.isMatrix(elements[i])) {
                c += elements[i].rowSize;
            } else {
                c += 1;
            }
        }

        let added = 0;
        let addedMat = 0;
        for (let i = 0; i < elements.length; i++) {
            let e = elements[i];
            if (!Matrix.isMatrix(e)) {
                let row = [];
                for (let j = 0; j < c; j++) {
                    row.push(0);
                }
                row[added] = e;
                matrix.push(row);
                added++;
            } else {
                let m_size = e.matrix[0].length;
                b: for (let k = 0; k < m_size; k++) {
                    let m_row = e.matrix[k];
                    let row = [];
                    for (let j = 0; j < c; j++) {
                        if (j < i + addedMat * (m_size - 1)) {
                            row.push(0);
                        } else {
                            for (let m of m_row) {
                                row.push(m);
                            }
                            while (row.length < c) {
                                row.push(0);
                            }
                            matrix.push(row);
                            added++;
                            continue b;
                        }
                    }
                }
                addedMat++;
            }
        }
        super(matrix);
    }
}
module.exports = Matrix;
