//- dm/dm.js
/*
 * Copyright 05-Feb-2017 ºDeme
 * GNU General Public License - V3 <http://www.gnu.org/licenses/>
 */
/*global dm */

/**
 * This class should be used:
 *   1. Creating o generating a file like:
 *        const i18nData = {
 *          "en" : {
 *            "Change" : "Change",
 *            ...
 *            "end" : "end"
 *          },
 *          "es" : {
 *            "Change" : "Cambiar",
 *            ...
 *            "end" : "fin"
 *          }
 *        };
 *   2. When a application is started it is necessary to call 'init()':
 *     ...
 *     i18n.init(model.lang === "es" ? i18nData.es : i18nData.en);
 *     ...
 *   3. Afther that it is possible to call '_()'.
 * 'format()' is a helper function for working with templates.
 */

(() => {

  dm.i18n = {};
  const i18n = dm.i18n;

  // Obj<str, str>
  let dic = {};

  /// Initializes dictionary
  //# Obj<str, str> -
  i18n.init = d => {
    dic = d;
  };

  /// Helper function for working with templates
  //# str - Arr<str> - str
  i18n.format = (template, args) => {
    let bf = "";
    let isCode = false;
    for (let ix = 0; ix < template.length; ++ix) {
      const ch = template.charAt(ix);
      if (isCode) {
        bf += (ch >= "0" && ch <= "9")
          ? args[+ch]
          : ch === "%"
            ? "%"
            : "%" + ch;
        isCode = false;
      } else {
        if (ch === "%") isCode = true;
        else bf += ch;
      }
    }
    return bf;
  };

  /// Call to dictionary
  //# str - str
  i18n._ = key => {
    const v = dic[key];
    return v === undefined ? key : v;
  };

})();


