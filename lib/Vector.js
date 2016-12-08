class Vector {
    constructor(...elements) {
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
        let answer = [];
        for (let key in e) {
            answer.push(e[key] * i);
        }
        return new Vector(...answer);
    }

    size() {
        return this.elements.length;
    }
}

module.exports = Vector;
