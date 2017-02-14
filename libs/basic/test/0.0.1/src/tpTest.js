//- dm/Test.js
//- dm/Tp.js
/*
 * Copyright 05-Feb-2017 ºDeme
 * GNU General Public License - V3 <http://www.gnu.org/licenses/>
 */

function tpTest() {
  "use strict";

  var Tp = dm.Tp;
  var Tp3 = dm.Tp3;

  var t = new dm.Test("Tuple");

  t.mark("Tp");
  var tp = new Tp(1, "b");
  t.eq(1, tp.e1);
  t.eq("b", tp.e2);

  t.mark("Tp3");
  var tp3 = new Tp3(1, "b", 33);
  t.eq(1, tp3.e1);
  t.eq("b", tp3.e2);
  t.eq(33, tp3.e3);

  t.log();
}
