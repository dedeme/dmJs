// Copyright 07-Sep-2017 ºDeme
// GNU General Public License - V3 <http://www.gnu.org/licenses/>

goog.provide("View");
goog.require("github.dedeme");

goog.require("Dom");
goog.require("Big");
goog.require("Little");

{
  let board = new Big(Model.last());
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
  static imgMenu (img, tooltip, isGrey) {;
    isGrey = isGrey || false;
    let r = isGrey
      ? View.tracker().grey(img).addStyle("vertical-align:bottom;")
      : View.tracker().get(img).style("vertical-align:bottom;");
    if (tooltip !== "") r.att("title", tooltip);
    return r;
  }

  static mkMainMenu () {
    menu.removeAll().add(
      $("table").att("align", "center").add($("tr")
        .add($("td").klass("menu")
          .add(newLink)
          .add(Ui.link(Main.copySudoku/**/)
            .add(View.imgMenu("edit-copy", _("Copy")))
          )
          .add(Ui.link(Main.readSudoku/**/)
            .add(View.imgMenu("fileopen", _("Open")))
          )
          .add(Ui.link(Main.saveSudoku/**/)
            .add(View.imgMenu("filesave", _("Save")))
          )
        )
        .add($("td").klass("menu").style("vertical-align:middle")
          .add(Ui.link(Main.changeLang/**/)
            .add(View.imgMenu("level" +
              Model.mdata().lang(), _("Change language"))))
          .add(Ui.link(Main.downLevel/**/)
            .add(View.imgMenu(
                "gtk-remove", _("Down level"), Model.mdata().level() === 1)
              )
          )
          .add(View.imgMenu("" + Model.mdata().level(), ""))
          .add(Ui.link(Main.upLevel/**/)
            .add(View.imgMenu("gtk-add", _("Up level"),
              Model.mdata().level() === 5))
          )
        )
        .add($("td").klass("menu")
          .add(Ui.link(Main.changeDevice/**/)
            .add(Model.mdata().pencil()
              ? View.imgMenu("pencil", _("Change to pen"))
              : View.imgMenu("pen", _("Change to pencil"))
            )
          )
          .add(Ui.link(Main.clearSudoku/**/)
            .add(Model.mdata().pencil()
              ? View.imgMenu("gtk-clear", _("Clear pencil"), true)
              : View.imgMenu("gtk-clear", _("Clear all"))
            )
          )
          .add(Ui.link(Main.helpSudoku/**/)
            .add(View.imgMenu("emblem-important", _("Search mistakes")))
          )
          .add(Ui.link(Main.solveSudoku/**/)
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
          .add($("button").text(_("Accept")).on("click", Main.copyAccept/**/))
          .add($("span").klass("menu").html(""))
          .add($("button").text(_("Cancel")).on("click", Main.copyCancel/**/))
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
          .add($("button").text(_("Cancel")).on("click", Main.loadCancel/**/))
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
          .add($("button").text(_("Accept")).on("click", Main.solveAccept/**/))
          .add($("span").style("padding-right:5px;"))
        )
      ));
  }

  static mkEndMenu () {
    let tm = Model.convertScs(Model.last().time());
    menu.removeAll().add(
      $("table").att("align", "center").add($("tr")
        .add($("td").klass("menu")
          .style("white-space: nowrap;padding:10px;")
          .add(Ui.img("win" + Rnd.i(5)).style("vertical-align:middle"))
          .add($("span").klass("menu")
            .html(_args(
              _("<br>View-mkEndMenu.%0%1%2<br>"),
              tm[0], tm[1], tm[2])))
          .add($("button").text(_("Continue")).on("click", Main.newSudoku/**/))
          .add($("span").style("padding-right:5px;"))
        )
      ));
  }

  static mkNumberKeys () {
    let mkf = n => {
      return (ev) => { Main.typeNumber(n); }
    }
    return $("table").att("align", "center")
      .add($("tr")
        .addIt(It.range(1, 6).map(function (n) {
          return $("td").add(Ui.link(mkf(n)).add(
            View.tracker().get("k" + (n)).klass("frame")
          ));
        })))
      .add($("tr")
        .addIt(It.range(6, 10).map(function (n) {
          return $("td").add(Ui.link(mkf(n)).add(
            View.tracker().get("k" + (n)).klass("frame")
          ));
        }))
        .add($("td")
          .add(Ui.link(mkf(0)).add(View.tracker().get("k0").klass("frame"))))
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
    Model.setPage(Model.PageMain());
    board = new Big(Model.last());

    board.select(Model.last().cell()[0], Model.last().cell()[1]);
    View.mkMainMenu();
    View.mkBody($("table").att("align", "center")
      .style("border-collapse : collapse;")
      .add($("tr")
        .add($("td").att("colspan", 2)
          .add(board.element()))
      )
      .add($("tr").add($("td").att("colspan", 2).html("<hr>")))
      .add($("tr")
        .add($("td").klass("lastL").html(Model.mkDate(
          Model.mdata().lang(),
          DateDm.restore(Model.last().date())
        )))
        .add(timeCell.html(
          Model.formatScs(Model.last().time())
        ))
      )
      .add($("tr").add($("td").att("colspan", 2).html("<hr>")))
      .add($("tr").add($("td").att("colspan", 2).add(View.mkNumberKeys())))
    );
    Main.controlEnd();
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
    Model.setPage(Model.PageCopy());
    board = new Big(Model.copy());
    board.select(Model.copy().cell()[0], Model.copy().cell()[1]);
    View.mkCopyMenu();
    View.mkBody($("table").att("align", "center")
      .style("border-collapse : collapse;")
      .add($("tr").add($("td").add(board.element())))
      .add($("tr").add($("td").html("<hr>")))
      .add($("tr").add($("td").add(View.mkNumberKeys())))
    );
  }

  static loadShow() {
    View.mkLoadMenu();
    if (Model.mdata().memo().length === 0) {
      View.mkBody($("table").att("align", "center").add($("tr")
        .add($("td").klass("frame").html(_("Without records")))));
      return;
    }
    let ix = 0;
    View.mkBody($("table").att("align", "center")
      .addIt(It.range(3).map(function (i) {
        return $("tr").addIt(It.range(3).map(function (i) {
          let data = Model.mdata().memo()[ix++];
          if (data !== undefined) {
            return $("td")
              .add(Ui.link(e => {Main.loadSelect(data)})
                .add(new Little(data).element()));
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
          .add(board.element()))
      )
      .add($("tr")
        .add($("td").att("colspan", 2).html("<hr>"))
      )
      .add($("tr")
        .add($("td").klass("lastL").html(Model.mkDate(
          Model.mdata().lang(),
          DateDm.restore(Model.last().date())
        )))
        .add($("td").klass("lastR").html(
          Model.formatScs(Model.last().time())
        ))
      )
    );
  }

  static solveShow () {
    Model.setPage(Model.PageSolve());
    board = new Big(Model.last());
    View.mkSolveMenu();
    View.showBoard();
    board.markSolved();
  }

  static endShow() {
    View.mkEndMenu();
    View.showBoard();
  }

}}

