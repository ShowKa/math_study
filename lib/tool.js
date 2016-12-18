const precise = 15;
let zero = 1;
for (let i = 1; i < precise; i++) {
    zero /= 10;
}
let _zero = -1 * zero;

module.exports = {
    power: function(target, p) {
        var answer = 1;
        for (var i = 1; i <= p; i++) {
            answer *= target;
        }
        return answer;
    },
    factorial: function(n) {
        var a = 1;
        for (var i = 1; i <= n; i++) {
            a *= i;
        }
        return a;
    },
    floatFormat: function(number) {
        if (!precise) {
            return number;
        }
        let _pow = Math.pow(10, precise);
        let answer = Math.round(number * _pow) / _pow;
        if (answer > _zero && answer < zero) {
            return 0;
        } else {
            return answer;
        }
    }
};
