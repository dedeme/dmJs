// Copyright 1-Sep-2017 ºDeme
// GNU General Public License - V3 <http://www.gnu.org/licenses/>

goog.provide("github.dedeme.Test")

/// Utility to test code
github.dedeme.Test = class {
  /** @param {string} fname */
  constructor (fname) {
    /** @private @type {string} */
    this.fname = fname;
    /** @private @type {number} */
    this.pass = 0;
    /** @private @type {number} */
    this.fail = 0;
    /** @private @type {string} */
    this.posName = "";
    /** @private @type {function(string, string)} */
    this.msg = (actual, expected) => {
      window.console.log("Test fail in [" + this.fname +
        (this.posName ? ":" : "") +
        this.posName + "]\n" +
         "  Actual  : " + actual + "\n  Expected: " + expected);
    };
  }

  /// Marks a point of program
  /** @param {string} pname */
  mark (pname) {
    return this.posName = pname;
  }

  /// Shows summary
  log () {
    window.console.log("Test [" + this.fname + "] summary:\n" +
      "  Total : " + (+this.pass + this.fail) + "\n" +
      "  Passed: " + this.pass + "\n" +
      "  Failed: " + this.fail);
  }

  /// Asserts that 'value' is true
  /** @param {boolean} value */
  yes (value) {
    if (!value) {
      ++this.fail;
      this.msg("false", "true");
    } else {
      ++this.pass;
    }
  }

  /**
   * (equals) Compares with ===
   * @template T
   * @param {T} actual
   * @param {T} expected
   */
  eq (actual, expected) {
    if (expected !== actual) {
      ++this.fail;
      this.msg(actual, expected);
    } else {
      ++this.pass;
    }
  }

  /// Asserts that 'value' is false
  /** @param {boolean} value */
  not (value) {
    if (value) {
      ++this.fail;
      this.msg("true", "false");
    } else {
      ++this.pass;
    }
  }

  /**
   * (not equals) Compares with ===
   * @template T
   * @param {T} actual
   * @param {T} expected
   */
  neq (actual, expected) {
    if (expected === actual) {
      ++this.fail;
      this.msg("!= " + actual, expected);
    } else {
      ++this.pass;
    }
  }
}

