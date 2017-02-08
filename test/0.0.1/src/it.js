//- dm/Test.js
//- dm/It.js
/*
 * Copyright 05-Feb-2017 ºDeme
 * GNU General Public License - V3 <http://www.gnu.org/licenses/>
 */

it = () => {
  "use strict";
  let It = dm.It;

  let t = new dm.Test("It");

  let aN1 = [1, 2, 3];
  let itN1 = It.from(aN1);
  t.eq(1, itN1.next());
  t.eq(2, itN1.next());
  t.eq(3, itN1.next());
  t.not(itN1.hasNext());

  // constructors ------------------------------------------

  t.mark("constructors");

  let i0 = [];
  let i1 = [1];
  let i2 = [1, 2, 3];
  let s0 = [];
  let s1 = ["one"];
  let s2 = ["one", "two", "three"];

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

  let ik = dm.It.keys({"one" : 1, "two" : 2});
  t.eq("one", ik.next().toString());
  t.eq("two", ik.next().toString());
  t.yes(!ik.hasNext())

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

  let pr1 = e => e < 2
  let npr1 = e => e >= 2

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

