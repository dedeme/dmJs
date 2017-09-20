// Copyright 04-Sep-2017 ºDeme
// GNU General Public License - V3 <http://www.gnu.org/licenses/>

goog.provide("View");
goog.require("github.dedeme.Domo");
goog.require("github.dedeme.Ui");
goog.require("Dom");

{
  let hexa = "0123456789ABCDEF";

  let hexval = $("div").att("style", "text-align:center;")
    .att("title", "Hexadecimal Value");
  let decval = $("div").att("style", "text-align:center;")
    .att("title", "Dexadecimal Value");
  let cvalue = $("div").att("style", "text-align:center;");
  let hvalue = $("div").att("style", "text-align:center;");
  let symbol = $("div").att("style", "text-align:center;font-size:x-large;");
  let tables = $("div").att("style", "text-align:center;");

  let refresh = () => {
    putSymbol ();
    put2tables();
  }

  let putSymbol = () => {
    hexval.text(Control.group() + Control.code());
    decval.text(parseInt("0x" + Control.group() + Control.code(), 16));
    cvalue.text("\\u" + Control.group() + Control.code());
    symbol.html("&#x" + Control.group() + Control.code() + ";");
    hvalue.text("&#x" + Control.group() + Control.code() + ";");
  }

  let put2tables = () => {
    tables.removeAll().add(make2tables());
  }

  let make2tables = () => {
    return $("table").att("align", "center")
      .add($("tr")
        .add($("td").att("align", "center").html("<b><tt>Group</tt</b>"))
        .add($("td").att("align", "center").html("<b><tt>Code</tt</b>")))
      .add($("tr")
        .add($("td").add(makeLeftTable()))
        .add($("td").style("vertical-align:top;").add(makeRigthTable()))
    );
  }

  let makeLeftTable = () => {
    let t = $("table").att("style",
      "border-collapse:collapse;" +
      "border: solid 1px;"
    );
    It.from(hexa.split("")).each((y) => {
      let tr = $("tr");
      It.from(hexa.split("")).each((x) => {
        if (Control.group() === y + x) {
          tr.add(makeTdSel().text(y + x));
        } else {
          tr.add(makeTd().add(
            makeHexaBt().text(y + x).on("click", () => {
              Control.setGroup(y + x);
              Store.put("unicodedm_group", Control.group());
              refresh();
            })
          ));
        }
      });
      t.add(tr);
    });
    return t;
  }

  let makeRigthTable = () => {
    let t = $("table").att("style",
      "border-collapse:collapse;" +
      "border: solid 1px;"
    );
    It.from(hexa.split("")).each((y) => {
      var tr = $("tr");
      It.from(hexa.split("")).each((x) => {
        if (Control.code() === y + x) {
          tr.add(makeTdSel().html(sym(Control.group(), y + x)));
        } else {
          tr.add(makeTd().add(makeSymBt()
            .html(sym(Control.group(), y + x))
            .on("click", () => {
              Control.setCode(y + x);
              Store.put("unicodedm_code", Control.code());
              refresh();
            })
          ));
        }
      });
      t.add(tr);
    });
    return t;
  }

  let makeTd = () => {
    return $("td").att("style",
      "font-family:monospace;" +
      "padding:0px;"
    );
  }

  let makeTdSel = () => {
    return $("td").att("style",
      "font-family:monospace;" +
      "padding:0px;" +
      "background-color:#fffff0;" +
      "border: solid 1px;"
    );
  }

  let makeHexaBt = () => {
    return $("button").att("style",
      "font-family:monospace;" +
      "padding:0px;"
    );
  }

  let makeSymBt = () => {
    return $("button").att("style",
      "font-family:monospace;" +
      "padding:0px;" +
      "width:22px;height:22px"
    );
  }

  let sym = (group, code) => {
    var base = "&#x" + group + code + ";";
    var c2 = code +  " ";
    if (group == "00") {
      if (code <= "20" || code == "AD") {
        return "&nbsp;";
      }
    }
    return base;
  }

View = class {

  static show () {
    Dom.show();
    Dom.bodyDiv().removeAll()
    .add($("table").att("width", "100%").add($("tr").add($("td")
      .add($("table").att("align", "center").add($("tr")
        .add($("td").add(Ui.img("world")))
        .add($("td")
          .add($("table").att("align", "center")
            .att("style",
              "border: solid 1px;background-color:#ffffff;")
            .add($("tr").add($("td").add(hexval)))))
        .add($("td")
          .add($("table").att("align", "center")
            .att("style",
              "border-collapse:collapse;" +
              "border: solid 1px;background-color:#ffffff;")
            .add($("tr").add($("td").att("style", "border: solid 1px;")
              .add(cvalue)))
            .add($("tr").add($("td").att("style", "border: solid 1px;")
              .add(symbol)))
            .add($("tr").add($("td").att("style", "border: solid 1px;")
              .add(hvalue)))))
        .add($("td")
          .add($("table").att("align", "center")
            .att("style",
              "border: solid 1px;background-color:#ffffff;")
            .add($("tr").add($("td").add(decval)))))
        .add($("td").add(Ui.img("word")))))
      .add($("hr"))
      .add($("p").att("style", "text-align:center;").add(tables))
    )));
    refresh();
  }
}}
