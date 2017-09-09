// Copyright 07-Sep-2017 ºDeme
// GNU General Public License - V3 <http://www.gnu.org/licenses/>

goog.provide("View");
goog.require("github.dedeme");

goog.require("Dom");
goog.require("Big");
goog.require("Little");

{
  let board = new Big(Model.last);
  let tracker = new Tracker([
    "1", "2", "3", "4", "5",
    "k0", "k1", "k2", "k3", "k4", "k5", "k6", "k7", "k8", "k9",
    "edit-copy", "emblem-important", "en", "es", "filenew", "fileopen",
    "filesave", "gtk-add", "gtk-clear", "gtk-execute", "gtk-help",
    "gtk-remove", "levelen", "leveles", "pen", "pencil", "thinking.gif",
    "win0", "win1", "win2", "win3", "win4"
  ]);
  let timeCell = $("td").klass("lastR");
  let newLink = $("span");
  let menu = $("div");
  let body = $("div");

View = class {
  /** @return {!Tracker} */
  static tracker () {
    return tracker;
  }

  /** @return {!Big} */
  static board () {
    return board;
  }

  /** @return {!Domo} */
  static timeCell () {
    return timeCell;
  }

  /** @return {!Domo} */
  static newLink () {
    return newLink;
  }

  /**
   * @param {string} img
   * @param {string} tooltip
   * @param {boolean=} isGrey
   * @return {!Domo}
   */
  static imgMenu (img, tooltip, isGrey) {
    isGrey = isGrey || false;
    let r = isGrey
      ? View.tracker().grey(img).addStyle("vertical-align:bottom;")
      : View.tracker().take(img).style("vertical-align:bottom;");
    if (tooltip !== "") r.att("title", tooltip);
    return r;
  }

  static mkMainMenu () {
    menu.removeAll().add(
      $("table").att("align", "center").add($("tr")
        .add($("td").klass("menu")
          .add(newLink)
          .add(Ui.link(main.copySudoku)
            .add(View.imgMenu("edit-copy", _("Copy")))
          )
          .add(Ui.link(main.readSudoku)
            .add(View.imgMenu("fileopen", _("Open")))
          )
          .add(Ui.link(main.saveSudoku)
            .add(View.imgMenu("filesave", _("Save")))
          )
        )
        .add($("td").klass("menu").style("vertical-align:middle")
          .add(Ui.link(main.changeLang)
            .add(View.imgMenu("level" + Model.data.lang, _("Change language"))))
          .add(Ui.link(main.downLevel)
            .add(View.imgMenu(
                "gtk-remove", _("Down level"), Model.data.level === 1)
              )
          )
          .add(View.imgMenu("" + Model.data.level, ""))
          .add(Ui.link(main.upLevel)
            .add(View.imgMenu("gtk-add", _("Up level"),
              Model.data.level === 5))
          )
        )
        .add($("td").klass("menu")
          .add(Ui.link(main.changeDevice)
            .add(Model.data.pencil
              ? View.imgMenu("pencil", _("Change to pen"))
              : View.imgMenu("pen", _("Change to pencil"))
            )
          )
          .add(Ui.link(main.clearSudoku)
            .add(Model.data.pencil
              ? View.imgMenu("gtk-clear", _("Clear pencil"), true)
              : View.imgMenu("gtk-clear", _("Clear all"))
            )
          )
          .add(Ui.link(main.helpSudoku)
            .add(View.imgMenu("emblem-important", _("Search mistakes")))
          )
          .add(Ui.link(main.solveSudoku)
            .add(View.imgMenu("gtk-execute", _("Solve")))
          )
        )
      )
    );
  }

  static mkNewMenu () {
    menu.removeAll().add(
      $("table").att("align", "center").add($("tr")
        .add($("td").klass("menu")
          .add(View.imgMenu("filenew", "").style("vertical-align:middle"))
          .add($("span").klass("menu").html(_("New sudoku")))
          .add($("span").style("padding-right:5px;"))
        )
      ));
  }

  static mkCopyMenu() {
    menu.removeAll().add(
      $("table").att("align", "center").add($("tr")
        .add($("td").klass("menu")
          .add(Ui.img("edit-copy").style("vertical-align:middle"))
          .add($("span").klass("menu").html(_("Copy external sudoku")))
          .add($("button").text(_("Accept")).on("click", main.copyAccept))
          .add($("span").klass("menu").html(""))
          .add($("button").text(_("Cancel")).on("click", main.copyCancel))
          .add($("span").style("padding-right:5px;"))
        )
      ));
  }

  static mkLoadMenu () {
    menu.removeAll().add(
      $("table").att("align", "center").add($("tr")
        .add($("td").klass("menu")
          .add(Ui.img("fileopen").style("vertical-align:middle"))
          .add($("span").klass("menu").html(_("Open sudoku")))
          .add($("button").text(_("Cancel")).on("click", main.loadCancel))
          .add($("span").style("padding-right:5px;"))
        )
      ));
  }

  static mkSolveMenu () {
    menu.removeAll().add(
      $("table").att("align", "center").add($("tr")
        .add($("td").klass("menu")
          .add(Ui.img("gtk-execute").style("vertical-align:middle"))
          .add($("span").klass("menu").html(_("Solved sudoku")))
          .add($("button").text(_("Accept")).on("click", main.solveAccept))
          .add($("span").style("padding-right:5px;"))
        )
      ));
  }

  static mkEndMenu () {
    let tm = Model.convertScs(Model.last.time);
    menu.removeAll().add(
      $("table").att("align", "center").add($("tr")
        .add($("td").klass("menu")
          .style("white-space: nowrap;padding:10px;")
          .add(Ui.img("win" + Rnd.i(5)).style("vertical-align:middle"))
          .add($("span").klass("menu")
            .html(_args(
              _("<br>View-mkEndMenu.%0%1%2<br>"),
              tm[0], tm[1], tm[2])))
          .add($("button").text(_("Continue")).on("click", main.newSudoku))
          .add($("span").style("padding-right:5px;"))
        )
      ));
  }

  static mkNumberKeys () {
    let mkf = n => {
      return (ev) => { main.typeNumber(n); }
    }
    return $("table").att("align", "center")
      .add($("tr")
        .addIt(It.range(1, 6).map(function (n) {
          return $("td").add(Ui.link(mkf(n)).add(
            View.tracker().take("k" + (n)).klass("frame")
          ));
        })))
      .add($("tr")
        .addIt(It.range(6, 10).map(function (n) {
          return $("td").add(Ui.link(mkf(n)).add(
            View.tracker().take("k" + (n)).klass("frame")
          ));
        }))
        .add($("td")
          .add(Ui.link(mkf(0)).add(View.tracker().take("k0").klass("frame"))))
        )
    ;
  }

  /** @param {!Domo} o */
  static mkBody (o) {
    body.removeAll().add(o);
  }

  static dom() {
    Dom.show($("div").style("text-align:center")
      .add($("p").klass("title").html("DmSudoku"))
      .add(menu)
      .add($("p"))
      .add(body)
    );
  }

  static mainShow() {
    Model.page = Model.PageType.MainPage;
    board = new Big(Model.last);

    board.select(Model.last.cell()[0], Model.last.cell()[1]);
    View.mkMainMenu();
    View.mkBody($("table").att("align", "center")
      .style("border-collapse : collapse;")
      .add($("tr")
        .add($("td").att("colspan", 2)
          .add(board.element))
      )
      .add($("tr").add($("td").att("colspan", 2).html("<hr>")))
      .add($("tr")
        .add($("td").klass("lastL").html(Model.mkDate(
          Model.data.lang,
          DateDm.restore(Model.last.date())
        )))
        .add(timeCell.html(
          Model.formatScs(Model.last.time)
        ))
      )
      .add($("tr").add($("td").att("colspan", 2).html("<hr>")))
      .add($("tr").add($("td").att("colspan", 2).add(View.mkNumberKeys())))
    );
    main.controlEnd();
  }

  static newShow () {
    View.mkNewMenu();
    View.mkBody($("table").att("align", "center")
      .add($("tr")
        .add($("td").klass("frame")
          .add(View.imgMenu("thinking", "")))
      )
    );
  }

  static copyShow() {
    Model.page = Model.PageType.CopyPage;
    board = new Big(Model.copy);
    board.select(Model.copy.cell()[0], Model.copy.cell()[1]);
    View.mkCopyMenu();
    View.mkBody($("table").att("align", "center")
      .style("border-collapse : collapse;")
      .add($("tr").add($("td").add(board.element)))
      .add($("tr").add($("td").html("<hr>")))
      .add($("tr").add($("td").add(View.mkNumberKeys())))
    );
  }

  static loadShow() {
    View.mkLoadMenu();
    if (Model.data.memo.length === 0) {
      View.mkBody($("table").att("align", "center").add($("tr")
        .add($("td").klass("frame").html(_("Without records")))));
      return;
    }
    let ix = 0;
    View.mkBody($("table").att("align", "center")
      .addIt(It.range(3).map(function (i) {
        return $("tr").addIt(It.range(3).map(function (i) {
          let data = Model.data.memo[ix++];
          if (data !== undefined) {
            return $("td")
              .add(Ui.link(e => {main.loadSelect(data)})
                .add(new Little(data).element));
          } else {
            return $("td");
          }
        }));
      }))
    );
  }

  static showBoard () {
    View.mkBody($("table").att("align", "center")
      .style("border-collapse : collapse;")
      .add($("tr")
        .add($("td").att("colspan", 2)
          .add(board.element))
      )
      .add($("tr")
        .add($("td").att("colspan", 2).html("<hr>"))
      )
      .add($("tr")
        .add($("td").klass("lastL").html(Model.mkDate(
          Model.data.lang,
          DateDm.restore(Model.last.date())
        )))
        .add($("td").klass("lastR").html(
          Model.formatScs(Model.last.time)
        ))
      )
    );
  }

  static solveShow () {
    Model.page = Model.PageType.SolvePage;
    board = new Big(Model.last);
    View.mkSolveMenu();
    View.showBoard();
    board.markSolved();
  }

  static endShow() {
    View.mkEndMenu();
    View.showBoard();
  }

}}

