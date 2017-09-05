// Copyright 04-Sep-2017 ºDeme
// GNU General Public License - V3 <http://www.gnu.org/licenses/>

goog.provide("Control");
goog.require("github.dedeme");
goog.require("View");

Control = class {

  static get group () {
    let group = Store.take("unicodedm_group");
    return group == null ? "00" : group;
  }

  static set group (g) {
    Store.put("unicodedm_group", g);
  }

  static get code () {
    let code = Store.take("unicodedm_code");
    return code == null ? "51" : code;
  }

  static set code (c) {
    Store.put("unicodedm_code", c);
  }

  static run () {
    View.show();
  }
}
