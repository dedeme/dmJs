// Copyright 1-Sep-2017 ºDeme
// GNU General Public License - V3 <http://www.gnu.org/licenses/>

goog.provide("main");
goog.require("dm.Test");

let Test = dm.Test;

var main = function () {
  Test.run("from main", 4);
  new Test().r();
};
