/*
 * Copyright 15-Feb-2017 ºDeme
 * GNU General Public License - V3 <http://www.gnu.org/licenses/>
 */

var global = {};

(function () {
  "use strict";

  // Store keys
  var pageStore = "DmjsDoc__page";
  var langStore = "DmjsDoc__lang";
  var sessionIdStore = "DmjsDoc__sessionId";

  /// Tow spaces tabulation
  //# str
  global.TAB = "  "
  /// Application name
  //# str
  global.APP = "DmjsDoc"
  /// Application version
  //#str
  global.VERSION = "0.0.0"
  ///
  //# num - global.PageType
  global.PageType = function (value) {
    //# num
    this.VALUE = value;
  }
  /// Page type
  # @const # num
  ns.ConfPage = 0
  /// Page type
  # @const # num
  ns.IndexPage = 1
  /// Page type
  # @const # num
  ns.HelpPage = 2
  /// Page type
  # @const # num
  ns.CodePage = 3

  /// Redirects if hostname is not 'localhost'
  # -
  ns.serverControl = ->
    if location.hostname != "localhost"
      location.assign "../default.html"

  /// Create a new Client
  # - !Client
  ns.client = ->
    c = new Client ns.app
    c.user "admin"
    c.sessionId ns.getSessionId!
    c

  /// Reads page value from local store. Default global.ConfPage
  # - !global.PageType
  ns.getPage = ->
    r = store.get pageStore
    if r == null : new ns.PageType ns.ConfPage
    new global.PageType(+r)
  /// Writes page value to local store
  # !global.PageType -
  ns.setPage = \pt ->
    store.put pageStore, ""+pt.value



}());
