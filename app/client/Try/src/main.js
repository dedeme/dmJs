// Copyright 1-Sep-2017 ºDeme
// GNU General Public License - V3 <http://www.gnu.org/licenses/>

goog.provide("Main");
goog.require("dm.Test");

{

  /** @type {string} */
  let a = "";
  /** @type {string} */
  let b = "";

  /** @const {string} */
  const c = "";


Main = class {

  constructor () {
    this._n = 3;

    /** @type {string} */
    this._aa = "";
    /** @type {string} */
    this._bb = "";

  }

  /** @return {string} */
  static a () {
    return a;
  }

  /** @return {string} */
  static b () {
    return b;
  }

  /**
   * @param {string} value
   * @return {void}
   */
  static setB (value) {
    b = value;
  }

  /** @return {string} */
  static c () {
    return c;
  }

  /** @return {string} */
  aa () {
    return this._aa;
  }

  /** @return {string} */
  bb () {
    return this._bb;
  }

  /**
   * @param {string} value
   * @return {void}
   */
  setBb (value) {
    this._bb = value;
  }


  /**
   * @param {number} n
   * @return {number}
   */
  add (n) {
    return this._n + n;
  }

  static run() {
    alert(new Main().add(8));
  }
}}
Main.run();
