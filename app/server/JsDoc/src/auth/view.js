//- dm/ui.js
//- dm/store.js
//- dm/rnd.js
//- dm/DateDm.js
//- dm/i18n.js
//- dm/Captcha.js
//- auth/auth.js
//- app/dom.js
/*
 * Copyright 19-Feb-2017 ºDeme
 * GNU General Public License - V3 <http://www.gnu.org/licenses/>
 */
/*global window, dm, app, auth */

(() => {
  const It = dm.It;
  const ui = dm.ui;
  const store = dm.store;
  const DateDm = dm.DateDm;
  const Captcha = dm.Captcha;
  const $ = ui.$;
  const _ = dm.i18n._;
  const model = auth.model;

  const view = {};
  auth.view = view;

  // Captcha configuration ---------------------------------

  const storeId = "JsDoc_auth";
  const getCounter = () => {
    const ret = n => {
      store.put(storeId + "_counter", "" + n);
      store.put(storeId + "_time", "" + DateDm.now().toTime());
      return n;
    };

    const c = store.get(storeId + "_counter");
    if (c === null) return ret(0);

    const t = +store.get(storeId + "_time");
    if (DateDm.now().toTime() - t > 900000) return ret(0);

    return +c;
  };
  //# -
  view.incCounter = () => {
    const c = +store.get(storeId + "_counter");
    store.put(storeId + "_counter", c + 1);
    store.put(storeId + "_time", "" + DateDm.now().toTime());
  };
  //# -
  view.resetCounter = () => {
    store.del(storeId + "_counter");
    store.del(storeId + "_time");
  };
  const counter = getCounter();
  const captcha = new Captcha();
  captcha.zeroColor = '#f0f0f0';
  captcha.oneColor = '#c0c0c0';
  const counterLimit = 2;

  // End captcha configuration -----------------------------

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
    if (counter > counterLimit) {
      if (!captcha.match()) {
        window.alert(_("Grey squares checks are wrong"));
        window.location.assign("../auth/index.html");
        return;
      }
    }
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

    if (counter > 0) {
      rows.push(
        $("tr", [], [
          $("td", [
            ui.att("colspan", 2),
            ui.style('border-top:1px solid #c9c9c9;' +
              "padding: 10px 10px 10px;text-align:right;")
          ], [
            $("table", [
              ui.att("align", "center"),
              ui.style("background-color: rgb(250, 250, 250);" +
                "border: 1px solid rgb(110,130,150);" +
                "font-family: sans;font-size: 14px;" +
                "padding: 4px;border-radius: 4px;")
            ], [
              $("tr", [], [
                $("td", [ui.html(_("Wrong password"))])])])])])
      );
    }

    if (counter > counterLimit) {
      rows.push(
        $("tr", [], [
          $("td", [
            ui.att("colspan", 2),
            ui.att("align", "center")
          ], [captcha.mk()])])
      );
      rows.push(
        $("tr", [], [
          $("td", [
            ui.att("colspan", 2),
            ui.style("padding: 5px 0px 5px 10px;text-align:center;"),
            ui.html(_("Check gray squares"))])])
      );
    }

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
    user.o.focus();
  };

})();

