// Copyright 09-Sep-2017 ºDeme
// GNU General Public License - V3 <http://www.gnu.org/licenses/>

goog.provide("Dom0");

Dom0 = class {
  /**
   * @param {!Domo} o
   * @return {void}
   */
  static show (o) {
    $$("body").next().removeAll().add(
      $("div")
        .add(o)
        .add($("p").html("&nbsp;"))
        .add($("hr"))
        .add($("table").klass("main")
          .add($("tr")
            .add($("td")
              .add($("a")
                .att("href", "../doc/about.html")
                .att("target", "blank")
                .html("<small>Help & Credits</small>")))
            .add($("td")
              .style("text-align: right;font-size: 10px;" +
                "color:#808080;font-size:x-small;")
              .html("- © ºDeme. " + Global.app() +
                " (v. " + Global.version() + ") -"))))
    );
  }
}
