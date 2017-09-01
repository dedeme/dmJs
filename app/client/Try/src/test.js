// Copyright 1-Sep-2017 ºDeme
// GNU General Public License - V3 <http://www.gnu.org/licenses/>

goog.provide("dm.Test");

dm.Test = class {
  /**
   * @param {string} variable
   */
  static run(variable, opt) {
    alert("In test " + variable);
  }

  /** private */
  r() { alert("rxx"); }
};

