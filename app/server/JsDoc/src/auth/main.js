//- dm/i18n.js
//- dm/cryp.js
//- auth/auth.js
//- auth/model.js
//- auth/view.js
/*
 * Copyright 19-Feb-2017 ºDeme
 * GNU General Public License - V3 <http://www.gnu.org/licenses/>
 */
/*global dm, auth, app, alert */

(() => {
  const model = auth.model;
  const view = auth.view;
  const global = app.global;
  const cryp = dm.cryp;
  const _ = dm.i18n._;

  const client = global.client();
  const control = {};
  auth.control = control;

  //#
  control.changeLanguage = () => {
    global.changeLanguage();
    model.lang = global.getLanguage();
    main();
  };

  //# Accept button pressed
  control.accept = () => {
    if (model.user === "") {
      alert(_("User name is missing"));
      return;
    }
    if (model.pass === "") {
      alert(_("Password is missing"));
      return;
    }
    client.authSend(
      "auth/index.js",
      "authentication",
      {
        "user" : model.user,
        "pass" : cryp.key(model.pass, 120),
        "persistent" : model.persistent
      },
      () => {
        alert(client.level); // eslint-disable-line
      }
    );
  };

  //# -
  function main () {
    global.initLanguage();
    view.show();
  }

  main();
})();
