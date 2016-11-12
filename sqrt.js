const argv = require("argv");
var target = argv.run().targets[0];

var flag = false;
if (target < 100) {
    target *= 100;
    flag = true;
}

var _num = target / 10;
var bigger = target;
var smaller = 0;

for (var i = 0; i < 100; i++) {
    var appro = _num * _num;
    if (target == appro) {
        break;
    } else if (target < appro) {
        bigger = _num;
        _num = (smaller + _num) / 2;
        continue;
    } else if (appro < target) {
        smaller = _num;
        _num = (bigger + _num) / 2;
        continue;
    }
}

if (flag) {
    _num = _num / 10;
}
console.log(_num);
