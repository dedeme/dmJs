// Copyright 13-Oct-2017 ºDeme
// GNU General Public License - V3 <http://www.gnu.org/licenses/>

goog.provide("view_Cash");

goog.require("github_dedeme.DatePicker");
goog.require("db_Dentry");

{
  const helpWidth = 250;
  const DatePicker = github_dedeme.DatePicker/**/;

view_Cash = class {
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
    const lang = conf.language();
    const db = control.db();
    const dom = control.dom();

    const mostUsed = db.mostUsed();
    let ix = 1;
    let sum = 0;
    const cashData = It.from(db.diary()).map(e => {
        const amm = It.from(e.debits()).filter(tp => tp.e1() === "57200")
            .reduce(0, (s, tp) => s += tp.e2().value()) -
          It.from(e.credits()).filter(tp => tp.e1() === "57200")
            .reduce(0, (s, tp) => s += tp.e2().value());
          sum += amm;
        return [
          ix++,
          e,
          new Dec(amm, 2),
          new Dec(sum, 2)
        ]
      }).filter(arr =>
        arr[2].value() !== 0
      ).reverse().to();

    const planDiv = $("div");
    const listDiv = $("div").style("width:100%");
    const dateField = $("input").att("type", "text").klass("frame")
      .style("width:80px;color:#000000;text-align:center;");
    const datePicker = new DatePicker();
    datePicker.setLang(lang);
    datePicker.setAction(d => {});
    datePicker.setDate(cashData.length > 0
      ? cashData[0][1].date()
      : DateDm.now()
    );
    const acc = $("input").att("type", "text").klass("frame")
      .style("width:45px;color:#000000;text-align:center;")
      .disabled(true);
    const description = Ui.field("debit").att("id", "description")
      .style("width:270px");
    const amm = Ui.field("credit").att("id", "debit")
      .style("width:65px");

    let cashIx = 1;

    // Control ---------------------------------------------

    // Left menu -----------------------

    /**
     * @param {string} acc
     * @return {void}
     */
    function changeTo (acc) {
      const lg = acc.length
      if (acc.length < 3) {
        changeTo(db.subOf(acc).next()[0]);
      } else {
        control.setDiaryId(
          acc,
          () => { planDiv.removeAll().add(planHelpf()); }
        );
      }
    }

    /**
     * @param {string} id
     * @param {string} description
     * @return {void}
     */
    function helpAccountClick (id, description) {
//      entryRows[row][col].value(Dom.accFormat(id)).att("title", description);
    }

    // Center menu -----------------------

    /** @return {void} */
    function upClick () {
    }

    /** @return {void} */
    function downClick () {
    }

    /** @return {void} */
    function dupClick () {
    }

    /** @return {void} */
    function ddownClick () {
    }

    /** @return {void} */
    function plusClick () {
    }

    /** @return {void} */
    function minusClick () {
    }

    /** @return {void} */
    function monthClick (i) {
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
              .addIt(db.subOf(account.substring(0, lg - 1))
                .map(e =>
                  $("li").add(Ui.link(ev => {
                      changeTo(e[0]);
                    }).klass("link").att("title", e[0])
                    .html(Dom.textAdjust(e[1], helpWidth - 16))))))))
        .add($("li").add($("hr")))
        .addIt(db.sub(account).map(e =>
          $("li").add(Ui.link(ev => { helpAccountClick(e[0], e[1]); })
            .klass("link").att("title", Dom.accFormat(e[0]))
            .html(Dom.textAdjust(e[1], helpWidth - 16)))));
    }

    const list = () => {
      const td = () => $("td").klass("frame").style("vertical-align:top;");
      const tdr = () => td().addStyle("text-align:right");
      const tdl = () => td().addStyle("text-align:left");

      return $("table").att("align", "center")
        .addIt(It.from(cashData).map(arr =>
          $("tr")
            .add(tdr().html("" + arr[0]))
            .add(td().html(arr[1].date().format("%D/%M")))
            .add(tdl().add(Ui.link(ev => {
                alert("" + arr[0]);
              }).klass("link").html(arr[1].description())))
            .add(tdr().html(dom.decToStr(arr[2])))
            .add(tdr().html(dom.decToStr(arr[3])))
        ))

    }

    const left = $("td").klass("frame")
      .style("width:" + helpWidth + "px;vertical-align:top;white-space:nowrap")
      .add($("p").html("<b>" + _("Most used accounts") + "</b>"))
      .add($("ul").style("list-style:none;padding-left:0px;")
        .addIt(
            It.from(mostUsed).drop(1).map(acc =>
              $("li").add(Ui.link(ev => {
                  helpAccountClick(
                    acc,
                    It.from(db.subaccounts()).findFirst(s => s[0] === acc)[1]
                  )
                }).add($("span").klass("link")
                  .att("title", Dom.accFormat(acc)).html(
                    Dom.textAdjust(
                      It.from(db.subaccounts()).findFirst(s => s[0] === acc)[1],
                      helpWidth - 4
                    )
                ))))
          ))
      .add($("p").html("<b>" + _("Plan") + "</b>"))
      .add(planDiv)
    ;

    const right =  $("td").style("text-align:center;vertical-align:top;")
      .add($("h2").html(_("Diary")))
      .add($("table").att("align", "center").add($("tr")
        .add($("td").add(datePicker.makeText(dateField)))
        .add($("td").add(acc))
        .add($("td").add(description))
        .add($("td").add(amm))
      )).add($("hr"))
      .add($("table").att("align", "center")
        .add($("tr")
          .add($("td").att("colspan", 3))
          .add($("td").klass("diary").add(Ui.link(ev => {
              upClick();
            }).addStyle("font-family:monospace").html("&nbsp;\u2191&nbsp;")))
          .add($("td").klass("diary").add(Ui.link(ev => {
              downClick();
            }).addStyle("font-family:monospace").html("&nbsp;\u2193&nbsp;")))
          .add($("td").klass("diary").add(Ui.link(ev => {
              dupClick();
            }).addStyle("font-family:monospace").html("\u2191\u2191")))
          .add($("td").klass("diary").add(Ui.link(ev => {
              ddownClick();
            }).addStyle("font-family:monospace").html("\u2193\u2193")))
          .add($("td").klass("diary").add(Ui.link(ev => {
              plusClick();
            }).html("&nbsp;+&nbsp;")))
          .add($("td").klass("diary").add(Ui.link(ev => {
              minusClick();
            }).html("&nbsp;-&nbsp;")))
          .add($("td").att("colspan", 3)))
        .add($("tr")
          .add($("td").klass("diary").add(Ui.link(ev => {
              monthClick(1);
            }).html("&nbsp;1&nbsp;")))
          .add($("td").klass("diary").add(Ui.link(ev => {
              monthClick(2);
            }).html("&nbsp;2&nbsp;")))
          .add($("td").klass("diary").add(Ui.link(ev => {
              monthClick(3);
            }).html("&nbsp;3&nbsp;")))
          .add($("td").klass("diary").add(Ui.link(ev => {
              monthClick(4);
            }).html("&nbsp;4&nbsp;")))
          .add($("td").klass("diary").add(Ui.link(ev => {
              monthClick(5);
            }).html("&nbsp;5&nbsp;")))
          .add($("td").klass("diary").add(Ui.link(ev => {
              monthClick(6);
            }).html("&nbsp;6&nbsp;")))
          .add($("td").klass("diary").add(Ui.link(ev => {
              monthClick(7);
            }).html("&nbsp;7&nbsp;")))
          .add($("td").klass("diary").add(Ui.link(ev => {
              monthClick(8);
            }).html("&nbsp;8&nbsp;")))
          .add($("td").klass("diary").add(Ui.link(ev => {
              monthClick(9);
            }).html("&nbsp;9&nbsp;")))
          .add($("td").klass("diary").add(Ui.link(ev => {
              monthClick(10);
            }).html("10")))
          .add($("td").klass("diary").add(Ui.link(ev => {
              monthClick(11);
            }).html("11")))
          .add($("td").klass("diary").add(Ui.link(ev => {
              monthClick(12);
            }).html("12")))
        ))
      .add($("hr"))
      .add(listDiv)
    ;

    const table = $("table").klass("main").add($("tr")
      .add(left)
      .add(right));
    control.dom().show("cash", table);

    planDiv.add(planHelpf());
    listDiv.add(list());
  }
}}
