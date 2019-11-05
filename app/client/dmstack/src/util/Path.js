// Copyright 03-Oct-2019 ºDeme
// GNU General Public License - V3 <http://www.gnu.org/licenses/>

/** Path utilities. */
export default class Path {
  /**
    @param {string} path
    @return {string} canonical path.
  **/
  static canonical (path) {
    function n (s) {
      return s.replace(/\/+/g, "/")
        .replace(/\w+\/+\.\./g, "")
        .replace(/\/\.\//g, "/");
    }
    let sPath = "";
    while (sPath !== path) {
      sPath = n(path);
      path = n(sPath);
    }
    return ("./" + path.replace(/^\//, "")
      .replace(/^\.\//g, "").replace(/\/$/, "")
    ).replace(/^\.\/\.\.\//g, "../");
  }

  /**
    @param {!Array<string>} paths
    @return {string} 'paths' joined with "/".
  **/
  static cat (paths) {
    const r = paths.join("/");
    return r.charAt(0) === "/" ? r.substring(1, r.length) : r;
  }

  /**
    @param {string} path
    @return {string} path parent.
  **/
  static parent (path) {
    while (path.startsWith("/")) path = path.substring(1);

    const ix = path.lastIndexOf("/");
    if (ix === -1) return "./";
    return path.substring(0, ix);
  }

  /**
    @param {string} path
    @return {string} path name plus extension.
  **/
  static name (path) {
    while (path.startsWith("/")) path = path.substring(1);

    const ix = path.lastIndexOf("/");
    if (ix === -1) return path;
    return path.substring(ix + 1);
  }

  /**
    @param {string} path
    @return {string} path extension with ".".
  **/
  static extension (path) {
    const n = Path.name(path);
    const ix = n.lastIndexOf(".");
    if (ix === -1) return "";
    return n.substring(ix);
  }

  /**
    @param {string} path
    @return {string} path name without extension.
  **/
  static onlyName (path) {
    const n = Path.name(path);
    const ix = n.lastIndexOf(".");
    if (ix === -1) return n;
    return n.substring(0, ix);
  }

}
