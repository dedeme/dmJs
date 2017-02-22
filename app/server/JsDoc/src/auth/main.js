//- dm/i18n.js
//- auth/auth.js
//- auth/model.js
//- auth/view.js
/*
 * Copyright 19-Feb-2017 ºDeme
 * GNU General Public License - V3 <http://www.gnu.org/licenses/>
 */
/*global auth */

(() => {
  const model = auth.model;
  const view = auth.view;

  const control = {};
  auth.control = control;

  //#
  control.changeLanguage = () => {
    app.global.changeLanguage();
    model.lang = app.global.getLanguage();
    main();
  }

  //# -
  function main () {
    app.global.initLanguage();
    view.show();
  }

  main();
})();
