//- dm/Test.js
//- dm/It.js
/*
 * Copyright 05-Feb-2017 ºDeme
 * GNU General Public License - V3 <http://www.gnu.org/licenses/>
 */
/*global dm */

function itTest() {
  var It = dm.It;

  var t = new dm.Test("It");

  var aN1 = [1, 2, 3];
  var itN1 = It.from(aN1);
  t.eq(1, itN1.next());
  t.eq(2, itN1.next());
  t.eq(3, itN1.next());
  t.not(itN1.hasNext());

  // constructors ------------------------------------------

  t.mark("constructors");

  var i0 = [];
  var i1 = [1];
  var i2 = [1, 2, 3];
  var s0 = [];
  var s1 = ["one"];
  var s2 = ["one", "two", "three"];

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

  t.yes(It.from(i2).eqf(It.from(i2), function (a, b) { return a === b; }));

  t.eq("[]", It.from(i0).toString());
  t.eq("[1]", It.from(i1).toString());
  t.eq("[1, 2, 3]", It.from(i2).toString());

  t.eq("", It.from(i0).to().toString());
  t.eq("1", It.from(i1).to().toString());
  t.eq("1,2,3", It.from(i2).to().toString());

  t.eq("[]", It.fromStr("").toString());
  t.eq("[a]", It.fromStr("a").toString());
  t.eq("[a, b, c]", It.fromStr("abc").toString());

  var ik = dm.It.keys({"one" : 1, "two" : 2});
  t.eq("one", ik.next().toString());
  t.eq("two", ik.next().toString());
  t.yes(!ik.hasNext());

  // lazy --------------------------------------------------

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

  var pr1 = function (e) { return e < 2; };
  var npr1 = function (e) { return e >= 2; };

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

  var even = function (e) { return e % 2 === 0; };
  var neven = function (e) { return e % 2 !== 0; };

  t.eq("[]", It.from(i0).filter(even).toString());
  t.eq("[]", It.from(i1).filter(even).toString());
  t.eq("[2]", It.from(i2).filter(even).toString());
  t.eq("[]", It.from(i0).filter(neven).toString());
  t.eq("[1]", It.from(i1).filter(neven).toString());
  t.eq("[1, 3]", It.from(i2).filter(neven).toString());

  var mul2 = function (e) { return e * 2; };

  t.eq("[]", It.from(i0).map(mul2).toString());
  t.eq("[2]", It.from(i1).map(mul2).toString());
  t.eq("[2, 4, 6]", It.from(i2).map(mul2).toString());

  // Progresive ----------------------

  t.mark("progresive");

  var ftrue = function () { return true; };
  var feq = function (a) { return function (e) { return a === e; } };

  t.yes(It.from(i0).all(feq(1)));
  t.yes(It.from(i1).all(feq(1)));
  t.yes(!It.from(i2).all(feq(1)));
  t.yes(!It.from(i0).containsf(feq(1)));
  t.yes(It.from(i2).containsf(feq(1)));
  t.yes(!It.from(i2).containsf(feq(9)));
  t.yes(!It.from(i0).contains(1));
  t.yes(It.from(i2).contains(1));
  t.yes(!It.from(i2).contains(9));

  t.eq(0, It.from(s0).count(ftrue));
  t.eq(1, It.from(s1).count(ftrue));
  t.eq(3, It.from(s2).count(ftrue));

  t.eq(0, It.from(i0).find(even).length);
  t.eq(0, It.from(i1).find(even).length);
  t.eq(2, It.from(i2).find(even)[0]);
  t.eq(0, It.from(i0).find(neven).length);
  t.eq(1, It.from(i1).find(neven)[0]);
  t.eq(1, It.from(i2).find(neven)[0]);

  t.eq(-1, It.from(i0).indexf(even));
  t.eq(-1, It.from(i1).indexf(even));
  t.eq(1, It.from(i2).indexf(even));
  t.eq(-1, It.from(i0).indexf(neven));
  t.eq(0, It.from(i1).indexf(neven));
  t.eq(0, It.from(i2).indexf(neven));

  t.eq(-1, It.from(i0).index(3));
  t.eq(-1, It.from(i1).index(3));
  t.eq(0, It.from(i1).index(1));
  t.eq(-1, It.from(i2).index(5));
  t.eq(0, It.from(i2).index(1));
  t.eq(2, It.from(i2).index(3));

  t.eq(-1, It.from(i0).lastIndexf(even));
  t.eq(-1, It.from(i1).lastIndexf(even));
  t.eq(1, It.from(i2).lastIndexf(even));
  t.eq(-1, It.from(i0).lastIndexf(neven));
  t.eq(0, It.from(i1).lastIndexf(neven));
  t.eq(2, It.from(i2).lastIndexf(neven));

  t.eq(-1, It.from(i0).lastIndex(3));
  t.eq(-1, It.from(i1).lastIndex(3));
  t.eq(0, It.from(i1).lastIndex(1));
  t.eq(-1, It.from(i2).lastIndex(5));
  t.eq(0, It.from(i2).lastIndex(1));
  t.eq(2, It.from(i2).lastIndex(3));

  // Block ------------------

  t.mark("block");

  t.eq("[]", It.from(i0).reverse().toString());
  t.eq("[1]", It.from(i1).reverse().toString());
  t.eq("[3, 2, 1]", It.from(i2).reverse().toString());

  var arr = ["pérez", "pera", "p zarra", "pizarra"];
  t.eq(
    ["p zarra", "pera", "pizarra", "pérez"].toString(),
    It.from(arr).sort().to().toString()
  );
  t.eq(
    ["p zarra", "pera", "pérez", "pizarra"].toString(),
    It.sortl(It.from(arr)).to().toString()
  );

  t.eq("[]", It.from(s0).shuffle().toString());
  t.eq("[one]", It.from(s1).shuffle().toString());
  // print(It.from(s2).shuffle().toString());

  // Static constructors ------------------

  t.mark("static constructors");

  t.eq("[0, 1, 2, 3, 4]", It.range(5).toString());
  t.eq("[2, 3, 4]", It.range(2, 5).toString());
  t.eq("[]", It.range(0).toString());
  t.eq("[]", It.range(2, 2).toString());

  t.eq("[]", It.zip(It.from(s0), It.from(s2)).toString());
  var its = It.unzip(It.zip(It.from(s1), It.from(s2)));
  t.yes(its.e1.eq(It.from(s1)));
  t.yes(its.e2.eq(It.from(s1)));
  its = It.unzip(It.zip(It.from(i1), It.from(i2)));
  t.yes(its.e1.eq(It.from(i1)));
  t.yes(its.e2.eq(It.from(i1)));

  var sum = 0;
  It.from(i0).each(function (e) {
    sum += e;
  });
  t.eq(0, sum);
  It.from(i1).each(function (e) {
    sum += e;
  });
  t.eq(1, sum);
  It.from(i2).each(function (e) {
    sum += e; }
  );
  t.eq(7, sum);

  var sum2 = 0;
  sum = 0;
  It.from(i0).eachIx(function (e, ix) {
    sum += e;
    sum2 += ix;
  });
  t.eq(0, sum);
  t.eq(0, sum2);
  It.from(i1).eachIx(function (e, ix) {
    sum += e;
    sum2 += ix;
  });
  t.eq(1, sum);
  t.eq(0, sum2);
  It.from(i2).eachIx(function (e, ix) {
    sum += e;
    sum2 += ix;
  });
  t.eq(7, sum);
  t.eq(3, sum2);

  t.log();
};

