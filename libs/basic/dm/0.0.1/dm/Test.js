//- dm/dm.js
/*
 * Copyright 05-Feb-2017 ºDeme
 * GNU General Public License - V3 <http://www.gnu.org/licenses/>
 */
/*global window, dm */

(() => {

  class Test {
    //# str - Test
    constructor (fname) {
      this._fname = fname;
      this._pass = 0;
      this._fail = 0;
      this._posName = "";

      // str - str -
      this._msg = (expected, actual) => {
        window.console.log("Test fail in [" + this._fname +
          (this._posName ? ":" : "") +
          this._posName + "]\n" +
          "  Expected: " + expected + "\n  Actual  : " + actual);
      };
    }

    /// Marks a point of program
    //# str -
    mark (pname) {
      return this._posName = pname;
    }

    /// Shows summary
    //# -
    log () {
      window.console.log("Test [" + this._fname + "] summary:\n" +
        "  Total : " + (+this._pass + this._fail) + "\n" +
        "  Passed: " + this._pass + "\n" +
        "  Failed: " + this._fail);
    }

    //# bool -
    yes (value) {
      if (!value) {
        ++this._fail;
        this._msg("true", "false");
      } else {
        ++this._pass;
      }
    }

    /// Compares with ==
    //# * - * -
    eq (expected, actual) {
      if (expected !== actual) {
        ++this._fail;
        this._msg(expected, actual);
      } else {
        ++this._pass;
      }
    }

    //# bool -
    not (value) {
      if (value) {
        ++this._fail;
        this._msg("false", "true");
      } else {
        ++this._pass;
      }
    }

    /// Compares with ==
    //# * - * -
    neq (expected, actual) {
      if (expected === actual) {
        ++this._fail;
        this._msg("!= " + expected, actual);
      } else {
        ++this._pass;
      }
    }
  }
  dm.Test = Test;
})();

