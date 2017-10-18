// Copyright 13-Oct-2017 ºDeme
// GNU General Public License - V3 <http://www.gnu.org/licenses/>

goog.provide("Main");

goog.require("github_dedeme");
goog.require("I18n");
goog.require("Model");
goog.require("Dom");

Main = class {

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

  /** @return {!Model} */
  model () {
    return this._model;
  }

  run () {
    this._dom.show();
  }
}
new Main().run();
