// Copyright 09-Sep-2017 ºDeme
// GNU General Public License - V3 <http://www.gnu.org/licenses/>

goog.provide("ChpassV");

goog.require("Global");
goog.require("Dom0");
goog.require("github_dedeme.Captcha");

{
  const pass = Ui.pass("newPass");
  const newPass = Ui.pass("newPass2").att("id", "newPass");
  const newPass2 = Ui.pass("accept").att("id", "newPass2");
  const accept = $("input")
    .att("type", "button")
    .style("width:90px;")
    .att("id", "accept")
    .value(_("Accept"));
  const cancel = $("input")
    .att("type", "button")
    .style("width:90px;")
    .value(_("Cancel"));

  const captcha = new github_dedeme.Captcha("JsDoc_chpass", 3);

ChpassV = class {
  /** @param {!Chpass} control */
  constructor (control) {
    /**
     * @private
     * @const {!Chpass}
     */
    this._control = control;
  }

  /** @return {!Domo} */
  static pass () {
    return pass;
  }

  /** @return {!Domo} */
  static newPass () {
    return newPass;
  }

  /** @return {!Domo} */
  static newPass2 () {
    return newPass2;
  }

  /** @return {!github_dedeme.Captcha} */
  static captcha () {
    return captcha;
  }

  /**
   * @private
   * @return {!Domo}
   */
  body () {
    const control = this._control;
    const counter = captcha.counter();
    const counterLimit = captcha.counterLimit();

    accept.on("click", e => {
      if (counter > counterLimit && !captcha.match()) {
        alert(_("Grey squares checks are wrong"));
        return;
      }
      control.accept(
        pass.value().trim(),
        newPass.value().trim(),
        newPass2.value().trim()
      );
    });

    cancel.on("click", e => { location.assign("../Paths/index.html"); });

    let rows = [
      $("tr")
        .add($("td")
          .att("style", "padding: 10px 0px 0px 10px;text-align:right;")
          .html(_("Current password")))
        .add($("td").att("style", "padding: 10px 10px 0px 10px;")
          .add(pass)),
      $("tr")
        .add($("td")
          .att("style", "padding: 5px 0px 0px 10px;text-align:right;")
          .html(_("New password")))
        .add($("td").att("style", "padding: 5px 10px 0px 10px;")
          .add(newPass)),
      $("tr")
        .add($("td")
          .att("style", "padding: 5px 0px 10px 10px;text-align:right;")
          .html(_("Confirm password")))
        .add($("td").att("style", "padding: 5px 10px 10px 10px;")
          .add(newPass2)),
      $("tr")
        .add($("td")
          .att("colspan", 2)
          .att("style",
            "border-top:1px solid #c9c9c9;" +
            "padding: 10px 10px 10px;text-align:right;")
          .add($("span")
            .add(cancel)
            .add($("span").text("  "))
            .add(accept)))
    ];

    if (counter > 0) {
      rows.push(
        $("tr")
          .add($("td")
            .att("colspan", 2)
            .style('border-top:1px solid #c9c9c9;' +
              "padding: 10px 10px 10px;text-align:right;")
            .add($("table")
              .att("align", "center")
              .style("background-color: rgb(250, 250, 250);" +
                "border: 1px solid rgb(110,130,150);" +
                "font-family: sans;font-size: 14px;" +
                "padding: 4px;border-radius: 4px;")
              .add($("tr")
                .add($("td").html(_("Fail trying to change password"))))))
      );
    }

    if (counter > counterLimit) {
      rows.push(
        $("tr")
          .add($("td").att("colspan", 2).att("align", "center")
            .add(captcha.make()))
      );
      rows.push(
        $("tr")
          .add($("td")
            .att("colspan", 2)
            .style("padding: 5px 0px 5px 10px;text-align:center;")
            .html(_("Check gray squares")))
      );
    }

    return $("table")
      .att("align", "center")
      .style(
        'background-color: #f8f8f8;' +
        "border-collapse: collapse;" +
        "padding: 10px;" +
        "border: 1px solid rgb(110,130,150);")
      .add($("tr")
        .add($("td")
          .att("colspan", 2)
          .style(
            'background-color:#e8e8e8;' +
            'border-bottom:1px solid #c9c9c9;' +
            "padding: 10px;" +
            'color:#505050;'
          )
          .html("<big><big><b>" + _("Login") + "</big></big></b>")))
      .addIt(It.from(rows));
  }

  show () {
    Dom0.show(
      $("div")
        .add($("div").klass("title").html(
          "&nbsp;<br>" + Global.app() + "<br>&nbsp;"))
        .add($("div").add(this.body()))
    );
    pass.e().focus();
  }
}}

