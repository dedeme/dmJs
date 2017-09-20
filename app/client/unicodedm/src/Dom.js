// Copyright 04-Sep-2017 ºDeme
// GNU General Public License - V3 <http://www.gnu.org/licenses/>

goog.provide("Dom");
goog.require("github.dedeme");

Dom = class {
  /** @private */
  static bodyTitle () {
    return "<span class='title'>Unicode-dm</span>";
  }

  /** @private */
  static version () {
    return "- &copy; &deg;Deme. unicodedm (v. 201709) -";
  }

  static bodyDiv () {
    return Dom._bodyDiv;
  }

  static show () {
    $$("body").next()
    .add($("table").att("class", "main")
      .add($("tr")
        .add($("td").att("colspan", "2").att("style", "font-family:sans;")
          .html(Dom.bodyTitle())))
      .add($("tr")
        .add($("td").att("colspan", "2").html("<hr>")))
      .add($("tr")
        .add($("td").att("widht", "50px"))
        .add($("td").add(Dom.bodyDiv())))
      .add($("tr")
        .add($("td").att("colspan", "2").html("<hr>"))))
    .add($("p").att("style",
      "text-align:right;font-size:10px;color:#808080;font-size:x-small;")
      .html(Dom.version()));

  }

}

/** @private */
Dom._bodyDiv = github.dedeme.Ui.$("div");

