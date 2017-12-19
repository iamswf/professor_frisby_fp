/**
 * @file monoid
 * @author iamswf@163.com
 */

const Pair = (x, y) => ({
    x,
    y,
    concat: o => Pair(x.concat(o.x), y.concat(o.y)),
    bimap: (f1, f2) => Pair(f1(x), f2(y)),
    toList: () => [x, y]
});

const Sum = x => ({
    x,
    concat: o => Sum(x + o.x)
});

module.exports = {Pair, Sum};
