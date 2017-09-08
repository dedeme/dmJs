// Copyright 05-Sep-2017 ºDeme
// GNU General Public License - V3 <http://www.gnu.org/licenses/>

goog.provide("main");

goog.require("github.dedeme");
goog.require("Data");
goog.require("I18n");
goog.require("View");

{
  const versionId = "__Sudoku_store_version";
  const lastId = "__Sudoku_store_last";
  const dataId = "__Sudoku_store_data";

  let interval = null;

  let saveData = function () {
    Store.put(dataId, JSON.stringify(Model.data.serialize()));
  }

  let saveLast = function () {
    Store.put(lastId, JSON.stringify(Model.last.serialize()));
  }

  /** @constant */
  main.version = "v. 201709";

  /**
   * @constant
   * @private
   */
  main.sudokuMaker = new Worker("sudokuMaker.js");

  /** @type {function ()} */
  main.main = function () {
    let storeVersion = Store.take(versionId);
    let versionOk = true;
    if (storeVersion === null || storeVersion !== main.version) {
      Store.put(versionId, main.version);
      versionOk = false;
    }

    let jdata = Store.take(dataId);
    if (!versionOk || jdata == null) {
      saveData();
    } else {
      Model.data = Data.restore(/** @type {!Array<?>} */(JSON.parse(jdata)));
    }

    let jlast = Store.take(lastId);
    if (!versionOk || jlast == null) {
      saveLast();
    } else {
      Model.last = SudokuData.restore(
        /** @type {!Array<?>} */(JSON.parse(jlast))
      );
    }

  Store.del(lastId);Store.del(dataId);
    I18n.lang = Model.data.lang === "es" ? I18n.es : I18n.en;

    View.newLink().removeAll().add(Ui.link(main.newSudoku)
      .add(View.imgMenu("filenew", _("New"))));
    View.dom();

    main.sudokuMaker.onmessage = e => {
      let rp = WorkerResponse.restore(e.data);
      if (rp.isCache()) {
        Model.data.cache[rp.level() - 1] = new SudokuDef (
          rp.sudokuData().sudoku(),
          rp.sudokuData().root()
        );
        saveData();
        View.newLink().removeAll().add(Ui.link(main.newSudoku)
          .add(View.imgMenu("filenew", _("New"))));
      } else {
        Model.last = rp.sudokuData();
        saveLast();
        View.mainShow();
      }
    };

    window.document.addEventListener('keydown', event => {
      /** @type {SudokuData} */
      let sData = Model.page === Model.PageType.MainPage ? Model.last
        : Model.page === Model.PageType.CopyPage ? Model.copy
        : null;

      if (sData != null) {
        let cell = sData.cell();
        let board = View.board();
        switch (event.keyCode) {
          case 37:
            board.cursor(
              Model.CursorMove.CursorLeft, cell[0], cell[1]
            ); break;
          case 38:
            board.cursor(
              Model.CursorMove.CursorUp, cell[0], cell[1]
            ); break;
          case 39:
            board.cursor(
              Model.CursorMove.CursorRight, cell[0], cell[1]
            ); break;
          case 40:
            board.cursor(
              Model.CursorMove.CursorDown, cell[0], cell[1]
            ); break;
          case 8 | 32 | 46:
            board.put(cell[0], cell[1], -1); break;
          default: {
            let k = event.keyCode;
            if (k > 96 && k < 106) {
              board.put(cell[0], cell[1], k - 96);
            } else if (k > 48 && k < 58) {
              board.put(cell[0], cell[1], k - 48);
            } else {
              return;
            }
          }
        }
        event.preventDefault();
      }
    });

    View.mainShow();

    if (interval !== null) {
      clearInterval(interval);
    }
    interval = setInterval(() => {
      ++Model.last.time;
      saveLast();
      View.timeCell().html(Model.formatScs(Model.last.time));
    }, 1000);

    let cache = Model.data.cache;
    for (let i = 0; i < 5; ++i) {
      if (cache[i] === null) {
        if (i == Model.data.level - 1) {
          View.newLink().removeAll()
            .add(View.imgMenu("filenew", _("New"), true));
        }
        let rq = new WorkerRequest (true, i + 1);
        main.sudokuMaker.postMessage(rq.serialize());
      }
    }

  };

  // Main menu ---------------------------------------------

  main.newSudoku = ev => {
    let cache = Model.data.cache[Model.data.level - 1];
    if (cache === null) {
      let rq = new WorkerRequest (false, Model.data.level);
      main.sudokuMaker.postMessage(rq.serialize());
      View.newShow();
    } else {
      Model.last = Sudoku.mkDef(cache);
      saveLast();
      Model.data.cache[Model.data.level - 1] = null;
      saveData();
      main.main();
    }
  }

 main.copySudoku = ev => {
    Model.copy = new SudokuData (
      0,
      [],
      0,
      [0, 0],
      Sudoku.mkEmpty().board,
      Sudoku.mkEmpty().board,
      Sudoku.mkEmpty().board,
      It.range(9).map(i => It.range(9).map(j => false).to()).to()
    )
    View.copyShow();
  }

  main.readSudoku = ev => {
    View.loadShow();
  }

  main.saveSudoku = ev => {
    /** @type {!SudokuData} */
    let data = SudokuData.restore(Model.last.serialize());
    Model.data.memo = It.from(Model.data.memo)
      .filter(function (e) { return data.id != e.id; })
      .add0(data)
      .take(9)
      .to();
    saveData();
    alert(_("Sudoku has been saved"));
  }

  main.upLevel = ev => {
    if (Model.data.level < 5) ++Model.data.level;
    saveData();

    if (Model.data.cache[Model.data.level - 1] == null) {
      View.newLink().removeAll().add(View.imgMenu("filenew", _("New"), true));
    } else {
      View.newLink().removeAll().add(Ui.link(main.newSudoku)
        .add(View.imgMenu("filenew", _("New"))));
    }
    View.mkMainMenu();
  }

  main.downLevel = ev => {
    if (Model.data.level > 1) --Model.data.level;
    saveData();

    if (Model.data.cache[Model.data.level - 1] == null) {
      View.newLink().removeAll().add(View.imgMenu("filenew", _("New"), true));
    } else {
      View.newLink().removeAll().add(Ui.link(main.newSudoku)
        .add(View.imgMenu("filenew", _("New"))));
    }
    View.mkMainMenu();
  }

  main.changeDevice = ev => {
    Model.data.pencil = !Model.data.pencil;
    saveData();
    View.mkMainMenu();
  }

  main.clearSudoku = ev => {
    var tx = Model.data.pencil
      ? _("Clear pencil.\nContinue?")
      : _("Clear all.\nContinue?");
    if (confirm(tx)) {
      View.board().clear();
      saveLast();
    }
  }

  main.helpSudoku = ev => {
    if (Model.correction) {
      Model.correction = false;
      View.mainShow();
    } else {
      Model.correction = true;
      View.board().markErrors();
    }
  }

  main.solveSudoku = ev => {
    if (confirm(_("Solve sudoku.\nContinue?"))) {
      View.solveShow();
    }
  }

  main.changeLang = ev => {
    Model.data.lang = Model.data.lang === "en" ? "es" : "en";
    saveData();
    main.main();
  }

  // Copy menu ---------------------------------------------

  main.copyAccept = ev => {
    let s = Model.copy.user();
    let sudoku = new Sudoku(s);
    if (sudoku.errors().length > 0) {
      alert(_args(
        _("There are %0 errors in data"), "" + sudoku.errors().length
      ));
      View.board().markErrors();
      return;
    }
    let cells = sudoku.cellsSet();
    let sols = sudoku.solutions();
    if (sols === 0) {
      alert(_("Sudoku has no sulution"));
      return;
    }
    if (sols === 2) {
      if (!confirm(_("Sudoku has more than one solution.\nContinue?"))) {
        return;
      }
    }

    let ix = 0;
    while (s[0][ix] !== -1) {
      ++ix;
    }
    Model.last = new SudokuData (
      DateDm.now().toTime(),
      DateDm.now().serialize(),
      0,
      [0, ix],
      sudoku.solve().board,
      It.from(s).map(a => It.from(a).map(e => e ).to()).to(),
      s,
      It.range(9).map(i => It.range(9).map(j => false).to()).to()
    );
    saveLast();
    View.mainShow();
  }

  main.copyCancel = ev => {
    View.mainShow();
  }

  // Load menu ---------------------------------------------

  /** @param {!SudokuData} data */
  main.loadSelect = data => {
    Model.last = SudokuData.restore(data.serialize());
    Model.data.memo = It.from(Model.data.memo)
      .filter(e => e.id != data.id)
      .add0(data)
      .to();
    saveLast();
    saveData();
    View.mainShow();
  }

  main.loadCancel = ev => View.mainShow();

  // Solve menu --------------------------------------------

  main.solveAccept = ev => {
    View.mainShow();
  }

  // Big sudoku --------------------------------------------

  /**
   * @param {number} row
   * @param {number} col
   */
  main.sudokuClick = (row, col) => {
    if (Model.page === Model.PageType.MainPage) {
      Model.last.cell()[0] = row;
      Model.last.cell()[1] = col;
      saveLast();
      View.mainShow();
    } else if (Model.page === Model.PageType.CopyPage) {
      Model.copy.cell()[0] = row;
      Model.copy.cell()[1] = col;
      View.copyShow();
    }
  }

  // Control end -------------------------------------------

  main.controlEnd = () => {
    let finished = It.zip(
      It.from(Model.last.sudoku()),
      It.from(Model.last.user())).all(function (e) {
        return It.from(e.e1).eq(It.from(e.e2));
      });
    if (finished) {
      View.endShow();
    }
  }

  // Numbers -----------------------------------------------

  /**
   * @param {number} n
   */
  main.typeNumber = n => {
    /** @type {SudokuData} */
    let sData = Model.page === Model.PageType.MainPage ? Model.last
      : Model.page === Model.PageType.CopyPage ? Model.copy
      : null;

    if (sData !== null) {
      let cell = sData.cell();
      let board = View.board();
      if (n === 0) {
        board.put(cell[0], cell[1], -1);
      } else {
        board.put(cell[0], cell[1], n);
      }
    }
  }

  // Program entry -----------------------------------------

  main.main();
}
