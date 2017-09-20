// Copyright 09-Sep-2017 ºDeme
// GNU General Public License - V3 <http://www.gnu.org/licenses/>

goog.provide("PathsM");

goog.require("Path");

PathsM = class {

  /**
   * @param {!Conf} conf
   * @param {!Array<!Path>} paths
   */
  constructor (conf, paths) {
    /**
     * @const {!Conf}
     * @private
     */
    this._conf = conf;
    /**
     * @const {!Array<!Path>}
     * @private
     */
    this._paths = paths;
  }

  /** @return {!Conf} */
  conf () {
    return this._conf;
  }

  /** @return {!Array<!Path>} */
  paths () {
    return this._paths;
  }

  /** @return {string} */
  selected () {
    let path = this._conf.path();
    let ix = path.indexOf("@");
    return ix === -1 ? "" : path.substring(0, ix);
  }

  /**
   * @private
   * @param {string} value
   */
  setSelected (value) {
    throw("selected is read only");
  }

  /**
   * @param {string} id
   * @return {string}
   */
  validateId (id) {
    return id == ""
      ? _("Name is missing")
      : id.indexOf("=") !== -1
        ? _args(_("Name '%0' contains '%1'"), id, "=")
        : id.indexOf("@") !== -1
          ? _args(_("Name '%0' contains '%1'"), id, "@")
          : id.indexOf("/") !== -1
            ? _args(_("Name '%0' contains '%1'"), id, "/")
            : id.indexOf(" ") !== -1
              ? _args(_("Name '%0' contains blanks"), id)
              : It.from(this._paths).containsf(p => p.id() === id)
                ? _args(_("Name '%0' is repeated"), id)
                : "";
  };

  /**
   * @param {string} path
   * @return {string}
   */
  validatePath (path) {
    return path == ""
      ? _("Path is missing")
      : "";
  };

  /**
   * @return {string}
   */
  pathsToJson () {
    return JSON.stringify(It.from(this.paths()).map(p => p.serialize()).to());
  }

  /**
   * @param {string} json
   * @return {!Array<!Path>}
   */
  static pathsFromJson (json) {
    if (json === "") {
      return [];
    }
    let data = /** @type {!Array<!Array<?>>} */(JSON.parse(json))
    return It.from(data).map(s => Path.restore(s)).to()
  }

}
