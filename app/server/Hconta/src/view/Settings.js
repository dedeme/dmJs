// Copyright 24-Sep-2017 ºDeme
// GNU General Public License - V3 <http://www.gnu.org/licenses/>

goog.provide("view_Settings");

view_Settings = class {
  /**
   * @return {void}
   */
  static show () {
    Dom.show("settings", $("div").style("text-align:center")
      .add($("h2").html(_("Settings")))
      .add($("p").html("&nbsp;"))
      .add($("p")
        .add($("span").html(_("Change language to") + ": "))
        .add(Ui.link(ev => { Main.changeLang(); })
          .klass("link")
          .html(Conf.language() == "en" ? "ES": "EN")))
      .add($("p")
        .add(Ui.link(ev => { Main.changePassPage(); })
          .klass("link").html(_("Change password"))))
    );
  }
}

