// Copyright 24-Sep-2017 ºDeme
// GNU General Public License - V3 <http://www.gnu.org/licenses/>

goog.provide("view_Diary");

view_Diary = class {
  /**
   * @param {!Main} control
   */
  constructor (control) {
    /** @private */
    this._control = control;
    /**
     * @private
     * @type {number}
     */
    this._nModify = -1;
    /**
     * @private
     * @type {string}
     */
    this._planHelp = "";
  }

  /**
   * @return {void}
   */
  show () {
    const self = this;
    const control = self._control;
    const db = control.db();

    const left = $("td").klass("frame").style("width:250px;vertical-align:top;")
        .add($("p").html("<b>" + _("Most used accounts") + "</b>"))
        .add($("ul").style("list-style:none;padding-left:0px;")
          .addIt(It.empty()))
        .add($("p").html("<b>" + _("Plan") + "</b>"))
        .add($("ul").style("list-style:none;padding-left:0px;")
          .addIt(It.empty()))

    const right =  $("td").style("text-align:center;vertical-align:top;")
      .add($("h2").html(_("Diary")))

    const table = $("table").klass("main").add($("tr")
      .add(left)
      .add(right));
    control.dom().show("diary", table);
  }
}
