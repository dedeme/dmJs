//- app/app.js
//- dm/ui.js
/*
 * Copyright 20-Feb-2017 ºDeme
 * GNU General Public License - V3 <http://www.gnu.org/licenses/>
 */
/* global dm, app */

(() => {
  const ui = dm.ui;
  const $ = ui.$;


  //# Obj
  const dom0 = {};
  app.dom0 = dom0;

  //# Domo -
  dom0.show = o => {
    ui.$$("body").next().removeAll().add(
      $("div", [], [
        o,
        $("p").html("&nbsp;"),
        $("hr", []),
        $("table", [ui.klass("main")],[
          $("tr", [], [
            $("td", [], [
              $("a", [
                ui.att("href", "../doc/about.html"),
                ui.att("target", "blank"),
                ui.html("<small>Help & Credits</small>")])]),
            $("td", [
              ui.style("text-align: right;font-size: 10px;" +
                  "color:#808080;font-size:x-small;"),
              ui.html("- © ºDeme. JsDoc (0.0.1) -")])])])])
    );
  };

})();

