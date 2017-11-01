// Copyright 23-Oct-2017 ºDeme
// GNU General Public License - V3 <http://www.gnu.org/licenses/>

goog.provide("view_Summaries");

goog.require("db_Dentry");

view_Summaries = class {
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
    const self = this;
    const control = self._control;
    const conf = control.conf();
    const lang = conf.language();
    const summary = conf.summary();
    const db = control.db();
    const dom = control.dom();
    const dataDiv = $("div");

    function menuTd(op) {
      return summary.charAt(0) === op || summary.charAt(1) === op
        ? $("td").klass("frame").style("width:100px")
        : $("td").style("width:100px")
        ;
    }

    function separator() {
      return $("td").html(" · ");
    }

    function statementsSumary() {
      return $("p").html("statementsSumary");
    }

    function statementsAccounts() {
      return $("p").html("statementsAccounts");
    }

    function statementsSubaccounts() {
      return $("p").html("statementsSubaccounts");
    }

    function plSumary() {
      return $("p").html("plSumary");
    }

    function plAccounts() {
      return $("p").html("plAccounts");
    }

    function plSubaccounts() {
      return $("p").html("plSubaccounts");
    }

    function balanceSumary() {
      return $("p").html("balanceSumary");
    }

    function balanceAccounts() {
      return $("p").html("balanceAccounts");
    }

    function balanceSubaccounts() {
      return $("p").html("balanceSubaccounts");
    }

    const submenu = $("table").att("align", "center").add($("tr")
      .add(menuTd("0").add(Ui.link(ev => {
          control.setSummary("0" + summary.charAt(1));
        }).klass("link").html(_("Statements"))))
      .add(separator())
      .add(menuTd("1").add(Ui.link(ev => {
          control.setSummary("1" + summary.charAt(1));
        }).klass("link").html(_("P & L"))))
      .add(separator())
      .add(menuTd("2").add(Ui.link(ev => {
          control.setSummary("2" + summary.charAt(1));
        }).klass("link").html(_("Balance"))))
      .add($("td").html("||"))
      .add(menuTd("A").add(Ui.link(ev => {
          control.setSummary(summary.charAt(0) + "A");
        }).klass("link").html(_("Summary"))))
      .add(separator())
      .add(menuTd("B").add(Ui.link(ev => {
          control.setSummary(summary.charAt(0) + "B");
        }).klass("link").html(_("Accounts"))))
      .add(separator())
      .add(menuTd("C").add(Ui.link(ev => {
          control.setSummary(summary.charAt(0) + "C");
        }).klass("link").html(_("Subaccounts"))))
    );

    control.dom().show("summaries", $("div").style("text-align:center")
      .add($("h2").html(_("Summaries")))
      .add(submenu)
      .add($("hr"))
      .add(dataDiv)
    );

    dataDiv.add(
        summary === "0A" ? statementsSumary()
      : summary === "0B" ? statementsAccounts()
      : summary === "0C" ? statementsSubaccounts()
      : summary === "1A" ? plSumary()
      : summary === "1B" ? plAccounts()
      : summary === "1C" ? plSubaccounts()
      : summary === "2A" ? balanceSumary()
      : summary === "2B" ? balanceAccounts()
      : summary === "2C" ? balanceSubaccounts()
      : $("p").html("Bad value of summary")
    );
  }

}
