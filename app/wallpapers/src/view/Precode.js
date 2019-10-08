// Copyright 09-Sep-2017 ºDeme
// GNU General Public License - V3 <http://www.gnu.org/licenses/>

import Domo from "../dmjs/Domo.js";
import Ui from "../dmjs/Ui.js";
import Main from "../Main.js";
import Model from "../Model.js";

const $ = Ui.$;

const buttonsDiv = $("div").style("text-align:center");
const codeDiv = $("div");

export default class Precode {
  /** @param {!Main} control */
  constructor (control) {
    /** @const {!Main} */
    this._control = control;
    /** @const {!Model} */
    this._model = control.model();
  }

  /** @return {!Domo} */
  mkButtons () {
    let control = this._control;

    let separator = () => $("span").html("&nbsp;");

    let mkUndo = () =>
      Ui.link(ev => { control.undoPrecode(); }).add(Ui.img("undo"));

    let mkRedo = () =>
      Ui.link(ev => { control.redoPrecode(); }).add(Ui.img("redo"));

    buttonsDiv.removeAll();
    if (this._model.precodeShow()) {
      buttonsDiv.add(mkUndo()).add(separator()).add(mkRedo());
    }

    return buttonsDiv;
  }

  /** @return {!Domo}*/
  mkCode () {
    let model = this._model;
    let mkTextEntry = () => $("textarea").att("rows", 15).att("cols", "30");

    codeDiv.removeAll();
    if (model.precodeShow()) {
      let entry = mkTextEntry().value(model.precode()[0]);
      entry.on("change", ev => { model.precodeSet(entry.value()); });
      codeDiv.add(entry);
    }

    return codeDiv;
  }
}
