// Copyright 23-Sep-2017 ºDeme
// GNU General Public License - V3 <http://www.gnu.org/licenses/>

goog.provide("Dom");

{
Dom = class {
  /**
   * @param {!Domo} o
   * @return {void}
   */
  static showRoot (o) {
    $$("body").next().removeAll().add(
      $("div")
        .add(o)
        .add($("p").html("&nbsp;"))
        .add($("hr"))
        .add($("table").klass("main")
          .add($("tr")
            .add($("td")
              .add($("a")
                .att("href", "doc/about.html")
                .att("target", "blank")
                .html("<small>Help & Credits</small>")))
            .add($("td")
              .style("text-align: right;font-size: 10px;" +
                "color:#808080;font-size:x-small;")
              .html("- © ºDeme. " + Main.app() + " (" +
                Main.version() + ") -"))))
    );
  }

  /**
   * @param {string} page
   * @param {!Domo} o
   * @return {void}
   */
  static show (page, o) {
    function entry(id, target) {
      return Ui.link(ev => { Main.go(target) })
        .klass(target == page ? "frame" : "link").html(id);
    }
    function separator() {
      return $("span").html(" · ");
    }

    const menu = $("table").klass("main").add($("tr")
      .add($("td")
        .add(entry(_("Diary"), "diary"))
        .add(separator())
        .add(entry(_("Cash"), "cash"))
        .add(separator())
        .add(entry(_("Plan"), "plan")))
      .add($("td").style("text-align:right")
        .add(entry(_("Settings"), "settings"))
        .add(separator())
        .add(Ui.link(ev => { Main.bye(); })
          .add(Ui.img("cross").style("vertical-align:bottom")))))
    ;

    Dom.showRoot(
      $("div")
        .add(menu)
        .add($("hr"))
        .add(o)
    );
  }

  /**
   * Returns text width of a text of type "14px sans"
   * @param {string} tx
   * @return {number}
   */
  static textWidth(tx) {
    const c = $("canvas");
    const e = c.e();
    const ctx = e.getContext("2d");
    ctx.font/**/ = "14px sans";
    return ctx.measureText(tx).width/**/;
  }

  /**
   * Adjusts tx to 'px' pixels. Font family must be "14px sans"
   * @param {string} tx
   * @param {number} px
   * @return {string}
   */
  static textAdjust(tx, px) {
    if (Dom.textWidth(tx) < px) {
      return tx;
    }

    tx = tx.substring(0, tx.length - 3) + "...";
    while (Dom.textWidth(tx) >= px) {
      tx = tx.substring(0, tx.length - 4) + "...";
    }
    return tx;
  }

}}
