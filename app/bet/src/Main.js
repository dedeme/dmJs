// Copyright 13-Oct-2017 ºDeme
// GNU General Public License - V3 <http://www.gnu.org/licenses/>

import Model from "./Model.js";
import Dom from "./Dom.js";
import {I18n} from "./I18n.js";

export default class Main {

  constructor () {
    /** @private */
    this._model = new Model();
    /** @private */
    this._dom = new Dom(this);

    if (this._model.lang() === "es") {
      I18n.es();
    } else {
      I18n.en();
    }
  }

  /** @return {!Model} Model */
  model () {
    return this._model;
  }

  run () {
    this._dom.show();
  }
}
