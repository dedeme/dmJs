//- dm/Test.js
//- dm/Tp.js
/*
 * Copyright 05-Feb-2017 ºDeme
 * GNU General Public License - V3 <http://www.gnu.org/licenses/>
 */

tp = () => {
  "use strict";

  let Tp = dm.Tp;
  let Tp3 = dm.Tp3;

  let test = new dm.Test("Tuple");

  test.mark("Tp");
  let tp = new Tp(1, "b");
  test.eq(1, tp._1);
  test.eq("b", tp._2);

  test.mark("Tp3");
  let tp3 = new Tp3(1, "b", 33);
  test.eq(1, tp3._1);
  test.eq("b", tp3._2);
  test.eq(33, tp3._3);

  test.log();
}
