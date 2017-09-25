// Copyright 24-Sep-2017 ºDeme
// GNU General Public License - V3 <http://www.gnu.org/licenses/>

goog.provide("Db");

goog.require("db_Action");

{
  /** @const {!Array<!Array<string>>} */
  const groups = [
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
  /** @type {Array<!Array<string>>} */
  let subgroups = null;
  /** @type {Array<!Array<string>>} */
  let accounts = null;
  /** @type {Array<!Array<string>>} */
  let subaccounts = null;
  /** @type {Array<!db_Dentry>} */
  let diary = null;
  /** @type {Array<string>} */
  let actions = null;
  /** @type {number} */
  let diaryId = 0;


Db = class {

  /**
   * Fields:
   *   id: 1 digit
   *   description
   * @return {!Array<!Array<string>>}
   */
  static groups () {
    if (groups === null) {
      throw("groups is null");
    }
    return groups;
  }

  /**
   * Fields:
   *   id: 2 digits
   *   description
   * @return {!Array<!Array<string>>}
   */
  static subgroups () {
    if (subgroups === null) {
      throw("subgroups is null");
    }
    return subgroups;
  }

  /**
   * @param {!Array<string>} row
   * @return {void}
   */
  static subgroupsAdd (row) {
    subgroups.push(row);
  }

  /**
   * @param {string} id
   * @return {void}
   */
  static subgroupsDel (id) {
    subgroups = It.from(Db.subgroups()).filter(e => e[0] !== id).to();
    accounts = It.from(Db.accounts()).filter(e => !e[0].startsWith(id)).to();
    subaccounts = It.from(Db.subaccounts())
      .filter(e => !e[0].startsWith(id)).to();
  }

  /**
   * Fields:
   *   id: 3 digits
   *   summary: Place in Balance or PyG
   *   description
   * @return {!Array<!Array<string>>}
   */
  static accounts () {
    if (accounts === null) {
      throw("accounts is null");
    }
    return accounts;
  }

  /**
   * @param {!Array<string>} row
   * @return {void}
   */
  static accountsAdd (row) {
    accounts.push(row);
  }

  /**
   * @param {string} id
   * @return {void}
   */
  static accountsDel (id) {
    accounts = It.from(Db.accounts()).filter(e => e[0] !== id).to();
    subaccounts = It.from(Db.subaccounts())
      .filter(e => !e[0].startsWith(id)).to();
  }

  /**
   * Fields:
   *   id: 5 digits
   *   description
   * @return {!Array<!Array<string>>}
   */
  static subaccounts () {
    if (subaccounts === null) {
      throw("subaccounts is null");
    }
    return subaccounts;
  }

  /**
   * @param {!Array<string>} row
   * @return {void}
   */
  static subaccountsAdd (row) {
    subaccounts.push(row);
  }

  /**
   * @param {string} id
   * @return {void}
   */
  static subaccountsDel (id) {
    subaccounts = It.from(Db.subaccounts()).filter(e => e[0] !== id).to();
  }

  /** @return {!Array<!db_Dentry>} */
  static diary () {
    if (diary === null) {
      throw("diary is null");
    }
    return diary;
  }

  /** @return {!Array<string>} */
  static actions () {
    if (actions === null) {
      throw("actions is null");
    }
    return actions;
  }

  /** @return {number} */
  static diaryId () {
    return diaryId;
  }

  /**
   * @param {number} value
   * @return {void}
   */
  static setDiaryId (value) {
    diaryId = value;
  }

  /**
   * Incrementes diaryId and returns the result.
   * @return {number}
   */
  static incDiaryId () {
    ++diaryId;
    return diaryId;
  }

  /**
   * Serializes actions.
   * @return {string}
   */
  static serialize () {
    return actions.join("\n");
  }

  /**
   * Restores actions
   * @param {string} serial
   * @return {void}
   */
  static restore (serial) {
    subgroups = [];
    accounts = [];
    subaccounts = [];
    diary = [];
    diaryId = 0;

    if (serial !== "") {
      actions = serial.split("\n");
    } else {
      actions = [
        db_Action.mkAddSubgroup("57", "Tesorería"),
        db_Action.mkAddAccount(
          "572", "BABVI", "Bancos, cuentas de ahorro, euros"),
        db_Action.mkAddSubaccount("57201", "Bankia")
      ];
    }
    It.from(Db.actions()).each(a => { db_Action.process(a); });
  }

}}
