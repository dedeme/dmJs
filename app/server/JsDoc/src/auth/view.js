//- dm/i18n.js
//- auth/auth.js
//- app/dom.js
/*
 * Copyright 19-Feb-2017 ºDeme
 * GNU General Public License - V3 <http://www.gnu.org/licenses/>
 */
/*global dm, app, auth */

(() => {
  const It = dm.It;
  const ui = dm.ui;
  const $ = ui.$;
  const _ = dm.i18n._;
  const model = auth.model;

  const view = {};
  auth.view = view;

  const user = ui.field("pass");
  const pass = ui.pass("accept").att("id", "pass");
  const persistent = $("input", [
    ui.att("type", "checkbox"),
    ui.style("vertical-align: middle")
  ]);

  const accept = $("input", [
    ui.att("type", "button"),
    ui.style("width:90px;"),
    ui.att("id", "accept")
  ]);
  accept.o.onclick = () => {
    model.user = user.value().trim();
    model.pass = pass.value().trim();
    model.persistent = persistent.o.checked;
    auth.control.accept();
  };


  const body = () => {
    const control = auth.control;
    accept.value(_("Accept"));

    const rows = [
      $("tr", [], [
        $("td", [
          ui.style("padding: 10px 0px 0px 10px;text-align:right;"),
          ui.html(_("User"))]),
        $("td", [ui.style("padding: 10px 10px 0px 10px;")], [user])]),
      $("tr", [], [
        $("td", [
          ui.style("padding: 10px 0px 0px 10px;text-align:right;"),
          ui.html(_("Password"))]),
        $("td", [ui.style("padding: 10px 10px 5px 10px;")], [pass])]),
      $("tr", [], [
        $("td", [
          ui.att("colspan", 2),
          ui.style(
          'border-top:1px solid #c9c9c9;' +
          "padding: 5px 10px 10px;text-align:right;")
        ], [
          $("table", [
            ui.style(
              "border-collapse : collapse;" +
              "border : 0px;" +
              "width : 100%;")
          ], [
            $("tr", [], [
              $("td", [
                ui.att("align", "center"),
                ui.att("colspan", 2)
              ], [
                persistent,
                $("span", [ui.html("&nbsp;" + _("Keep connected"))])
              ])]),
            $("tr", [], [
              $("td", [], [
                ui.link(control.changeLanguage).att("class", "link")
                  .html(model.lang === "en" ? "ES" : "EN")]),
              $("td", [ui.att("align", "right")], [accept])])])])])
    ];

    return $("table", [
      ui.att("align", "center"),
      ui.style(
        'background-color: #f8f8f8;' +
        "border-collapse: collapse;" +
        "padding: 10px;" +
        "border: 1px solid rgb(110,130,150);")
    ], [
      $("tr", [], [
        $("td", [
          ui.att("colspan", 2),
          ui.style(
            'background-color:#e8e8e8;' +
            'border-bottom:1px solid #c9c9c9;' +
            "padding: 10px;" +
            'color:#505050;'
          ),
          ui.html(
            "<big><big><b>" + _("Login") + "</big></big></b>")])])
    ]).addIt(It.from(rows));
  };

  //# -
  view.show = () => {
    app.dom0.show(
      $("div", [], [
        $("div", [
          ui.klass("title"),
          ui.html("&nbsp;<br>JsDoc<br>&nbsp;")]),
        $("div", [], [body()])])
    );
  };

})();

