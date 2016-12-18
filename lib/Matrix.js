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

    /**
     * 型判定
     */
    static isMatrix(_mat) {
        return _mat instanceof Matrix;
    }

    /**
     * 連想配列を生成する。
     */
    static createAssociativeArray(rowSize, columnSize = rowSize, number = 0) {
        let answer = [];
        for (let r = 0; r < rowSize; r++) {
            let row = [];
            for (let c = 0; c < columnSize; c++) {
                row.push(number);
            }
            answer.push(row);
        }
        return answer;
    }

    /**
     * 複製
     */
    clone() {
        return new Matrix(this.matrix);
    }

    /**
     * 加法
     */
    add(b) {
        for (let r in this.matrix) {
            for (let c in this.matrix[r]) {
                this.matrix[r][c] += b.matrix[r][c];
            }
        }
        return this;
    }

    /**
     * 減法
     */
    diff(b) {
        let _b = b.clone();
        return this.add(_b.multiply(-1));
    }

    /**
     * 乗法
     */
    multiply(i) {
        for (let r in this.matrix) {
            for (let c in this.matrix[r]) {
                this.matrix[r][c] *= i;
            }
        }
        return this;
    }

    /**
     * 他の行列との積を求める。
     */
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

    /**
     * ベクトルとの積を求める。
     */
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

    /**
     * 掃き出し法により1次方程式を解く。
     *
     * [方程式]
     * x + 3y = 11
     * -2x + y = -1
     *
     * [解答]
     * 1, 3  : 11
     * -2, 1 : -1
     * 
     * 行列に基本変形を施し、対角成分を1に、それ以外を0にする。
     * (1) 1行目を2倍にしてから2行目に足す。
     * -> 2行目1列目を0
     * 
     * (2) 2行目を7で割る。
     * -> 2行目2列目を1に変換。
     *
     * (3) 変形した2行目を-3倍にしてから、1行目に足し直す。
     * -> 1行目の2列目を0にする。
     *
     * 1, 0 : 2
     * 0, 1 : 3
     *  
     */
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

    /**
     * 列の要素を取得する。
     */
    getColumn(i) {
        let column = [];
        for (let r = 0; r < this.rowSize; r++) {
            column.push(this.matrix[r][i]);
        }
        return column;
    }

    /**
     * 相似変換を実施する。
     * A' = P^-1 * A * P
     */
    transformSimilarity(mat) {
        let _mat = mat.getInverse();
        let sim = _mat.product(this).product(mat);
        this.matrix = sim.matrix;
        return this;
    }

    /**
     * LU分解をした上で、逆行列を求める。
     *
     * 求める逆行列をXとする。
     * A * X = I
     *
     * Xをベクトルに分解して考える。
     * -> A * x1 = e1 : (1, 0, 0....)
     * -> A * x2 = e2 : (0, 1, 0....)
     * .....
     * 
     * A * x1 = e1 .... の1次方程式を繰り返し解く。
     * -> x1 ~ xn のベクトルをつなぎ合わせた行列が解答の逆行列。
     * 
     * 1次方程式は、Aを予めLU分解した上で解く。
     * 
     */
    getInverse(P, L, U) {
        // decompose to LU
        if (P == null) {
            [P, L, U] = this.getLU();
        }

        // P
        let x = [];
        for (let r = 0; r < this.rowSize; r++) {
            let e = [];
            for (let i = 0; i < this.rowSize; i++) {
                e.push(i == r ? 1 : 0);
            }
            let E = new Vector(e);
            x.push(this.linearEquation(E, P, L, U));
        }

        // transpose
        let answer = Matrix.createAssociativeArray(this.rowSize);
        for (let i = 0; i < this.rowSize; i++) {
            let x_row = x[i];
            for (let k in x_row) {
                answer[k][i] = x_row[k];
            }
        }
        return new Matrix(answer);
    }

    /**
     * LU分解をした上で、行列式を求める。
     *
     * Lの行列式(下三角) = 対角成分の積 = 1
     * Uの行列式(上三角) = 対角成分の積
     * 
     * よって、行列Uがわかれば簡単に計算できる。
     * 注意: 行列の積の行列式 = それぞれの行列式の積
     *
     */
    getDeterminant(U = this.getLU()[2]) {
        let answer = 1;
        for (let k in U.matrix) {
            answer *= U.matrix[k][k]
        }
        return answer;
    }

    /**
     * LU分解する。
     * 「ドゥーリトル法 : Lの対角成分の全てを1とする」を採用
     * 
     * 変換途中で0除算が生じた場合は、行置換を行うことで処理を続行する。
     * 行置換用行列をPとし、それも返却する。(正確にはLUP分解)
     *
     */
    getLU() {
        let mat = this.matrix; // m * n

        // s : Lの列数、Uの行数
        let s = (this.rowSize < this.columnSize ? this.rowSize : this.columnSize);

        // 行置換用行列
        let _p = [];
        for (let i = 0; i < this.rowSize; i++) {
            _p.push(1);
        }
        let P = Matrix.createDiagonal(..._p);

        // L = m * s
        // 対角成分には1を設定
        let L = Matrix.createAssociativeArray(this.rowSize, s);
        for (let key in L) {
            L[key][key] = 1;
        }

        // U = s * n
        let U = Matrix.createAssociativeArray(s, this.columnSize);
        U[0] = mat[0]; // Uの1行目はそのまま。

        /*
         * [1周目] Uの2行目を求めてから、Lの1列目を求める。
         * [2周目] Uの3列目を求めてから、Lの2列目を求める。
         * ......
         */
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

                        // retry
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

    /**
     * LU分解を利用して、1次方程式を解く。
     * 
     * 方程式 : xを求める。
     * Ax = y <-> LUx = y 
     *
     * 解法 : 下記の通り、二段階にわけてxを求める。   
     * (1) Lz = y となるzを求める。
     * (2) Ux = z となるxを求める。
     *
     * LとUは、それぞれ下三角、上三角行列なので、掃き出し法を実施するまでもなく、
     * 簡単に(1)(2)の方程式の解を求めることができる。
     *
     */
    linearEquation(vector, P, L, U) {
        // Ax = y
        let y = vector.elements;

        // decompose to LU
        if (P == null) {
            [P, L, U] = this.getLU();
        }

        // Lz = y
        let z = [];
        for (let r = 0; r < L.rowSize; r++) {
            let v = 0;
            for (let s = 0; s < r; s++) {
                v += L.matrix[r][s] * z[s];
            }
            z.push(y[r] - v);
        }

        // Ux = z
        let x = new Array(U.rowSize);
        for (let r = (U.rowSize - 1); r >= 0; r--) {
            let v = 0;
            for (let s = r + 1; s < U.columnSize; s++) {
                v += U.matrix[r][s] * x[s];
            }
            x[r] = (z[r] - v) / U.matrix[r][r];
        }
        return P.productVector(x);
    }

    /**
     * QR分解の反復法により固有値を求める。
     */
    getEigenValue() {
        // A = Q * R
        // A1 = R * Q
        // A1 = Q2 * R2
        // A2 = R2 * Q2
        // A3 = ...   <- これがいつの間にか上三角行列に近づく!

        // A1 = R * Q : Aの相似変換であることに注意
        // A1 = R * Q = Q^-1 * (Q * R) * Q = Q^-1 * A * Q

    }

    /**
     * QR分解
     * Hessenbergに変換させた行列に回転行列をかけ合せる
     * 回転行列は対角要素の直下が0になるように角度を調整する。
     *
     */
    getQR() {
        // to Hessenberg
        let R = this.getHessenberg();
        let size = this.rowSize;
        let mirros = [];

        // to Upper Triangle Matrix
        for (let c = 0; c < size - 1; c++) {

            let mat = R.matrix;

            // x : 回転行列の角度
            // one * sin(x) = two * cos(x)
            // one^2 * sin^2(x) = two^2 * (1 - sin^2(x))
            // sin(x) = √ { two^2 / (one^2 + two^2) }
            let one = mat[c][c];
            let two = mat[c + 1][c];
            let x = Math.asin(Math.sqrt(two * two / (one * one + two * two)));

            // 回転行列の生成(ただしtranspose)
            // [cos, -sin]
            // [ sin, cos]
            let cos = Math.cos(x);
            let sin = Math.sin(x);
            let r_mat = [];
            let r = new Matrix([
                [cos, sin],
                [-1 * sin, cos]
            ]);

            // 行列Q作成ようの回転行列の逆行列を用意しておく。
            // 回転行列は正規直交基底なので、わざわざ関数を呼んで計算する必要はない。
            // 補足 : 正規直交基底の行列は、transposeしただけで逆行列になる。    
            // 正規直交基底とはすべての縦ベクトルが直角に交わり（内積=0)かつ、長さが1の基底ベクトルで出来た行列。
            // イメージとしては、座標軸に近い。
            let r_mirror_mat = [];
            let r_mirror = new Matrix([
                [cos, -1 * sin],
                [sin, cos]
            ]);

            for (let i = 0; i < size; i++) {
                if (i == c) {
                    r_mat.push(r);
                    r_mirror_mat.push(r_mirror);
                    i++;
                } else {
                    r_mat.push(1);
                    r_mirror_mat.push(1);
                }
            }
            // 回転 
            let q = Matrix.createDiagonal(...r_mat);
            R.matrix = q.product(R).matrix;

            // 回転行列の逆行列を保存
            mirros.push(Matrix.createDiagonal(...r_mirror_mat));
        }
        let Q = mirros[0];
        for (let i = 1; i < mirros.length; i++) {
            Q.matrix = Q.product(mirros[i]).matrix;
        }
        return [Q, R];
    }

    /**
     * householder法によりHessenberg行列に相似変換した行列を取得。
     */
    getHessenberg() {

        let hessenberg = this.clone();

        // H = I -2 * u * u^T
        // u = ( x - √ ( x^2 + y^2 + z^2 ) , y, z )^t  && |u| = 1
        // A' = diag(1, H) * A * diag(1, H)
        // A'' = diag(1, 1, H) * A' * diag(1, 1, H)
        // ....
        for (let c = 0; c < hessenberg.columnSize - 2; c++) {
            // householder変換の対象となるベクトルを抽出。
            // 例えば第一列目の縦ベクトルが (4, 1, -2, 2)の場合、(1, -2, 2)が対象となる。
            // 変換後 => (3, 0, 0)
            let column = hessenberg.getColumn(c);
            column.splice(0, c + 1);
            let vector = new Vector(...column);

            // 超平面の法線ベクトルuを生成する（ただし長さ = 1)
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
            for (let v of u.elements) {
                arr_a.push([v]);
                arr_t.push(v);
            }

            // H = Householder行列
            let H = Matrix.createI(u.elements.length).diff(new Matrix(arr_a).product(new Matrix([arr_t])).multiply(2));

            // 対角行列生成（ただしHをブロックとして含む）
            let d = [];
            for (let i = 0; i < c + 1; i++) {
                d.push(1);
            }
            let diag = Matrix.createDiagonal(...d, H);

            // 相似変換
            // H:householder行列の逆行列 = Hそのもの
            // => そのHを含む対角型ブロック行列も逆行列はそのまま一致する（対角要素全部1にしてあるので）
            hessenberg.matrix = diag.product(hessenberg).product(diag).matrix;
        }
        return hessenberg;
    }

    /**
     * 対角行列を生成。
     * 引数にMatrix型を含めた場合、ブロック対角な行列を生成する。
     */
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

    /**
     * 単位行列生成
     */
    static createI(size) {
        let a = [];
        for (let i = 0; i < size; i++) {
            a.push(1);
        }
        return Matrix.createDiagonal(...a);
    }
}

module.exports = Matrix;
