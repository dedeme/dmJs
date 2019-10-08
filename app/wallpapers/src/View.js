// Copyright 08-Sep-2017 ºDeme
// GNU General Public License - V3 <http://www.gnu.org/licenses/>

import Ui from "./dmjs/Ui.js";
import It from "./dmjs/It.js";
import Main from "./Main.js";
import Model from "./Model.js";
import Viewer from "./view/Viewer.js";
import Menu from "./view/Menu.js";
import Precode from "./view/Precode.js";
import Buttons from "./view/Buttons.js";
import Formulae from "./view/Formulae.js";
import Gallery from "./view/Gallery.js";

/*
goog.require("Viewer");
goog.require("Menu");
goog.require("Precode");
goog.require("Buttons");
goog.require("Formulae");
goog.require("Gallery");
*/

const $ = Ui.$;

const title = $("div").style("text-align:center;font-size:35px;")
  .html("Wallpapers");

export default class View {
  /**
   * @param {!Main} control
   */
  constructor (control) {
    /** @private */
    this._control = control;
    /** @private */
    this._model = control.model();
    /** @private */
    this._viewer = new Viewer(control);
    /** @private */
    this._menu = new Menu(control);
    /** @private */
    this._precode = new Precode(control);
  }

  /** @return {!Main} */
  control () {
    return this._control;
  }

  /** @return {!Model} */
  model () {
    return this._model;
  }

  /** @return {!Viewer} */
  viewer () {
    return this._viewer;
  }

  /** @return {!Menu} */
  menu () {
    return this._menu;
  }

  /** @return {!Precode} */
  precode () {
    return this._precode;
  }

  /** @return {void} */
  show () {
    let control = this._control;
    let precode = this._precode;
    let viewer = this._viewer;
    let menu = this._menu.mk();
    let buttons = new Buttons(control).mk();
    let formulae = new Formulae(control).mk();
    $("@body").removeAll().add($("table").klass("main")
      .add($("tr").add($("td").att("colspan", 6).add(title)))
      .add($("tr").add($("td").att("colspan", 6).html("<hr>")))
      .add($("tr")
        .add($("td"))
        .add($("td").add(precode.mkButtons()))
        .adds(buttons)
        .add($("td")))
      .add($("tr")
        .add($("td").att("rowspan", 2).style("vertical-align:top;width:5px;")
          .add(menu))
        .add($("td").style("text-align:center;vertical-align:top;width:10px;")
          .add(precode.mkCode()))
        .adds(formulae)
        .add($("td")))
      .add($("tr")
        .add($("td").att("colspan", 5).style("vertical-align:top;")
          .add(viewer.mk())))
    );
  }

  /** @return {void} */
  showGallery () {
    let gallery = new Gallery(this._control);
    $("@body").removeAll().add($("table").klass("main")
      .add($("tr").add($("td").add(title)))
      .add($("tr").add($("td").html("<hr>")))
      .add($("tr").add($("td").add(gallery.mkGoBack())))
      .add($("tr").add($("td").html("<hr>")))
      .add($("tr").add($("td").add(gallery.mk())))
      .add($("tr").add($("td").html("<hr>")))
    );
  }

}

