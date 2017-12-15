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
goog.require("FleasData");
goog.require("user_Expired");
goog.require("user_Auth");
goog.require("user_Chpass");
goog.require("view_Backups");
goog.require("view_Settings");
goog.require("view_Bye");
goog.require("view_Run");
goog.require("view_Bests");
goog.require("view_Statistics");
goog.require("view_Trace");

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
    this._view = null
    /** @private */
    this._db = null;
    /**
     * @private
     * @type {FleasData}
     */
    this._fleasData = null;
  }

  /** @return {string} */
  static app () {
    return "FleasData";
  }

  /** @return {string} */
  static version () {
    return "201712";
  }

  /** @return {number} */
  static maxQuotes () {
    return 550;
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

  /** @return {!FleasData} */
  fleasData () {
    if (this._fleasData === null) {
      throw ("fleasData is null");
    }
    return this._fleasData;
  }

  run2 () {
    const self = this;

    let data = {"rq": "getDb"};
    self._client.send(data, rp => {
      self._db = Db.restore(
        /** @type {!Object<string, ?>} */ (JSON.parse(rp["db"]))
      );
      const db = self._db;
      db.language() === "es" ? I18n.es() : I18n.en();

      switch (db.page()) {
        case "run":
          self._view = new view_Run(self);
          break;
        case "bests":
          self._view = new view_Bests(self);
          break;
        case "statistics":
          self._view = new view_Statistics(self);
          break;
        case "trace":
          self._view = new view_Trace(self);
          break;
        case "backups":
          self._view = new view_Backups(self);
          break;
        case "settings":
          self._view = new view_Settings(self);
          break;
        default:
          throw("Page '" + db.page() + "' is unknown");
      }
      self._view.show();
    });
  }

  run () {
    const self = this;

    self._client.connect(ok => {
      if (ok) {
        self.readLastModification(time => {
          self.readFleasData(0, d => {
            self._fleasData = FleasData.restore(self, time, d);
            self.run2();
          });
        });
      } else {
        new user_Auth(self, self._client).show();
      }
    });
  }

  /**
   * @param {function(number):void} f 'f' has the string read as argument.
   * @return {void}
   */
  readLastModification (f) {
    const self = this;
    const data = {"rq": "fleasDataTime"};
    self._client.send(data, rp => {
      const time = /** @type {number} */ (rp["time"])
      f(time);
    });
  }

  /**
   * @param {number} time LastModification of server file
   * @param {function(string):void} f 'f' has the string read as argument.
   * @return {void}
   */
  readFleasData (time, f) {
    const self = this;
    let s = "";
    function getData(ix) {
      const data = {"rq": "fleasData", "time": time, "ix": ix};
      self._client.send(data, rp => {
        const newTime = rp["restart"];
        if (newTime !== 0 ) {
          self.readFleasData(newTime, f);
        } else {
          const data = rp["data"];
          if (data !== "") {
            s += data;
            getData(ix + 1);
          } else {
            f(s);
          }
        }
      })
    }
    getData(0);
  }

  /**
   * @param {function():void} f
   * @return {void}
   */
  sendDb (f) {
    const self = this;
    const db = self.db();
    const data = {"rq": "setDb", "db": JSON.stringify(db.serialize())};
    self._client.send(data, rp => {
      f();
    });
  }

  /**
   * @param {string} target
   * @return {void}
   */
  go (target) {
    const self = this;
    switch (self.db().page()) {
      case "bests":
        console.log("clearInterval");
        clearInterval(self._view.interval());
    }
    self.db().setPage(target);
    self.sendDb(() => { self.run2(); });
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
    self.sendDb(() => { self.run2(); });
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
        self.run2();
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

  /**
   * Changes the bests id
   * @param {string} id
   * @return {void}
   */
  setBestsId (id) {
    const self = this;
    self._db.setBestsId(id);
    self.sendDb(() => { self.run2(); })
  }
}
new Main().run();

