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
        const precise = 10;
        let _pow = Math.pow(10, precise);
        return Math.round(number * _pow) / _pow;
    }
};
