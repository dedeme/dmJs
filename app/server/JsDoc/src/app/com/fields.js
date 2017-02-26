//- jdm/Server.js
/*
 * Copyright 25-Feb-2017 ºDeme
 * GNU General Public License - V3 <http://www.gnu.org/licenses/>
 */

var fields = {}; // eslint-disable-line

(function () {
  "use strict"; // eslint-disable-line

  var ConfEntry;
  var PathsEntry;

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
   */
  //# str - str - bool - ConfEntry
  ConfEntry =  function (path, visible, pageId) {
    this.path = path;
    this.visible = visible;
    this.pageId = pageId;
    this.serialize = function () {
      return [path, visible, pageId];
    };
  };
  //# Arr<*> - ConfEntry
  ConfEntry.restore = function (s) {
    return new ConfEntry(s[0], s[1], s[2]);
  };
  fields.ConfEntry = ConfEntry;

  //# str - str - bool - PathsEntry
  PathsEntry = function (name, path, visible) {
    this.name = name;
    this.path = path;
    this.visible = visible;
    this.serialize = function () {
      return [name, path, visible];
    };
  };
  //# Arr<*> - PathsEntry
  PathsEntry.restore = function (s) {
    return new PathsEntry(s[0], s[1], s[2]);
  };
  fields.PathsEntry = PathsEntry;

}());
