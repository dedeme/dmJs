// Copyright 04-Sep-2017 ºDeme
// GNU General Public License - V3 <http://www.gnu.org/licenses/>

goog.provide("Control");
goog.require("github_dedeme");
goog.require("View");

Control = class {

  static group () {
    let group = Store.get("unicodedm_group");
    return group == null ? "00" : group;
  }

  static setGroup (g) {
    Store.put("unicodedm_group", g);
  }

  static code () {
    let code = Store.get("unicodedm_code");
    return code == null ? "51" : code;
  }

  static setCode (c) {
    Store.put("unicodedm_code", c);
  }

  static run () {
    View.show();
  }
}
