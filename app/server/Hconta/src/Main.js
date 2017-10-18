// Copyright 23-Sep-2017 ºDeme
// GNU General Public License - V3 <http://www.gnu.org/licenses/>

goog.provide("Main");

goog.require("github_dedeme");
goog.require("I18n");
goog.require("Dom");
goog.require("user_Expired");
goog.require("user_Auth");
goog.require("user_Chpass");
goog.require("Conf");
goog.require("Db");
goog.require("view_Bye");
goog.require("view_Diary");
goog.require("view_Cash");
goog.require("view_Plan");
goog.require("view_Settings");

Main = class {
  constructor () {
    /**
     * @private
     * @type {Db}
     */
    this._db = null;
    /**
     * @private
     * @type {Conf}
     */
    this._conf = null;
    /** @private */
    this._client = new Client(
      Main.app(),
      () => { new user_Expired(this).show(); }
    );
    /** @private */
    this._dom = new Dom(this);
  }

  /** @return {string} */
  static app () {
    return "Hconta";
  }

  /** @return {string} */
  static version () {
    return "201709";
  }

  /** @return {string} */
  static langStore () {
    return Main.app() + "__lang";
  }

  /** @return {string} */
  static captchaAuthStore () {
    return Main.app() + "__captcha";
  }

  /** @return {string} */
  static captchaChpassStore () {
    return Main.app() + "__captchaCh";
  }

  /** @return {!Db} */
  db () {
    if (this._db === null) {
      throw ("db is null");
    }
    return this._db;
  }

  /** @return {!Conf} */
  conf () {
    if (this._conf === null) {
      throw ("conf is null");
    }
    return this._conf;
  }

  /** @return {!Dom} */
  dom () {
    return this._dom;
  }

  run () {
    const self = this;
    const client = self._client;
    client.connect(ok => {
      if (ok) {
        let data = {"rq": "getConf"};
        client.send(data, rp => {
          self._conf = Conf.restore(rp["conf"]);
          const conf = self._conf;
          conf.language() === "es" ? I18n.es() : I18n.en();
          let data = {"rq": "getDb", "year": "" + conf.year()};
          client.send(data, rp => {
            self._db = Db.restore(rp["actions"]);
            switch(conf.page()) {
            case "diary":
              new view_Diary(self).show();
              break;
            case "cash":
              new view_Cash(self).show();
              break;
            case "plan":
              new view_Plan(self).show();
              break;
            case "settings":
              new view_Settings(self).show();
              break;
            default:
              throw("Page '" + conf.page() + "' is unknown");
            }
          })
        });
      } else {
        new user_Auth(self, self._client).show();
      }
    });
  }

  // server ----------------------------
  /**
   * @private
   * @param {function():void} f
   * @return {void}
   */
  sendConf (f) {
    const data = {"rq": "setConf", "conf": this.conf().serialize()};
    this._client.send(data, rp => { f(); });
  }

  /**
   * @private
   * @param {function():void} f
   * @return {void}
   */
  sendDb (f) {
    const data = {
      "rq": "setDb",
      "year": "" + this.conf().year(),
      "db": this.db().serialize()
    };
    this._client.send(data, rp => { f(); });
  }

  // menu ------------------------------
  /**
   * @return {void}
   */
  bye () {
    const self = this;
    const data = {"rq": "logout"};
    self._client.send(data, rp => { new view_Bye(self).show(); });
  }

  /**
   * @param {string} page
   * @return {void}
   */
  go (page) {
    const self = this;
    self.conf().setPage(page);
    self.sendConf(() => { self.run(); });
  }

  // diary -----------------------------

  /**
   * Sets account for help in 'conf.db'.
   * @param {string} accId
   * @param {function ():void} f
   * @return {void}
   */
  setDiaryId (accId, f) {
    this.conf().setDiaryId(accId);
    this.sendConf(f);
  }

  /**
   * Sets index of position in diary list
   * @param {number} ix
   * @param {function():void} f
   * @return {void}
   */
  setDiaryIx (ix, f) {
    this.conf().setDiaryIx(ix);
    this.sendConf(f);
  }

  /**
   * Sets number of items in diary list
   * @param {number} len
   * @param {function():void} f
   * @return {void}
   */
  setDiaryListLen (len, f) {
    this.conf().setDiaryListLen(len);
    this.sendConf(f);
  }

  /**
   * @param {!db_Dentry} entry
   * @return {void}
   */
  addDentry (entry) {
    const self = this;
    self.conf().setDiaryIx(self.db().diaryAdd(entry));
    self.sendDb(() => {
      self.sendConf(() => { new view_Diary(self).show(); });
    });
  }

  /**
   * @param {number} ix Number of annotations (its order number is ix - 1)
   * @param {function():void} f
   * @return {void}
   */
  delDentry (ix, f) {
    const self = this;
    self.db().diaryDel(ix);
    self.sendDb(f);
  }

  /**
   * @param {number} ix Number of annotations (its order number is ix - 1)
   * @param {!db_Dentry} entry
   * @return {void}
   */
  modifyDentry (ix, entry) {
    const self = this;
    self.db().diaryModify(ix, entry);
    self.sendDb(() => { new view_Diary(self).show(); });
  }

  // plan ------------------------------

  /**
   * @param {string} id
   * @return {void}
   */
  planGo (id) {
    const self = this;
    self.conf().setPlanId(id);
    self.sendConf(() => { self.run(); });
  }

  /**
   * Adds an entry to plan
   * @param {string} id
   * @param {string} description
   * @param {string=} summary
   * @return {void}
   */
  planAdd (id, description, summary) {
    const self = this;
    const db = self.db();
    const lg = id.length;
    switch (lg) {
      case 2:
        db.subgroupsAdd(id, description);
        break;
      case 3:
        if (summary === undefined) {
          throw("summary is undefined");
        }
        db.accountsAdd(id, description, summary);
        break;
      default:
         db.subaccountsAdd(id, description);
    }

    self.sendDb(() => {
      new view_Plan(self).show();
    });
  }

  /**
   * Adds an entry to plan
   * @param {string} modifyId
   * @param {string} id
   * @param {string} description
   * @param {string=} summary
   * @return {void}
   */
  planMod (modifyId, id, description, summary) {
    const self = this;
    const db = self.db();
    const lg = id.length;

    db.planChangeAcc(modifyId, id);

    switch (lg) {
      case 2:
        db.subgroupsMod(modifyId, id, description);
        break;
      case 3:
        if (summary === undefined) {
          throw("summary is undefined");
        }
        db.accountsMod(modifyId, id, description, summary);
        break;
      default:
         db.subaccountsMod(modifyId, id, description);
    }

    self.sendDb(() => {
      new view_Plan(self).show();
    });
  }

  /**
   * Deletes an entry in plan
   * @param {string} id
   * @return {void}
   */
  planDel (id) {
    const self = this;
    const db = self.db();
    const lg = id.length;
    switch (lg) {
      case 2:
        db.subgroupsDel(id);
        break;
      case 3:
        db.accountsDel(id);
        break;
      default:
         db.subaccountsDel(id);
    }

    self.sendDb(() => {
      new view_Plan(self).show();
    });
  }

  // settings --------------------------
  /**
   * @return {void}
   */
  changeLang () {
    const self = this;
    self.conf().setLanguage(self.conf().language() === "es" ? "en" : "es");
    self.sendConf(() => { self.run(); });
  }

  /**
   * @return {void}
   */
  changePassPage () {
    new user_Chpass(this).show();
  }

  /**
   * @param {string} pass
   * @param {string} newPass
   * @param {function(boolean):void} f Function to manage captcha counter.
   * @return {void}
   */
  changePass (pass, newPass, f) {
    const self = this;
    const data = {
      "rq": "chpass",
      "user": "admin",
      "pass": Client.crypPass(pass),
      "newPass": Client.crypPass(newPass)
    };
    self._client.send(data, rp => {
      const ok = rp["ok"];
      f(ok);
      if (ok) {
        alert(_("Password successfully changed"));
        self.run();
      } else {
        self.changePassPage();
      }
    });
  }

}
new Main().run();

