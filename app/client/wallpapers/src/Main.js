// Copyright 08-Sep-2017 ºDeme
// GNU General Public License - V3 <http://www.gnu.org/licenses/>

goog.provide("Main");

goog.require("Control");

Main = class {
  run () {
    new Control().run();
  }
}
new Main().run();
