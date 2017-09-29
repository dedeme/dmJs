// Copyright 24-Sep-2017 ºDeme
// GNU General Public License - V3 <http://www.gnu.org/licenses/>

goog.provide("Db");

Db = class {
  /**
   * @param {!Array<!Array<string>>} subgroups
   * @param {!Array<!Array<string>>} accounts
   * @param {!Array<!Array<string>>} subaccounts
   * @param {!Array<!db_Dentry>} diary
   */
  constructor (subgroups, accounts, subaccounts, diary) {
    /** @private */
    this._subgroups = subgroups;
    /** @private */
    this._accounts = accounts;
    /** @private */
    this._subaccounts = subaccounts;
    /** @private */
    this._diary = diary;
  }

  /**
   * Fields:
   *   id: 2 digits
   *   description
   * @return {!Array<!Array<string>>}
   */
  static groups () {
    return [
      ["1", "Financiación básica"],
      ["2", "Inmovilizado"],
      ["3", "Existencias"],
      ["4", "Acreedores y deudores"],
      ["5", "Cuentas financieras"],
      ["6", "Compras y gastos"],
      ["7", "Ventas e ingresos"],
      ["8", "Gastos del patrimonio neto"],
      ["9", "Ingresos del patrimonio neto"]
    ];
  }

  /**
   * Fields:
   *   id: 2 digits
   *   description
   * @return {!Array<!Array<string>>}
   */
  subgroups () {
    return this._subgroups;
  }

  /**
   * @param {string} id
   * @param {string} description
   * @return {void}
   */
  subgroupsAdd (id, description) {
    this._subgroups.push([id, description]);
  }

  /**
   * @param {string} id
   * @return {void}
   */
  subgroupsDel (id) {
    this.accountsDel(id);
    this._subgroups = It.from(this._subgroups).filter(e => e[0] !== id).to();
  }

  /**
   * @param {string} modifyId
   * @param {string} id
   * @param {string} description
   * @return {void}
   */
  subgroupsMod (modifyId, id, description) {
    if (modifyId !== id) {
      this.accountsMod(modifyId, id);
    }
    this._subgroups = It.from(this._subgroups)
      .map(e => e[0] === modifyId ? [id, description] : e).to();
  }

  /**
   * Fields:
   *   id: 3 digits
   *   description
   *   summary: Place in Balance or PyG
   * @return {!Array<!Array<string>>}
   */
  accounts () {
    return this._accounts;
  }

  /**
   * @param {string} id
   * @param {string} description
   * @param {string} summary
   * @return {void}
   */
  accountsAdd (id, description, summary) {
    this._accounts.push([id, description, summary]);
  }

  /**
   * @param {string} id
   * @return {void}
   */
  accountsDel (id) {
    this.subaccountsDel(id);
    this._accounts = It.from(this._accounts)
      .filter(e => !e[0].startsWith(id)).to();
  }

  /**
   * @param {string} modifyId
   * @param {string} id
   * @param {string=} description
   * @param {string=} summary
   * @return {void}
   */
  accountsMod(modifyId, id, description, summary) {
    if (modifyId !== id) {
      this.subaccountsMod(modifyId, id);
    }
    this._accounts = It.from(this._accounts)
      .map(e => e[0].startsWith(modifyId)
        ? description === undefined
          ? [id + e[0].substring(id.length), e[1], e[2]]
          : [id + e[0].substring(id.length), description, summary]
        : e
      ).to();
  }

  /**
   * Fields:
   *   id: 5 digits
   *   description
   * @return {!Array<!Array<string>>}
   */
  subaccounts () {
    return this._subaccounts;
  }

  /**
   * @param {string} id
   * @param {string} description
   * @return {void}
   */
  subaccountsAdd (id, description) {
    this._subaccounts.push([id, description]);
  }

  /**
   * @param {string} id
   * @return {void}
   */
  subaccountsDel (id) {
    this._subaccounts = It.from(this._subaccounts)
      .filter(e => !e[0].startsWith(id)).to();
  }

  /**
   * @param {string} modifyId
   * @param {string} id
   * @param {string=} description
   * @return {void}
   */
  subaccountsMod (modifyId, id, description) {
    this._subaccounts = It.from(this._subaccounts)
      .map(e => e[0].startsWith(modifyId)
        ? [
            id + e[0].substring(id.length),
            description === undefined ? e[1] : description
          ]
        : e
      ).to();
    if (modifyId !== id) {
      this.planChangeAcc(modifyId, id);
    }
  }


  /** @return {!Array<!db_Dentry>} */
  diary () {
    return this._diary;
  }

  /**
   * Returns annotations number with entry plan 'entryPlan'
   * @param {string} entryPlan
   * @return {number}
   */
  planAnnotations (entryPlan) {
    return It.from(this._diary).reduce(0, (s, e) =>
      It.from(e.debits()).containsf(d => d.e1().startsWith(entryPlan)) ||
      It.from(e.credits()).containsf(c => c.e1().startsWith(entryPlan))
        ? s + 1 : s
    );
  }

  /**
   * Changes an account/group id by other
   * @param {string} id
   * @param {string} newId
   * @return {void}
   */
  planChangeAcc (id, newId) {
    It.from(this._diary).each(e => {
      It.from(e.debits()).each(d => {
        if (d.e1().startsWith(id)) {
          d.e1(newId + d.e1().substring(id.length));
        }
      });
      It.from(e.credits()).each(c => {
        if (c.e1().startsWith(id)) {
          c.e1(newId + c.e1().substring(id.length));
        }
      });
    });
  }

  /** @return {string} */
  serialize () {
    return JSON.stringify([
      this._subgroups,
      this._accounts,
      this._subaccounts,
      this._diary
    ]);
  }

  /**
   * @param {string} serial
   * @return {!Db}
   */
  static restore (serial) {
    if (serial === "") {
      const db = new Db([], [], [], []);
      db.subgroupsAdd("57", "Tesorería");
      db.accountsAdd("572", "Bancos, cuentas de ahorro, euros", "BABVI");
      db.subaccountsAdd("57201", "Bankia");
      return db;
    }
    const pars = /** @type {!Array<?>} */(JSON.parse(serial));
    return new Db (
      pars[0],
      pars[1],
      pars[2],
      pars[3]
    );
  }
}
