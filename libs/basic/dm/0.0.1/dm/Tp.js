//- dm/dm.js
/*
 * Copyright 14-Feb-2017 ºDeme
 * GNU General Public License - V3 <http://www.gnu.org/licenses/>
 */
/*global dm */

(function () {

  //# * - * - Tp
  class Tp {
    constructor (e1, e2) {
      //# *
      this.e1 = e1;
      //# *
      this.e2 = e2;
    }
  }
  dm.Tp = Tp;

  //# * - * - Tp
  class Tp3 extends Tp {
    constructor (e1, e2, e3) {
      super(e1, e2);
      //# *
      this.e3 = e3;
    }
  }
  dm.Tp3 = Tp3;

}());
