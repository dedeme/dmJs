// Copyright 14-Nov-2017 ºDeme
// GNU General Public License - V3 <http://www.gnu.org/licenses/>

goog.provide("view_Export");

view_Export = class {
  /**
   * @param {!Main} control
   */
  constructor (control) {
    /** @private */
    this._control = control;
  }

  /**
   * @return {void}
   */
  show () {
    const control = this._control;
    const db = control.db();

    function format(tx) {
      const len = tx.length;
      let ix = 0;
      let r = "";
      while (ix < len) {
        let end = ix + 60;
        if (end > len) {
          end = len;
        }
        r += "\"" + tx.substring(ix, end) + "\"";
        if (end < len) {
          r += " +\n";
        }
        ix = end;
      }
      return r;
    }

    control.dom().show("export", $("table").klass("main")
      .add($("tr").add($("td").att("colspan", 2).style("text-align:center;")
        .add($("p").html("<b>" + _("Export") + "</b>"))))
      .add($("tr").add($("td").att("colspan", 2).html("<hr>")))
      .add($("tr").add($("td").style("text-align:center;")
        .add($("textarea").att("cols", 90).att("rows", 30)
          .att("readonly", true)
          .value(format(B64.encode(JSON.stringify(db.exas())))))))
    );
  }
}
