var dm = {};
(ns => {
"use strict";
ns.Test = function (fname) {
var pass, fail, posName;
var msg;
pass = 0;
fail = 0;
posName = "";
this.mark = pname => { posName = pname; }
this.log = () => {
console.log(`Test [${fname}] summary:\n` +
`  Total : ${pass + fail}\n  Passed: ${pass}\n  Failed: ${fail}`);
}
msg = (expected, actual) => {
console.log(`Test fail in [${fname}${posName?':':''}${posName}]\n` +
`  Expected: ${expected}\n  Actual  : ${actual}`);
}
this.yes = value => {
if (!value) {
++fail;
msg("true", "false");
} else {
++pass;
}
}
this.eq = (expected, actual) => {
if (expected !== actual) {
++fail;
msg(expected, actual);
} else {
++pass;
}
}
this.not = value => {
if (value) {
++fail;
msg("false", "true");
} else {
++pass;
}
}
this.neq = (expected, actual) => {
if (expected === actual) {
++fail;
msg("!= " + expected, actual);
} else {
++pass;
}
}
}
})(dm);
(ns => {
"use strict";
ns.Tp = function (_1, _2) {
this._1 = _1;
this._2 = _2;
}
ns.Tp3 = function (_1, _2, _3) {
this._1 = _1;
this._2 = _2;
this._3 = _3;
}
})(dm);
test = () => {
"use strict";
var Tp, Tp3;
var test;
var tp, tp3;
Tp = dm.Tp;
Tp3 = dm.Tp3;
test = new dm.Test("Tuple");
test.mark("Tp");
tp = new Tp(1, "b");
test.eq(1, tp._1);
test.eq("b", tp._2);
test.mark("Tp3");
tp3 = new Tp3(1, "b", 33);
test.eq(1, tp3._1);
test.eq("b", tp3._2);
test.eq(33, tp3._3);
test.log();
}
(ns => {
"use strict";
ns.It = function (hasNext, next) {
this.eq = i => {
if (!i) return false;
while (hasNext() && i.hasNext())
if (next() !== i.next()) return false;
if (hasNext() || i.hasNext()) return false;
return true;
}
this.eqf = (i, f) => {
if (!i) return false;
while (hasNext() && i.hasNext())
if (!f(next(), i.next())) return false;
if (hasNext() || i.hasNext()) return false;
return true;
}
this.hasNext = () => hasNext();
this.next = () => next();
}
ns.It.from = a => {
var i, len;
i = 0;
len = a.length;
return new dm.It(
() => i < len,
() => a[i++]
);
}
ns.It.empty = () => new dm.It (() => false, () => null);
})(dm);
it = () => {
"use strict";
var It;
var t;
var aN1;
var itN1;
It = dm.It;
t = new dm.Test("It");
aN1 = [1, 2, 3];
itN1 = It.from(aN1);
t.eq(1, itN1.next());
t.eq(2, itN1.next());
t.eq(3, itN1.next());
t.not(itN1.hasNext());
t.mark("constructors");
var i0, i1, i2, s0, s1, s2;
i0 = [];
i1 = [1];
i2 = [1, 2, 3];
s0 = [];
s1 = ["one"];
s2 = ["one", "two", "three"];
t.not(It.empty().hasNext());
t.not(It.from([]).hasNext());
t.yes(It.from(i0).eq(It.from(i0)));
t.yes(!It.from(i0).eq(It.from(i1)));
t.yes(It.from(i1).eq(It.from(i1)));
t.yes(!It.from(i1).eq(It.from(i0)));
t.yes(It.from(i2).eq(It.from(i2)));
t.yes(!It.from(i2).eq(It.from(i1)));
t.yes(!It.from(i1).eq(It.from(i2)));
t.yes(It.from(i0).eq(It.from(s0)));
t.yes(It.from(i2).eqf(It.from(i2), (a, b) => a === b));
t.log();
}
it();
