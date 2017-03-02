//- app/com/fields.js
//- conf/conf.js
/*
 * Copyright 01-Mar-2017 ºDeme
 * GNU General Public License - V3 <http://www.gnu.org/licenses/>
 */
/* global dm, conf */

(() => {
  const It = dm.It;

  class ListEntry {
  }
  conf.ListEntry = ListEntry;

  class Model {
    //# ConfEntry - [PathsData] - Model
    constructor (conf, paths) {
      this._conf = conf;
      this._paths = paths;
    }
    //# ConfEntry
    get conf () { return this._conf; }
    //# It<PathsData>
    get paths () { return It.from(this._paths); }

  }
  conf.Model = Model;

})();


