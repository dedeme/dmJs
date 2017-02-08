//- dm/dm.js
/*
 * Copyright 05-Feb-2017 ºDeme
 * GNU General Public License - V3 <http://www.gnu.org/licenses/>
 */

(() => {
  "use strict";

  //# * - * - Test
  dm.Test = function (fname) {
    var pass, fail, posName;
    var msg;

    pass = 0;
    fail = 0;
    posName = "";

    /// Marks a point of program
    //# str -
    this.mark = pname => { posName = pname; }

    /// Shows summary
    //# -
    this.log = () => {
      console.log(`Test [${fname}] summary:\n` +
        `  Total : ${pass + fail}\n  Passed: ${pass}\n  Failed: ${fail}`);
    }

    // str - str -
    msg = (expected, actual) => {
      console.log(`Test fail in [${fname}${posName?':':''}${posName}]\n` +
        `  Expected: ${expected}\n  Actual  : ${actual}`);
    }

    //# bool -
    this.yes = value => {
      if (!value) {
        ++fail;
        msg("true", "false");
      } else {
        ++pass;
      }
    }

    /// Compares with ==
    //# * - * -
    this.eq = (expected, actual) => {
      if (expected !== actual) {
        ++fail;
        msg(expected, actual);
      } else {
        ++pass;
      }
    }

    //# bool -
    this.not = value => {
      if (value) {
        ++fail;
        msg("false", "true");
      } else {
        ++pass;
      }
    }

    /// Compares with ==
    //# * - * -
    this.neq = (expected, actual) => {
      if (expected === actual) {
        ++fail;
        msg("!= " + expected, actual);
      } else {
        ++pass;
      }
    }
  }
})();

