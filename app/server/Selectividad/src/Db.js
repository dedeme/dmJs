// Copyright 12-Nov-2017 ºDeme
// GNU General Public License - V3 <http://www.gnu.org/licenses/>

goog.provide("Db");

Db = class {
  /** @param {!Object<string, ?>} d */
  constructor (d) {
    this._d = d;

    /**
     * @private
     * @type {string}
     */
    this._language = d["language"] || "es";


    /**
     * @private
     * @type {string}
     */
    this._page = d["page"] || "settings";

    /**
     * @private
     * @type {!Object<string, !Array<!Array<?>>>} Where !Array<!Array<?>> is
     *   [item, [unit:str, unit:str, unit:str, unit:str]]
     */
    this._exas = d["exas"] || {};

    /**
     * @private
     * @type {!Object<string, !Array<!Array<?>>>} Where !Array<!Array<?>> is
     *   [[exaId:str, exaIx:number], cut:number]
     */
    this._exes = d["exes"] || {};
  }

  /** @return {string} */
  language () {
    return this._language;
  }

  /**
   * @param {string} value
   * @return {void}
   */
  setLanguage (value) {
    this._language = value;
  }


  /** @return {string} */
  page () {
    return this._page;
  }

  /**
   * @param {string} value
   * @return {void}
   */
  setPage (value) {
    this._page = value;
  }

  /**
   * @return {!Object<string, !Array<!Array<?>>>} Where !Array<!Array<?>> is
   *  [item:str, [unit:str, unit:str, unit:str, unit:str]]
   */
  exas () {
    return this._exas;
  }

  /**
   * @return {!Object<string, !Array<?>>} Where !Array<!Array<?>> is
     *   [[exaId:str, exaIx:number], cut:number]
   */
  exes () {
    return this._exes;
  }

  /**
   * @param {string} id
   * @param {string} tx
   */
  setExam (id, tx) {
    const arr = [];
    let ix = 0;
    while (true) {
      let ix2 = tx.indexOf("<div>", ix);
      if (ix2 === -1) {
        break;
      }
      ix = ix2 + 5;
      ix2 = tx.indexOf("</div>", ix);
      if (ix2 === -1) {
        arr.push([tx.substring(ix).trim(), ["", "", "", ""]]);
        break;
      }
      arr.push([tx.substring(ix, ix2).trim(), ["", "", "", ""]]);
      ix = ix2 + 6;
    }
    this._exas[id] = arr;
  }

  /**
   * @param {string} id
   */
  delExam (id) {
    delete(this._exas[id]);
  }

  /**
   * @param {string} ix Index in format "01", "02", ...
   * @return {!Array<!Array<?>>} Each row is [exaId:str, exIx:number]
   */
  itemsList (ix) {
    const r = [];
    It.keys(this._exas).sort().reverse().eachIx(id => {
      const items = this._exas[id];
      It.from(items).eachIx((item, i) => {
        if (It.from(item[1]).contains(ix)) {
          r.push([id, i]);
        }
      })
    });
    return r;
  }

  /**
   * @param {string} id
   * @param {!Array<?>} tps Array<?> is [exaId:str, exIx:number]
   * @param {number} cut
   */
  setExercise(id, tps, cut) {
    this._exes[id] = [tps, cut];
  }

  /**
   * @param {string} id
   */
  delExercise (id) {
    delete(this._exes[id]);
  }

  serialize () {
    return {
      "language" : this._language,
      "page" : this._page,
      "exas" : this._exas,
      "exes" : this._exes
    };
  }

  /** @return !Object<string, string> */
  static units () {
    return {
      "01" : "La empresa y el empresario",
      "02" : "Formas jurídicas de las empresas",
      "03" : "El crecimiento empresarial",
      "04" : "El proceso productivo: costes y productividad. " +
             "Umbral de rentabilidad",
      "05" : "El proceso productivo: aprovisionamiento y valoración " +
             "de existencias",
      "06" : "La función financiera de la empresa I. Financiación",
      "07" : "La función financiera de la empresa II. Inversión",
      "08" : "Contabilidad: Patrimonio y Cuentas Anuales",
      "09" : "Contabilidad. Análisis patrimonial y análisis financiero",
      "10" : "Contabilidad. Análisis económico y periodo medio de maduración",
      "11" : "La función comercial en la empresa I. Marketing estratégico",
      "12" : "La función comercial en la empresa II. Marketing operativo",
      "13" : "Dirección de la empresa I: planificación, organización y control",
      "14" : "Dirección de la empresa II: gestión de los recursos humanos"
    };
  }
}

