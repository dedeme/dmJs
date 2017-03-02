//- app/app.js
//- app/com/fields.js
//- dm/ui.js
/*
 * Copyright 20-Feb-2017 ºDeme
 * GNU General Public License - V3 <http://www.gnu.org/licenses/>
 */
/* global dm, app */

(() => {
  const str = dm.str;
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

  //# Obj
  const dom = {};
  app.dom = dom;

  //# str - It<fields.PathsData> - Domo -
  dom.show = (selection, paths, body) => {
    const mkMenu = () =>
      $("table", [
        ui.att("border", 0),
        ui.att("width", "100%")
      ], [
        $("tr", [], [
          $("td", [], [
            (selection === ""
              ? $("a").klass("frame").att("href", "../conf/index.html")
              : $("a").att("href", "../conf/index.html")
            ).add(dom.img("asterisk").att("align", "top"))])])
      ]).addIt(paths.filter(
        p => p.visible
      ).map(
        p => [p.name, p.name.toUpperCase()]
      ).sort(
        (ns1, ns2) => str.compare(ns1[1], ns2[1])
      ).map(
        ns => ns[0]
      ).map(
        n => $("span", [ui.text(" . ")], [
          (selection === n
            ?
            $("span", [
              ui.klass("frame")
            ], [
              $("a", [
                ui.att("href", "../index/index.html?" + n),
                ui.text(n)])])
            :
            $("a", [
              ui.att("href", "../index/index.html?" + n),
              ui.text(n)]))])
      ));

    dom0.show(
      $("div", [], [
        mkMenu(),
        $("hr"),
        body])
    );
  };

  //# str - !Domo
  dom.img = name =>
    $("img").att(
      "src", "../img/" + (name.endsWith(".gif") ? name : name + ".png")
    ).att("border", "0");

  //# str - !Domo
  dom.lightImg = name => dom.img(name).att("style", "opacity:0.4");

})();

