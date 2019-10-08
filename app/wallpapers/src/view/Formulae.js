// Copyright 08-Sep-2017 ºDeme
// GNU General Public License - V3 <http://www.gnu.org/licenses/>

import Ui from "../dmjs/Ui.js";
import It from "../dmjs/It.js";
import Main from "../Main.js";
import Model from "../Model.js";

const $ = Ui.$;

export default class Precode {
  /** @param {!Main} control */
  constructor (control) {
    /** @const {!Model} */
    this._model = control.model();
  }

  mk () {
    let model = this._model;

    let mkTextEntry = () => $("textarea").att("rows", 15).att("cols", "30");

    let mkTd = () => $("td")
      .style("text-align:center;vertical-align:top;width:10px;");

    let fcs = [...It.range(3).map(i => mkTextEntry()
      .value(model.fcs()[i][0])
      .on("change", ev => { model.fcSet(i, fcs[i].value()); })
    )];

    return [
      mkTd().add(fcs[0]),
      mkTd().add(fcs[1]),
      mkTd().add(fcs[2])
    ];
  }
}
