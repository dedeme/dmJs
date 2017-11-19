// Copyright 16-Nov-2017 ºDeme
// GNU General Public License - V3 <http://www.gnu.org/licenses/>

goog.provide("Main");

goog.require("github_dedeme");
goog.require("Model");
goog.require("View");

Main = class {

  constructor () {
    /**
     * @private
     * @type {Model}
     */
    this._md = new Model();

    /**
     * @private
     * @type {!Array<string>}
     */
    this._page = [Store.get(Main.storeId()) || "exams", ""];
  }

  /** @return {Model} */
  md () {
    return this._md;
  }

  /** @return {!Array<string>} */
  page () {
    return this._page;
  }

  /**
   * @param {!Array<string>} value
   * @return {void}
   */
  setPage (value) {
    this._page = value;
  }

  /**
   * @param {!Array<string>} page
   * @return {void}
   */
  go (page) {
    Store.put(Main.storeId(), page[0]);
    this.setPage(page);
    new View(this).show();
  }

  static run() {
    const main = new Main();
    new View(main).show();
  }

  static app () {
    return "Selectividad - Client";
  }

  static version () {
    return "201711"
  }

  static storeId () {
    return "Selectividad_page";
  }
}
Main.run();
