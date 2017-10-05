// Copyright 24-Sep-2017 ºDeme
// GNU General Public License - V3 <http://www.gnu.org/licenses/>

goog.provide("view_Diary");

goog.require("github_dedeme.DatePicker");

{
  const helpWidth = 250;

view_Diary = class {
  /**
   * @param {!Main} control
   */
  constructor (control) {
    /** @private */
    this._control = control;
  }

  /**
   * @return {void}
   */
  show () {
    const self = this;
    const control = self._control;
    const conf = control.conf();
    const db = control.db();

    const mostUsed = db.mostUsed();

    const planDiv = $("div");
    const editDiv = $("div");
    const number =  $("input").att("type", "text").klass("frame")
      .style("width:50px;background-color:#f0f0ff;color:#000000;" +
        "text-align:center;")
      .disabled(true);
    const debitAcc = $("input").att("type", "text").klass("frame")
      .style("width:45px;color:#000000;text-align:center;")
      .disabled(true);
    const debit = Ui.field("credit").att("id", "debit")
      .style("width:65px");
    const creditAcc = $("input").att("type", "text").klass("frame")
      .style("width:45px;color:#000000;text-align:center;")
      .disabled(true);
    const credit = Ui.field("accept").att("id", "credit")
      .style("width:65px");

    // Control ---------------------------------------------

    const mostUsedClick = acc => {
      alert(acc);
    }

    const newClick = () => {
      editDiv.removeAll().add(entry());
    }

    // View ------------------------------------------------
    const planHelpf = () => {
      const account = conf.diaryId();
      return $("ul").style("list-style:none;padding-left:0px;")
        .addIt(It.range(1, 4).map(lg =>
          $("li")
            .html("<a href='#' onclick='return false;'>" +
              Dom.textAdjust(
                db.description(account.substring(0, lg)), helpWidth - 4
              ) + "</a>")
            .add($("ul").att("id", "hlist")
              .style("list-style:none;padding-left:10px;")
              .addIt(db.sub(account.substring(0, lg - 1)).map(e =>
                  $("li").add(Ui.link(ev => { alert(e[0]); })
                    .klass("link").att("title", e[0])
                    .html(Dom.textAdjust(e[1], helpWidth - 4))))))))
        .add($("li").add($("hr")))
        .addIt(db.sub(account).map(e =>
          $("li").add(Ui.link(ev => { alert(e[0]); })
            .klass("link").att("title", e[0])
            .html(Dom.textAdjust(e[1], helpWidth - 4)))));
    }

    const entry = () => {
      const description = Ui.field("debit").att("id", "description")
        .style("width:270px");
      return $("table").att("align", "center").klass("frame")
        .add($("tr")
          .add($("td").att("colspan", 2).add($("span").html("date")))
          .add($("td").att("colspan", 3)
            .add(Ui.link(ev => {}).klass("diary")
              .html("&nbsp;&nbsp;S&nbsp;&nbsp;"))
            .add($("span").html(" · "))
            .add(Ui.link(ev => {}).klass("diary").html("+"))
            .add($("span").html(" "))
            .add(Ui.link(ev => {}).klass("diary").html("-")))
          .add($("td").att("colspan", 2).style("text-align:right;")
            .add(number)))
        .add($("tr")
          .add($("td").att("colspan", 7).add(description)))
        .add($("tr")
          .add($("td").style("text-align:left").add(debitAcc))
          .add($("td").att("colspan", 2).style("text-align:left").add(debit))
          .add($("td").html("||"))
          .add($("td").att("colspan", 2).style("text-align:rigth").add(credit))
          .add($("td").style("text-align:right").add(creditAcc)))
        .add($("tr").add($("td").att("colspan", 7).add($("hr"))))
        .add($("tr")
          .add($("td").att("colspan", 7).style("text-align:right")
            .add($("button").text(_("Cancel")).style("width:100px")
              .on("click", (ev) => { alert("cancel");}))
            .add($("button").text(_("Accept")).style("width:100px")
              .att("id", "accept")
              .on("click", (ev) => { alert("Accept");}))))

    }

    const left = $("td").klass("frame")
      .style("width:" + helpWidth + "px;vertical-align:top;")
      .add($("p").html("<b>" + _("Most used accounts") + "</b>"))
      .add($("ul").style("list-style:none;padding-left:0px;")
        .addIt(
            It.from(mostUsed).map(acc =>
              $("li").add(Ui.link(ev => {
                  mostUsedClick(acc)
                }).add($("span").klass("link").html(
                  Dom.textAdjust(
                    It.from(db.subaccounts()).findFirst(s => s[0] === acc)[1],
                    helpWidth - 4
                  )
                ))))
          ))
      .add($("p").html("<b>" + _("Plan") + "</b>"))
      .add(planDiv);

    const right =  $("td").style("text-align:center;vertical-align:top;")
      .add($("h2").html(_("Diary")))
      .add(editDiv)
      .add($("hr"))
      .add($("table").att("align", "center")
        .add($("tr")
          .add($("td").att("colspan", 3))
          .add($("td").att("colspan", 2).klass("diary").add(Ui.link(ev => {
              newClick();}
            ).html(_("New"))))
          .add($("td").klass("diary").add(Ui.link(ev => {
              alert("I");
            }).addStyle("font-family:monospace").html("&nbsp;\u2191&nbsp;")))
          .add($("td").klass("diary").add(Ui.link(ev => {
              alert("I");
            }).addStyle("font-family:monospace").html("\u2191\u2191")))
          .add($("td").klass("diary").add(Ui.link(ev => {
              alert("I");
            }).addStyle("font-family:monospace").html("&nbsp;\u2193&nbsp;")))
          .add($("td").klass("diary").add(Ui.link(ev => {
              alert("I");
            }).addStyle("font-family:monospace").html("\u2193\u2193")))
          .add($("td").att("colspan", 3)))
        .add($("tr")
          .add($("td").klass("diary").add(Ui.link(ev => {
              alert("1");
            }).html("&nbsp;1&nbsp;")))
          .add($("td").klass("diary").add(Ui.link(ev => {
              alert("I");
            }).html("&nbsp;2&nbsp;")))
          .add($("td").klass("diary").add(Ui.link(ev => {
              alert("I");
            }).html("&nbsp;3&nbsp;")))
          .add($("td").klass("diary").add(Ui.link(ev => {
              alert("I");
            }).html("&nbsp;4&nbsp;")))
          .add($("td").klass("diary").add(Ui.link(ev => {
              alert("1");
            }).html("&nbsp;5&nbsp;")))
          .add($("td").klass("diary").add(Ui.link(ev => {
              alert("I");
            }).html("&nbsp;6&nbsp;")))
          .add($("td").klass("diary").add(Ui.link(ev => {
              alert("I");
            }).html("&nbsp;7&nbsp;")))
          .add($("td").klass("diary").add(Ui.link(ev => {
              alert("I");
            }).html("&nbsp;8&nbsp;")))
          .add($("td").klass("diary").add(Ui.link(ev => {
              alert("1");
            }).html("&nbsp;9&nbsp;")))
          .add($("td").klass("diary").add(Ui.link(ev => {
              alert("I");
            }).html("10")))
          .add($("td").klass("diary").add(Ui.link(ev => {
              alert("I");
            }).html("11")))
          .add($("td").klass("diary").add(Ui.link(ev => {
              alert("I");
            }).html("12")))
        ))
      .add($("hr"))
    ;

    const table = $("table").klass("main").add($("tr")
      .add(left)
      .add(right));
    control.dom().show("diary", table);

    planDiv.removeAll().add(planHelpf());
  }
}}
