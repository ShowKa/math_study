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
        let column = [];
        for (let r = 0; r < this.rowSize; r++) {
            column.push(this.matrix[r][i]);
        }
        return column;
    }

    similarity(mat) {
        let _mat = mat.getInverse();
        let sim = mat.product(this).product(_mat);
        this.matrix = sim.matrix;
        return this;
    }

    getInverse() {
        // LU分解
        // A^-1 = U^-1 * L^-1
    }

    getLU() {
        let mat = this.matrix; // m * n
        let s = (this.rowSize < this.columnSize ? this.rowSize : this.columnSize);

        // 行置換用行列
        let _p = [];
        for (let i = 0; i < this.rowSize; i++) {
            _p.push(1);
        }
        let P = Matrix.createDiagonal(..._p);

        let L = []; // m * s
        for (let i = 0; i < this.rowSize; i++) {
            let c = [];
            for (let j = 0; j < s; j++) {
                // 対角成分には1、それ以外は0
                c.push(i == j ? 1 : 0);
            }
            L.push(c);
        }

        let U = []; // s * n
        U.push(mat[0]); // Uの1行目はそのまま。
        for (let i = 1; i < s; i++) {
            let c = [];
            for (let j = 0; j < this.columnSize; j++) {
                c.push(0);
            }
            U.push(c);
        }

        for (let k = 0; k < s; k++) {
            // U
            a: for (let j = k; j < this.columnSize; j++) {
                let v = 0;
                for (let n = 0; n < k; n++) {
                    v += L[k][n] * U[n][j];
                }
                // if U[k][k] == 0
                // => 行入れ替え（Lとthis両方）
                if (j == k && mat[k][j] == v) {
                    for (let p = k + 1; p < U.length; p++) {
                        if (mat[k][j] == mat[p][j]) {
                            continue;
                        }
                        // 行入れ替え
                        [mat[k], mat[p]] = [mat[p], mat[k]];
                        [L[k], L[p]] = [L[p], L[k]];

                        // 対角を調整
                        [L[k][k], L[k][p], L[p][p], L[p][k]] = [L[k][p], L[k][k], L[p][k], L[p][p]];

                        // 行置換用行列の調整
                        let _P = P.matrix;
                        [_P[k][k], _P[k][p], _P[p][p], _P[p][k]] = [_P[k][p], _P[k][k], _P[p][k], _P[p][p]];

                        j -= 1;
                        continue a;
                    }
                    // 入れ替え不可
                    throw new Error();
                }

                U[k][j] = mat[k][j] - v;
            };

            // L
            let x = 1 / U[k][k];
            for (let i = k + 1; i < this.rowSize; i++) {
                let v = 0;
                for (let n = 0; n < k; n++) {
                    v += L[i][n] * U[n][k];
                }
                L[i][k] = (mat[i][k] - v) * x;
            }
        }

        return [P, new Matrix(L), new Matrix(U)];
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
            let vector = new Vector(...column);
            let _u = [];
            _u.push(vector.elements[0] - vector.getNorm());
            for (let key in vector.elements) {
                if (key == 0) {
                    continue;
                }
                _u.push(vector.elements[key]);
            }
            let u = new Vector(..._u);
            u.normalize();

            let arr_a = [];
            let arr_t = [];
            let arr_i = [];
            for (let v of u.elements) {
                arr_a.push([v]);
                arr_t.push(v);
                arr_i.push(1);
            }
            let H = Matrix.createDiagonal(...arr_i).diff(new Matrix(arr_a).product(new Matrix([arr_t])).multiply(2));
            let A = Matrix.createDiagonal(...[1], H).product(this).product(Matrix.createDiagonal(...[1], H));
            // if (c == 0) l(A);
        }
    }

    static createDiagonal(...elements) {
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
        return new Matrix(matrix);
    }
}

module.exports = Matrix;
