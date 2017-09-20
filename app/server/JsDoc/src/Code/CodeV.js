// Copyright 19-Sep-2017 ºDeme
// GNU General Public License - V3 <http://www.gnu.org/licenses/>

goog.provide("CodeV");

goog.require("Dom");
goog.require("Conf");
goog.require("Tx");

CodeV = class {
  /**
   * @param {!Array<!Path>} paths
   * @param {string} selected
   * @param {string} modPath
   * @param {string} anchor
   * @param {string} text
   * @return {void}
   */
  static show (paths, selected, modPath, anchor, text) {
    const code = "<table border='0'><tr><td class='frame'>" +
      "<a href='../Module/index.html?" +
      selected + "@" + modPath + "'>" +
      modPath + "</td></tr></table>" +
      Tx.mkCode(text) +
      It.range(22).reduce("", (seed, i) => seed + "<p>&nbsp;</p>");

    Dom.show(paths, selected, $("div").html(code));

    const ix = modPath.lastIndexOf("/");
    $$("title").next().text(
      "JsDoc : " +
      (ix == -1 ? modPath : modPath.substring(ix + 1))
    );

    $("#" + anchor).e().scrollIntoView(true);
/*    if (navigator.vendor.indexOf("Google") != -1) {
      const hash = location.hash;
      location.hash = "";
      location.hash = hash;
    }
    */
  }
}
