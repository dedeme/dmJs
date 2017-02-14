//- dm/dm.js
/*
 * Copyright 05-Feb-2017 ºDeme
 * GNU General Public License - V3 <http://www.gnu.org/licenses/>
 */

(function () {
  "use strict";

  //# str - Test
  dm.Test = function (fname) {
    this._fname = fname;
    this._pass = 0;
    this._fail = 0;
    this._posName = "";

    // str - str -
    this._msg = function (expected, actual) {
      console.log("Test fail in [" + this._fname + (this._posName ? ":" : "") +
        this._posName + "]\n" +
        "  Expected: " + expected + "\n  Actual  : " + actual);
    };
  };
  var test = dm.Test.prototype;

  /// Marks a point of program
  //# str -
  test.mark = function (pname) { this._posName = pname; };

  /// Shows summary
  //# -
  test.log = function () {
    console.log("Test [" + this._fname + "] summary:\n" +
      "  Total : " + (+this._pass + this._fail) + "\n" +
      "  Passed: " + this._pass + "\n" +
      "  Failed: " + this._fail);
  };

  //# bool -
  test.yes = function (value) {
    if (!value) {
      ++this._fail;
      this._msg("true", "false");
    } else {
      ++this._pass;
    }
  };

  /// Compares with ==
  //# * - * -
  test.eq = function (expected, actual) {
    if (expected !== actual) {
      ++this._fail;
      this._msg(expected, actual);
    } else {
      ++this._pass;
    }
  };

  //# bool -
  test.not = function (value) {
    if (value) {
      ++this._fail;
      this._msg("false", "true");
    } else {
      ++this._pass;
    }
  };

  /// Compares with ==
  //# * - * -
  test.neq = function (expected, actual) {
    if (expected === actual) {
      ++this._fail;
      this._msg("!= " + expected, actual);
    } else {
      ++this._pass;
    }
  };
}());

