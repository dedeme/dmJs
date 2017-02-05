//- dm/Test.js
//- dm/It.js
/*
 * Copyright 05-Feb-2017 ºDeme
 * GNU General Public License - V3 <http://www.gnu.org/licenses/>
 */

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

