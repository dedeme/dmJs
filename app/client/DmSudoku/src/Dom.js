// Copyright 05-Sep-2017 ºDeme
// GNU General Public License - V3 <http://www.gnu.org/licenses/>

goog.provide("Dom");

Dom = class {
  /**
   * @param {!Domo} o
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
                .att("href", "doc_" + Model.mdata().lang() + "/about.html")
                .html("<small>" + _("Help & Credits") + "</small>")))
            .add($("td")
              .style("text-align: right;font-size: 10px;" +
                "color:#808080;font-size:x-small;")
              .html("- © ºDeme. DmSudoku (" + Main.version() + ") -"))))
    );
  }
}
