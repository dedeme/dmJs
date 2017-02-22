//- app/global.js
//- auth/auth.js
/*
 * Copyright 22-Feb-2017 ºDeme
 * GNU General Public License - V3 <http://www.gnu.org/licenses/>
 */
/*global auth */

(() => {
  const model = {
    lang : app.global.getLanguage()
  };
  auth.model = model;

})();

