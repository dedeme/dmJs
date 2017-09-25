// Copyright 24-Sep-2017 ºDeme
// GNU General Public License - V3 <http://www.gnu.org/licenses/>

goog.provide("db_Action");

db_Action = class {

  /**
   * @param {string} action
   * @return {void}
   */
  static process (action) {
    const code2 = action.substring(0, 2);
    const code3 = action.substring(0, 3);
    /**
     * @param {...number} pos
     * @return {!Array<string>}
     */
    function cut (...pos) {
      const r = [];
      let ix = pos[0];
      for (let i = 1; i < pos.length; ++i) {
        const p = pos[i];
        r.push(action.substring(ix, p));
        ix = p;
      }
      r.push(action.substring(ix, action.length));
      return r;
    }

    if (action === "") {
      return;

    } else if (code3 === "SGA") {
      Db.subgroupsAdd(cut(3, 5));
    } else if (code2 === "AA") {
      const cs = cut(2, 5, action.indexOf(";"));
      cs[2] = cs[2].substring(1);
      Db.accountsAdd(cs);
    } else if (code3 === "SAA") {
      Db.subaccountsAdd(cut(3, 8));

    } else if (code3 === "SGD") {
      Db.subgroupsDel(action.substring(3));
    } else if (code2 === "AD") {
      Db.accountsDel(action.substring(2));
    } else if (code3 === "SAD") {
      Db.subaccountsDel(action.substring(3));

    } else {
      throw("Action '" + action + "' is unknown");
    }
  }

  /**
   * @param {string} id
   * @param {string} description
   * @return {string}
   */
  static mkAddSubgroup (id, description) {
    return "SGA" + id + description;
  }

  /**
   * @param {string} id
   * @param {string} summary
   * @param {string} description
   * @return {string}
   */
  static mkAddAccount (id, summary, description) {
    return "AA" + id + summary + ";" + description;
  }

  /**
   * @param {string} id
   * @param {string} description
   * @return {string}
   */
  static mkAddSubaccount (id, description) {
    return "SAA" + id + description;
  }

  /**
   * @param {string} id
   * @return {string}
   */
  static mkDelSubgroup (id) {
    return "SGD" + id;
  }

  /**
   * @param {string} id
   * @return {string}
   */
  static mkDelAccount (id) {
    return "AD" + id;
  }

  /**
   * @param {string} id
   * @return {string}
   */
  static mkDelSubaccount (id) {
    return "SAD" + id;
  }

}
