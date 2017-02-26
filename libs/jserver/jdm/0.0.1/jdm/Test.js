//- jdm/jdm.js
/*
 * Copyright 05-Feb-2017 ºDeme
 * GNU General Public License - V3 <http://www.gnu.org/licenses/>
 */
/*global print, jdm */

(function () {
  "use strict";

  //# str - Test
  var Test = function (fname) {
    var pass = 0;
    var fail = 0;
    var posName = "";

    // str - str -
    var msg = function (expected, actual) {
      print("Test fail in [" + fname +
        (posName ? ":" : "") +
        posName + "]\n" +
        "  Expected: " + expected + "\n  Actual  : " + actual);
    };

    /// Marks a point of program
    //# str -
    this.mark = function (pname) {
      posName = pname;
    };

    /// Shows summary
    //# -
    this.log = function () {
      print("Test [" + fname + "] summary:\n" +
        "  Total : " + (+pass + fail) + "\n" +
        "  Passed: " + pass + "\n" +
        "  Failed: " + fail);
    };

    //# bool -
    this.yes = function (value) {
      if (!value) {
        ++fail;
        msg("true", "false");
      } else {
        ++pass;
      }
    };

    /// Compares with ==
    //# * - * -
    this.eq = function (expected, actual) {
      if (expected !== actual) {
        ++fail;
        msg(expected, actual);
      } else {
        ++pass;
      }
    };

    //# bool -
    this.not = function (value) {
      if (value) {
        ++fail;
        msg("false", "true");
      } else {
        ++pass;
      }
    };

    /// Compares with ==
    //# * - * -
    this.neq = function (expected, actual) {
      if (expected === actual) {
        ++fail;
        msg("!= " + expected, actual);
      } else {
        ++pass;
      }
    };
  };
  jdm.Test = Test;
}());

