// Copyright 23-Sep-2017 ºDeme
// GNU General Public License - V3 <http://www.gnu.org/licenses/>

goog.provide("Main");

goog.require("github.dedeme");
goog.require("I18n");
goog.require("Dom");
goog.require("user_Expired");
goog.require("user_Auth");
goog.require("user_Chpass");
goog.require("Conf");
goog.require("Db");
goog.require("view_Settings");
goog.require("view_Bye");
goog.require("view_Plan");

{
  /** @const {string} */
  const app = "Hconta";
  /** @const {string} */
  const version = "201709";
  /** @const {string} */
  const langStore = app + "__lang";
  /** @const {string} */
  const captchaAuthStore = app + "__captcha";
  /** @const {string} */
  const captchaChpassStore = app + "__captchaCh";

  /** @type {Client} */
  let client = null;

Main = class {
  /** @return {string} */
  static app () {
    return app;
  }

  /** @return {string} */
  static version () {
    return version;
  }

  /** @return {string} */
  static langStore () {
    return langStore;
  }

  /** @return {string} */
  static captchaAuthStore () {
    return captchaAuthStore;
  }

  /** @return {string} */
  static captchaChpassStore () {
    return captchaChpassStore;
  }

  /** @return {!Client} */
  static client () {
    if (client === null) {
      throw("Client is null");
    }
    return client;
  }

  static run () {
    client = new Client(
      app,
      user_Expired.show/**/
    );
    client.connect(ok => {
      if (ok) {
        let data = {"rq": "getConf"};
        client.send(data, rp => {
          Conf.restore(rp["conf"]);
          Conf.language() === "es" ? I18n.es() : I18n.en();
          let data = {"rq": "getActions", "year": "" + Conf.year()};
          client.send(data, rp => {
            Db.restore(rp["actions"]);
            switch(Conf.page()) {
            case "settings":
              view_Settings.show();
              break;
            case "plan":
              view_Plan.show();
              break;
            default:
              throw("Page '" + Conf.page() + "' is unknown");
            }
          })
        });
      } else {
        user_Auth.show(captchaAuthStore);
      }
    });
  }

  // server ----------------------------
  /**
   * @private
   * @param {function():void} f
   * @return {void}
   */
  static sendConf (f) {
    const data = {"rq": "setConf", "conf": Conf.serialize()};
    Main.client().send(data, rp => { f(); });
  }

  /**
   * @private
   * @param {function():void} f
   * @return {void}
   */
  static sendActions (f) {
    const data = {
      "rq": "setActions",
      "year": "" + Conf.year(),
      "actions": Db.serialize()
    };
    Main.client().send(data, rp => { f(); });
  }

  // menu ------------------------------
  /**
   * @return {void}
   */
  static bye () {
    const data = {"rq": "logout"};
    Main.client().send(data, rp => { view_Bye.show(); });
  }

  /**
   * @param {string} page
   * @return {void}
   */
  static go (page) {
    Conf.setPage(page);
    Main.sendConf(Main.run/**/);
  }

  // plan ------------------------------

  /**
   * @param {string} id
   * @return {void}
   */
  static planGo (id) {
    Conf.setPlanId(id);
    Main.sendConf(Main.run/**/);
  }

  /**
   * Adds an entry to plan
   * @param {string} id
   * @param {string} description
   * @param {string=} summary
   * @return {void}
   */
  static planAdd (id, description, summary) {
    const lg = id.length;
    let action = db_Action.mkAddSubaccount(id, description);
    switch (lg) {
      case 2 :
        action = db_Action.mkAddSubgroup(id, description);
        break;
      case 3 :
        if (summary === undefined) {
          throw("summary is undefined");
        }
        action = db_Action.mkAddAccount(id, summary, description);
        break;
    }
    Db.actions().push(action);
    Main.sendActions(() => {
      db_Action.process(action);
      view_Plan.show();
    });
  }

  /**
   * Deletes an entry in plan
   * @param {string} id
   * @return {void}
   */
  static planDel (id) {
    const lg = id.length;
    let action = db_Action.mkDelSubaccount(id)
    switch (lg) {
      case 2 :
        action = db_Action.mkDelSubgroup(id);
        break;
      case 3 :
        action = db_Action.mkDelAccount(id);
        break;
    }
    Db.actions().push(action);
    Main.sendActions(() => {
      db_Action.process(action);
      view_Plan.show();
    });
  }

  // settings --------------------------
  /**
   * @return {void}
   */
  static changeLang () {
    Conf.setLanguage(Conf.language() === "es" ? "en" : "es");
    Main.sendConf(Main.run/**/);
  }

  /**
   * @return {void}
   */
  static changePassPage () {
    user_Chpass.show(captchaChpassStore);
  }

  /**
   * @param {string} pass
   * @param {string} newPass
   * @param {function(boolean):void} f Function to manage captcha counter.
   * @return {void}
   */
  static changePass (pass, newPass, f) {
    const data = {
      "rq": "chpass",
      "user": "admin",
      "pass": Client.crypPass(pass),
      "newPass": Client.crypPass(newPass)
    };
    Main.client().send(data, rp => {
      const ok = rp["ok"];
      f(ok);
      if (ok) {
        alert(_("Password successfully changed"));
        Main.run();
      } else {
        Main.changePassPage();
      }
    });
  }

}}
Main.run();

