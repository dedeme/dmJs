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
var self;
self = this;
this.add = (e, i) => {
var c;
c = 0;
if (!i) return new dm.It(
() => c == 0,
() => {
if (hasNext()) return next();
++c;
return e;
});
return new dm.It(
() => hasNext() || c < i,
() => {
if (c <= i) {
if (hasNext() && c < i) {
++c;
return next();
}
c = i + 1;
return e;
}
return next();
});
}
this.add0 = e => {
var isNotAdd;
isNotAdd = true
return new dm.It(
() => hasNext() || isNotAdd,
() => {
if (isNotAdd) {
isNotAdd = false;
return e;
}
return next();
});
}
this.addIt = (it, i) => {
var c;
c = 0;
return new dm.It(
() => hasNext() || it.hasNext(),
() => {
if (!i) {
if (hasNext()) return next();
return it.next();
}
if (c < i) {
if (hasNext()) {
++c;
return next()
}
c = i;
}
if (it.hasNext()) return it.next();
return next();
});
}
this.drop = n => {
var r;
r = self.take(n);
while (r.hasNext())
r.next();
return self;
}
this.dropWhile = f => self.dropUntil(e => !f(e));
this.dropUntil = f => {
var last, nx;
last = null;
nx = true;
while (true)
if (hasNext()) {
last = next();
if (f(last)) break;
} else {
nx = false;
break;
}
return new dm.It(
() => nx,
() => {
var r;
r = last;
if (hasNext()) last = next();
else nx = false;
return r;
});
}
this.each = f => { while (hasNext()) f(next()); }
this.eachIx = f => {
var c;
c = -1;
while (hasNext())
f(next(), ++c);
}
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
this.take = n => new dm.It(
() => hasNext() && n > 0,
() => {
--n;
return next();
});
this.takeWhile = f => {
var last, hnx;
last = null;
hnx = false;
if (hasNext()) {
last = next();
hnx = true;
}
return new dm.It(
() => hnx && f(last),
() => {
var r;
r = last;
last = null;
hnx = false;
if (hasNext()) {
last = next();
hnx = true;
}
return r;
});
}
this.takeUntil = f => self.takeWhile(e => !f(e));
this.to = () => {
var a;
a = [];
self.each(o => a.push(o));
return a;
}
this.toString = () => "[" + dm.It.join(self, ", ") + "]";
}
ns.It.empty = () => new dm.It (() => false, () => null);
ns.It.from = a => {
var i, len;
i = 0;
len = a.length;
return new dm.It(
() => i < len,
() => a[i++]
);
}
ns.It.fromBytes = bs => {
var l, c;
l = bs.length;
c = 0;
return new dm.It (() => c < l, () => bs[c++]);
}
ns.It.fromStr = s => {
var l, c;
l = s.length;
c = 0;
return new dm.It (() => c < l, () => s[c++]);
}
ns.It.join = (i, sep) => {
var r;
if (!sep) sep = "";
if (!i.hasNext()) return "";
r = i.next();
i.each(o => r += sep + o);
return r;
}
ns.It.keys = o => {
var tmp, k;
tmp = [];
for (k in o)
tmp.push(k);
return dm.It.from(tmp)
}
})(dm);
it = () => {
"use strict";
var It;
var t;
var aN1;
var itN1;
var i0, i1, i2, s0, s1, s2;
var ik;
var pr1,npr1;
var even, neven;
It = dm.It;
t = new dm.Test("It");
aN1 = [1, 2, 3];
itN1 = It.from(aN1);
t.eq(1, itN1.next());
t.eq(2, itN1.next());
t.eq(3, itN1.next());
t.not(itN1.hasNext());
t.mark("constructors");
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
t.eq("[]", It.from(i0).toString());
t.eq("[1]", It.from(i1).toString());
t.eq("[1, 2, 3]", It.from(i2).toString());
t.eq("", It.from(i0).to().toString());
t.eq("1", It.from(i1).to().toString());
t.eq("1,2,3", It.from(i2).to().toString());
t.eq("[]", It.fromStr("").toString());
t.eq("[a]", It.fromStr("a").toString());
t.eq("[a, b, c]", It.fromStr("abc").toString());
ik = dm.It.keys({"one" : 1, "two" : 2});
t.eq("one", ik.next().toString());
t.eq("two", ik.next().toString());
t.yes(!ik.hasNext())
t.mark("lazy");
t.eq("[1]", It.from(i0).add(1).toString());
t.eq("[1]", It.from(i0).add0(1).toString());
t.eq("[1, 2, 3, 1]", It.from(i2).add(1).toString());
t.eq("[1, 1, 2, 3]", It.from(i2).add0(1).toString());
t.eq("[1, 1, 2, 3]", It.from(i2).add(1, 1).toString());
t.eq("[1, 2, 3, 1]", It.from(i2).addIt(It.from(i1)).toString());
t.eq("[1, 1, 2, 3]", It.from(i2).addIt(It.from(i1), 1).toString());
t.eq("[1, 2, 3]", It.from(i2).addIt(It.from(i0)).toString());
t.eq("[1, 2, 3]", It.from(i2).addIt(It.from(i0), 1).toString());
t.eq("[]", It.from(i0).addIt(It.from(i0)).toString());
t.eq("[1, 2, 3]", It.from(i0).addIt(It.from(i2), 1).toString());
t.eq("[one, two, three]", It.from(s2).drop(0).toString());
t.eq("[two, three]", It.from(s2).drop(1).toString());
t.eq("[]", It.from(s2).drop(10).toString());
t.eq("[1, 2, 3]", It.from(i2).drop(0).toString());
pr1 = e => e < 2
npr1 = e => e >= 2
t.eq("[]", It.from(s2).take(0).toString());
t.eq("[]", It.from(s2).take(-30).toString());
t.eq("[one]", It.from(s2).take(1).toString());
t.eq("[one, two, three]", It.from(s2).take(10).toString());
t.eq("[1, 2, 3]", It.from(i2).take(1000).toString());
t.eq("[]", It.from(i0).takeWhile(pr1).toString());
t.eq("[1]", It.from(i1).takeWhile(pr1).toString());
t.eq("[1]", It.from(i2).takeWhile(pr1).toString());
t.eq("[]", It.from(i0).takeUntil(npr1).toString());
t.eq("[1]", It.from(i1).takeUntil(npr1).toString());
t.eq("[1]", It.from(i2).takeUntil(npr1).toString());
t.eq("[one, two, three]", It.from(s2).drop(0).toString());
t.eq("[two, three]", It.from(s2).drop(1).toString());
t.eq("[]", It.from(s2).drop(10).toString());
t.eq("[1, 2, 3]", It.from(i2).drop(0).toString());
t.eq("[]", It.from(i0).dropUntil(npr1).toString());
t.eq("[]", It.from(i1).dropWhile(pr1).toString());
t.eq("[2, 3]", It.from(i2).dropWhile(pr1).toString());
t.eq("[]", It.from(i0).dropWhile(pr1).toString());
t.eq("[]", It.from(i1).dropWhile(pr1).toString());
t.eq("[2, 3]", It.from(i2).dropWhile(pr1).toString());
t.log();
}
it();
