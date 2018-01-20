// Copyright 12-Nov-2017 ºDeme
// GNU General Public License - V3 <http://www.gnu.org/licenses/>

/**
 * Instalation requires pdfPrinter installed in /home/deme/bin
 */
goog.provide("Main");

goog.require("github_dedeme");
goog.require("I18n");
goog.require("Dom");
goog.require("Db");
goog.require("user_Expired");
goog.require("user_Auth");
goog.require("user_Chpass");
goog.require("view_Edit");
goog.require("view_Items");
goog.require("view_Exercises");
goog.require("view_Export");
goog.require("view_Backups");
goog.require("view_Settings");
goog.require("view_Bye");

Main = class {
  constructor () {
    /** @private */
    this._client = new Client(
      Main.app(),
      () => { new user_Expired(this).show(); }
    );
    /** @private */
    this._dom = new Dom(this);
    /** @private */
    this._db = null;
    /**
     * @private
     * @type {boolean}
     */
    this._endInterval = false;
    /**
     * @private
     * @type {!Array<string>}
     */
    this._trash = [];
  }

  /** @return {string} */
  static app () {
    return "Selectividad";
  }

  /** @return {string} */
  static version () {
    return "201801";
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

  /** @return {!Client} */
  client () {
    return this._client;
  }

  /** @return {!Dom} */
  dom () {
    return this._dom;
  }

  /** @return {!Db} */
  db () {
    if (this._db) {
      return this._db;
    }
    throw ("Data base has not been created");
  }

  /** @return {!Array<string>} */
  trash () {
    return this._trash;
  }

  /** @return {boolean} */
  endInterval () {
    return this._endInterval;
  }

  /**
   * @param {boolean} value
   * @return {void}
   */
  setEndInterval (value) {
    this._endInterval = value;
  }

  run () {
    const self = this;
    self._endInterval = true;
    const client = self._client;

    client.connect(ok => {
      if (ok) {
        let data = {"rq": "getDb"};
        client.send(data, rp => {
          self._trash = rp["trash"];
          self._db = new Db(
            /** @type {!Object<string, ?>} */ (JSON.parse(rp["db"])
          ));
          const db = self._db;

          db.language() === "es" ? I18n.es() : I18n.en();

          if (client.user() === "alumno") {
            throw("Page '" + db.page() + "' is unknown");
          } else {
            switch (db.page()) {
              case "edit":
                new view_Edit(self).show();
                break;
              case "items":
                new view_Items(self).show();
                break;
              case "exercises":
                new view_Exercises(self).show();
                break;
              case "export":
                new view_Export(self).show();
                break;
              case "backups":
                new view_Backups(self).show();
                break;
              case "settings":
                new view_Settings(self).show();
                break;
              default:
                throw("Page '" + db.page() + "' is unknown");
            }
          }
        });
      } else {
        new user_Auth(self, self._client).show();
      }
    });
  }

  // server ----------------------------

  /**
   * @param {function():void} f
   * @return {void}
   */
  sendDb (f) {
    const db = this.db();
    const data = {"rq": "setDb", "db": JSON.stringify(db.serialize())};
    this._client.send(data, rp => { f(); });
  }

  /**
   * @param {string} target
   * @return {void}
   */
  go (target) {
    const self = this;
    self.db().setPage(target);
    self.sendDb(() => { self.run(); });
  }

  /**
   * @return {void}
   */
  bye () {
    const self = this;
    const data = {"rq" : "logout"};
    self._client.send(data, rp => { new view_Bye(self).show(); });
  }

  /** @return {void} */
  changeLanguage () {
    const self = this;
    const db = self._db;
    db.setLanguage(db.language() === "en" ? "es" : "en");
    self.sendDb(() => { self.run(); });
  }

  /** @return {void} */
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

  /**
   * Downloads a backup
   * @param {function(string):void} action This callback passes the name of
   *  backup file.
   * @return {void}
   */
  backupDownload (action) {
    const data = {"rq": "backup"};
    this._client.send(data, rp => { action(rp["name"]); });
  }

  /**
   * Restores a backup
   * @param {*} file
   * @param {function(number):void} progress
   */
  backupRestore (file, progress) {
    const self = this;
    const step = 25000;
    let start = 0;

    const reader = new FileReader();
    reader.onerror/**/ = evt => {
      alert(_args(_("'%0' can not be read"), file.name/**/));
      const data = {"rq": "restoreAbort"};
      this._client.send(data, () => {
        new view_Backups(self).show();
      });
    }
    reader.onloadend/**/ = evt => {
      if (evt.target/**/.readyState/**/ === FileReader.DONE/**/) { // DONE == 2
        const bindata = new Uint8Array(evt.target/**/.result/**/);
        progress(start);
        if (bindata.length > 0) {
          const data = {
            "rq": "restoreAppend",
            "data": B64.encodeBytes(bindata)
          };
          this._client.send(data, rp => {
            start += step;
            var blob = file.slice(start, start + step);
            reader.readAsArrayBuffer(blob);
          });
        } else {
          progress(file.size/**/);
          const data = {"rq": "restoreEnd"};
          this._client.send(data, (rp) => {
            const fail = rp["fail"];
            if (fail === "restore:unzip") {
              alert(_("Fail unzipping backup"));
            } else if (fail === "restore:version") {
              alert(_("File is not a Selectividad backup"));
            }
            self.run();
          });
        }
      }
    };

    function append() {
      var blob = file.slice(start, start + step);
      reader.readAsArrayBuffer(blob);
    }

    const data = {"rq": "restoreStart"};
    this._client.send(data, () => {
      append();
    });
  }

  /** @return {void} */
  clearTrash () {
    const self = this;
    const data = {"rq": "clearTrash"};
    this._client.send(data, () => {
      self.run();
    });
  }

  /**
   * @param {string} f
   * @return {void}
   */
  restoreTrash (f) {
    const self = this;
    const data = {"rq": "restoreTrash", "file": f};
    this._client.send(data, () => {
      self.run();
    });
  }

  /**
   * @param {string} id
   * @param {string} tx
   */
  setExam(id, tx) {
    const self = this;
    this._db.setExam(id, tx);
    self.sendDb(() => { self.run(); });
  }

  /**
   * @param {string} id
   */
  delExam(id) {
    const self = this;
    this._db.delExam(id);
    self.sendDb(() => { self.run(); });
  }

  /**
   * @param {string} id
   * @param {!Array<?>} tps Array<?> is [exaId:str, exIx:number]
   * @param {number} cut
   */
  setExercise(id, tps, cut) {
    const self = this;
    this._db.setExercise(id, tps, cut);
    self.sendDb(() => { self.run(); });
  }

  /**
   * @param {string} id
   */
  delExercise(id) {
    const self = this;
    this._db.delExercise(id);
    self.sendDb(() => { self.run(); });
  }

  /**
   * @param {string} id
   * @param {!Array<?>} tps Array<?> is [exaId:str, exIx:number]
   * @param {number} cut
   * @param {function():void} f
   * @return {void}
   */
  printExercise(id, tps, cut, f) {
    const self = this;
    let ix = 1;
    const tx = "<body style='font-family:times;font-size:10pt'>" +
      "<h2 style='text-align:center'>Selectividad<br/><small>" +
      id + "</small></h2>" +
      It.from(tps).reduce("", (s, tp) =>
        s + "<p style='" +
          (ix === cut ? "page-break-before: always" : "") +
          "'><hr /><br />" +
          "<b>" + ix++ + ".</b> <small>" + tp[0] + "</small></p>" +
          self._db.exas()[tp[0]][tp[1]][0]
      ) +
      "<p><hr /></p></body>";
    const data = {"rq": "printExercise", "tx" : tx};
    this._client.send(data, () => {
      f();
    });
  }
}
new Main().run();

