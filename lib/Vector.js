const l = console.log;
const tool = require("./tool");

class Vector {
    constructor(...elements) {
        if (elements[0] instanceof Array) elements = elements[0];
        Object.assign(this, {
            elements
        });
    }

    innerProduct(vector) {
        let e = this.elements;
        let ve = vector.elements;
        let answer = 0;
        for (let key in e) {
            answer += e[key] * ve[key];
        }
        return answer;
    }

    differ(vector) {
        let e = this.elements;
        let ve = vector.elements;
        let answer = [];
        for (let key in e) {
            answer.push(e[key] - ve[key]);
        }
        return new Vector(...answer);
    }

    multiply(i) {
        let e = this.elements;
        for (let key in e) {
            e[key] = e[key] * i;
        }
        return this;
    }

    size() {
        return this.elements.length;
    }

    getNorm() {
        let _len = 0;
        for (let val of this.elements) {
            _len += val * val;
        }
        return Math.sqrt(_len);
    }

    normalize() {
        return this.multiply(1 / this.getNorm());
    }
}

module.exports = Vector;
