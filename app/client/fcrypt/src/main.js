// Copyright 04-Sep-2017 ºDeme
// GNU General Public License - V3 <http://www.gnu.org/licenses/>

goog.provide("main");
goog.require("github_dedeme");

let div = $("div");

function showText(k, text) {
  let area = ""
  try {
    area = $("textarea").att("rows", 30).att("cols", 100)
    .text(Cryp.decryp(k, text));
  } catch (e) {
    area = $("textarea").att("rows", 30).att("cols", 100)
    .text(Cryp.cryp(k, text));
  }
  let close = $("input")
    .att("type", "button")
    .style("width:90px;")
    .att("id", "close");
  close.value("Close");
  close.on("click", () => {
    text = "";
    location.assign("");
  });
  let save = $("input")
    .att("type", "button")
    .style("width:90px;")
    .att("id", "save");
  save.value("Save");
  save.on("click", () => {
    Ui.download("data", Cryp.cryp(k, area.value()));
  });

  div.removeAll()
    .add($("div").klass("title").html('&nbsp;<br>fcrypt<br>&nbsp;'))
    .add($("div")
      .add($("table")
        .att("align", "center")
        .style(
          "border-collapse: collapse;" +
          "padding: 10px;" +
          "border: 1px solid rgb(110,130,150);")
        .add($("tr")
          .add($("td")
            .add(area)))
        .add($("tr")
          .add($("td").style("text-align:right;")
            .add(close)
            .add(/** @type !Domo */($("span").html("&nbsp;&nbsp;")))
            .add(save)))
    ));
}

var main = function () {
  let user = Ui.field("pass");
  let pass = Ui.pass("accept").att("id", "pass");
  let accept = $("input")
    .att("type", "button")
    .style("width:90px;")
    .att("id", "accept");
  accept.value("Accept");

  Ui.upload("data", text => {
    accept.on("click", () => {
      let u = user.value().trim();
      let p = pass.value().trim();
      if (u === "") {
        alert("User is missing");
        return;
      }
      if (p === "") {
        alert("password is missing");
        return;
      }
      showText(Cryp.key(u + p, 2500), text);
    });
    $$("body").next().removeAll().add(div);
    div
      .add($("div").klass("title").html('&nbsp;<br>fcrypt<br>&nbsp;'))
      .add($("div")
        .add($("table")
          .att("align", "center")
          .style(
            'background-color: #f8f8f8;' +
            "border-collapse: collapse;" +
            "padding: 10px;" +
            "border: 1px solid rgb(110,130,150);")
          .add($("tr")
            .add($("td")
              .att("colspan", 2)
              .style(
                'background-color:#e8e8e8;' +
                'border-bottom:1px solid #c9c9c9;' +
                "padding: 10px;" +
                'color:#505050;'
              )
              .html("<big><big><b>Login</big></big></b>")))
          .add($("tr")
            .add(/** @type !Domo */($("td")
              .style("padding: 10px 0px 0px 10px;text-align:right;")
              .html("User")))
            .add($("td").style("padding: 10px 10px 0px 10px;").add(user)))
          .add($("tr")
            .add(/** @type !Domo */($("td")
              .style("padding: 10px 0px 0px 10px;text-align:right;")
              .html("Password")))
            .add($("td").style("padding: 10px 10px 5px 10px;").add(pass)))
          .add($("tr")
            .add($("td"))
            .add($("td").att("align", "right").add(accept)))
      ));
    user.e().focus();
  });
};

main();

