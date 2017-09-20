// Copyright 13-Sep-2017 ºDeme
// GNU General Public License - V3 <http://www.gnu.org/licenses/>

goog.provide("Chpass");

goog.require("Global");
goog.require("Conf");
goog.require("I18n");
goog.require("ChpassV");

Chpass = class {
  run () {
    const self = this;
    let client = Global.client();
    client.connect((ok) => {
      if (ok) {
        let data = {"page": "Chpass", "rq": "get"};
        client.send(data, rp => {
          const conf = Conf.restore(rp["conf"]);
          if (conf.lang() === "es") I18n.es(); else I18n.en();
          Global.setLanguage(conf.lang());
          conf.setPath("");

          data = {"page": "Chpass", "rq": "setConf", "conf": conf.serialize()}
          client.send(data, _rp => {
            new ChpassV(self).show();
          });
        });
      } else {
        location.assign("../Auth/index.html");
      }
    });
  }

  /**
   * Accept button pressed
   * @param {string} pass
   * @param {string} newPass
   * @param {string} newPass2
   * @return {void}
   */
  accept (pass, newPass, newPass2) {
    const View = ChpassV;
    if (pass === "") {
      alert(_("Current password is missing"));
      View.pass().value("");
      View.pass().e().focus();
      return;
    }
    if (newPass === "") {
      alert(_("New password is missing"));
      View.newPass().value("");
      View.newPass().e().focus();
      return;
    }
    if (newPass2 === "") {
      alert(_("Confirm password is missing"));
      View.newPass2().value("");
      View.newPass2().e().focus();
      return;
    }
    if (newPass !== newPass2) {
      alert(_("New password and confirm password do not match"));
      View.newPass().value("");
      View.newPass2().value("");
      View.newPass().e().focus();
      return;
    }

    const client = Global.client();
    let data = {
      "page": "Chpass",
      "rq": "change",
      "user": client.user(),
      "pass": Client.crypPass(pass),
      "newPass": Client.crypPass(newPass)
    };
    client.send(data, rp => {
      const View = ChpassV;
      if (rp["ok"]) {
        View.captcha().resetCounter();
        alert(_("Password successfully changed"));
        location.assign("../Paths/index.html");
      } else {
        View.captcha().incCounter();
        location.assign("");
      }
    })
  }
}
new Chpass().run();

