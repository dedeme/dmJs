/*
 * Copyright 25-Feb-2017 ºDeme
 * GNU General Public License - V3 <http://www.gnu.org/licenses/>
 */

var fields = {}; // eslint-disable-line

(function () {
  "use strict"; // eslint-disable-line

  var ConfEntry;
  var PathsEntry;
  var PathsData;
  var ConfData;

  var serialize = function (a) {
    var r = [];
    var i;
    for (i = 0; i < a.length; ++i) {
      r.push(a[i].serialize());
    }
    return r;
  };

  var restore = function (s, fr) {
    var r = [];
    var i;
    for (i = 0; i < s.length; ++i) {
      r.push(fr(s[i]));
    }
    return r;
  };

  /**
   * Configuration data.
   *    path : Page path. Format:
   *      * "@" -> Configuration page
   *      * "name" -> Index of a path name
   *      * "name@module -> Documentation of a file named module.js
   *      * "name@module:anchor -> Code of a file named module.js
   *    visible : 'true' if every path is visible and 'false' if only paths
   *      marked as 'visible' are visible.
   *    pageId : Identifier to avoid working with 2 configuration pages at
   *      the same time.
   *    lang : May be "en" or "es"
   */
  //# str - bool - str - ConfEntry
  ConfEntry =  function (path, visible, pageId, lang) {
    //# str
    this.path = path;
    //# bool
    this.visible = visible;
    //# str
    this.pageId = pageId;
    //# str
    this.lang = lang;
    //# - Arr<*>
    this.serialize = function () {
      return [this.path, this.visible, this.pageId, this.lang];
    };
  };
  //# Arr<*> - ConfEntry
  ConfEntry.restore = function (s) {
    return new ConfEntry(s[0], s[1], s[2], s[3]);
  };
  fields.ConfEntry = ConfEntry;

  /// Entry of file paths.db
  //# str - str - bool - PathsEntry
  PathsEntry = function (name, path, visible) {
    //# str
    this.name = name;
    //# str
    this.path = path;
    //# bool
    this.visible = visible;
    //# - Arr<*>
    this.serialize = function () {
      return [this.name, this.path, this.visible];
    };
  };
  //# Arr<*> - PathsEntry
  PathsEntry.restore = function (s) {
    return new PathsEntry(s[0], s[1], s[2]);
  };
  fields.PathsEntry = PathsEntry;

  /// Row of path data passed to the client
  //# str - str - bool - bool - PathsData
  PathsData = function (name, path, visible, existing) {
    //# str
    this.name = name;
    //# str
    this.path = path;
    //# bool
    this.visible = visible;
    //# bool
    this.existing = existing;
    //# - Arr<*>
    this.serialize = function () {
      return [this.name, this.path, this.visible, this.existing];
    };
  };
  //# Arr<*> - PathsData
  PathsData.restore = function (s) {
    return new PathsData(s[0], s[1], s[2], s[3]);
  };
  fields.PathsData = PathsData;

  /// Data to conf page
  //# ConfEntry - [PathsData] - ConfData
  ConfData = function (conf, paths) {
    //# ConfEntry
    this.conf = conf;
    //# PathsData
    this.paths = paths;
    //# - Arr<*>
    this.serialize = function () {
      return [this.conf.serialize(), serialize(this.paths)];
    };
  };
  //# Arr<*> - PathsData
  ConfData.restore = function (s) {
    return new ConfData(
      ConfEntry.restore(s[0]),
      restore(s[1], PathsData.restore)
    );
  };
  fields.ConfData = ConfData;

}());
