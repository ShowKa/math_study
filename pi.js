const argv = require("argv");

var param = argv.run().targets[0];
var lengthOfBase = 1 / param;

var areaSum = 0;
var prePoint = 0;

for (var i = 0; i < param; i++) {
    var point = ((i + 1) * (1 / param));
    var x = (prePoint + point) / 2;
    var y = Math.sqrt(1 - x * x);
    var height = y;
    var area = lengthOfBase * height;

    // post
    areaSum += area;
    prePoint = point;
}

var pi = areaSum * 4;
console.log(pi);

// x^2 + y^2 = 1 <- 半径1の円周上の座標

// (1)
// x = 1 / 2
// y^2 = 1 - x^2
// y = √ 1 - x^2
//   = Math.sqrt( 1 - 1/2 * 1/2 )
// area
//  = long * short
//  = 1 * y
//  = pi / 4

// (2) 
// (2).1
// x = 1 / 4 = ( 0 + 1/2 ) / 2
// y = Math.sqrt( 1 - x^2 )
// area1 = long * short
//  = (1/2) * y

// (2).2
// x = 3 / 4 = ( 1/2 + 1 ) / 2
// y = Math.sqrt( 1 - x^2 )
// area2 = (1/2) * y

// area1 + area2 = pi / 4
