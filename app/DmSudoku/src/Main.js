// Copyright 05-Sep-2017 ºDeme
// GNU General Public License - V3 <http://www.gnu.org/licenses/>

import View from "./View.js";
import Sudoku from "./Sudoku.js";
import {
  Model, SudokuData, WorkerRequest, WorkerResponse, Data, SudokuDef
} from "./Model.js";
import {I18n, _, _args} from "./I18n.js";
import Store from "./dmjs/Store.js";
import Ui from "./dmjs/Ui.js";
import It from "./dmjs/It.js";
import DateDm from "./dmjs/DateDm.js";

const versionId = "__Sudoku_store_version";
const lastId = "__Sudoku_store_last";
const dataId = "__Sudoku_store_data";

const version = "v. 201812";

let interval = null;

const saveData = function () {
  Store.put(dataId, JSON.stringify(Model.mdata().serialize()));
};

const saveLast = function () {
  Store.put(lastId, JSON.stringify(Model.last().serialize()));
};

/**
 * @constant
 * @private
 */
const sudokuMaker = new Worker("sudokuMaker.js");
sudokuMaker["type"] = "module";

export default class Main {
  /** @private */
  static sudokuMaker () {
    return sudokuMaker;
  }

  /** @return {string} */
  static version () {
    return version;
  }

  /** @return {void} */
  static main () {
    const storeVersion = Store.take(versionId);
    let versionOk = true;
    if (storeVersion === null || storeVersion !== Main.version()) {
      Store.put(versionId, Main.version());
      versionOk = false;
    }

    const jdata = Store.take(dataId);
    if (!versionOk || jdata === null) {
      saveData();
    } else {
      Model.setMdata(Data.restore(/** @type {!Array<?>} */(JSON.parse(jdata))));
    }

    const jlast = Store.take(lastId);
    if (!versionOk || jlast === null) {
      saveLast();
    } else {
      Model.setLast(SudokuData.restore(
        /** @type {!Array<?>} */(JSON.parse(jlast))
      ));
    }

    //  Store.del(lastId);Store.del(dataId);
    if (Model.mdata().lang() === "es") I18n.es(); else I18n.en();

    View.newLink().removeAll().add(Ui.link(Main.newSudoku/**/)
      .add(View.imgMenu("filenew", _("New"))));
    View.dom();

    Main.sudokuMaker().onmessage/**/ = e => {
      const rp = WorkerResponse.restore(e.data/**/);
      if (rp.isCache()) {
        Model.mdata().cache()[rp.level() - 1] = new SudokuDef(
          rp.sudokuData().sudoku(),
          rp.sudokuData().root()
        );
        saveData();
        View.newLink().removeAll().add(Ui.link(Main.newSudoku/**/)
          .add(View.imgMenu("filenew", _("New"))));
      } else {
        Model.setLast(rp.sudokuData());
        saveLast();
        View.mainShow();
      }
    };

    window.document/**/.addEventListener("keydown", event => {
      /** @type {SudokuData} */
      const sData = Model.page() === Model.PageMain() ? Model.last()
        : Model.page() === Model.PageCopy() ? Model.copy()
          : null;

      if (sData !== null) {
        const cell = sData.cell();
        const board = View.board();
        switch (event.keyCode/**/) {
        case 37:
          board.cursor(
            Model.CursorLeft(), cell[0], cell[1]
          ); break;
        case 38:
          board.cursor(
            Model.CursorUp(), cell[0], cell[1]
          ); break;
        case 39:
          board.cursor(
            Model.CursorRight(), cell[0], cell[1]
          ); break;
        case 40:
          board.cursor(
            Model.CursorDown(), cell[0], cell[1]
          ); break;
        case 8 | 32 | 46:
          board.put(cell[0], cell[1], -1); break;
        default: {
          const k = event.keyCode/**/;
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
      Model.last().setTime(Model.last().time() + 1);
      saveLast();
      View.timeCell().html(Model.formatScs(Model.last().time()));
    }, 1000);

    const cache = Model.mdata().cache();
    for (let i = 0; i < 5; ++i) {
      if (cache[i] === null) {
        if (i === Model.mdata().level() - 1) {
          View.newLink().removeAll()
            .add(View.imgMenu("filenew", _("New"), true));
        }
        const rq = new WorkerRequest(true, i + 1);
        Main.sudokuMaker().postMessage(rq.serialize());
      }
    }

  }

  // Main menu ---------------------------------------------

  /**
   * @return {void}
   */
  static newSudoku () {
    const cache = Model.mdata().cache()[Model.mdata().level() - 1];
    if (cache === null) {
      const rq = new WorkerRequest(false, Model.mdata().level());
      Main.sudokuMaker().postMessage(rq.serialize());
      View.newShow();
    } else {
      Model.setLast(Sudoku.mkDef(cache));
      saveLast();
      Model.mdata().cache()[Model.mdata().level() - 1] = null;
      saveData();
      Main.main();
    }
  }

  /**
   * @return {void}
   */
  static copySudoku () {
    Model.setCopy(new SudokuData(
      0,
      [],
      0,
      [0, 0],
      Sudoku.mkEmpty().board(),
      Sudoku.mkEmpty().board(),
      Sudoku.mkEmpty().board(),
      [...It.range(9)].map(() => [...It.range(9)].map(() => false))
    ));
    View.copyShow();
  }

  /**
   * @return {void}
   */
  static readSudoku () {
    View.loadShow();
  }

  /**
   * @return {void}
   */
  static saveSudoku () {
    /** @type {!SudokuData} */
    const data = SudokuData.restore(Model.last().serialize());
    Model.mdata().setMemo([...It.from(Model.mdata().memo())
      .filter(function (e) {
        return data.id() !== e.id();
      })
      .unshift(data)
      .take(9)]
    );
    saveData();
    alert(_("Sudoku has been saved"));
  }

  /**
   * @return {void}
   */
  static upLevel () {
    if (Model.mdata().level() < 5) {
      Model.mdata().setLevel(Model.mdata().level() + 1);
    }
    saveData();

    if (Model.mdata().cache()[Model.mdata().level() - 1] === null) {
      View.newLink().removeAll().add(View.imgMenu("filenew", _("New"), true));
    } else {
      View.newLink().removeAll().add(Ui.link(Main.newSudoku/**/)
        .add(View.imgMenu("filenew", _("New"))));
    }
    View.mkMainMenu();
  }

  /**
   * @return {void}
   */
  static downLevel () {
    if (Model.mdata().level() > 1) {
      Model.mdata().setLevel(Model.mdata().level() - 1);
    }
    saveData();

    if (Model.mdata().cache()[Model.mdata().level() - 1] === null) {
      View.newLink().removeAll().add(View.imgMenu("filenew", _("New"), true));
    } else {
      View.newLink().removeAll().add(Ui.link(Main.newSudoku/**/)
        .add(View.imgMenu("filenew", _("New"))));
    }
    View.mkMainMenu();
  }

  /**
   * @return {void}
   */
  static changeDevice () {
    Model.mdata().setPencil(!Model.mdata().pencil());
    saveData();
    View.mkMainMenu();
  }

  /**
   * @return {void}
   */
  static clearSudoku () {
    const tx = Model.mdata().pencil()
      ? _("Clear pencil.\nContinue?")
      : _("Clear all.\nContinue?");
    if (confirm(tx)) {
      View.board().clear();
      saveLast();
    }
  }

  /**
   * @return {void}
   */
  static helpSudoku () {
    if (Model.correction()) {
      Model.setCorrection(false);
      View.mainShow();
    } else {
      Model.setCorrection(true);
      View.board().markErrors();
    }
  }

  /**
   * @return {void}
   */
  static solveSudoku () {
    if (confirm(_("Solve sudoku.\nContinue?"))) {
      View.solveShow();
    }
  }

  /**
   * @return {void}
   */
  static changeLang () {
    Model.mdata().setLang(Model.mdata().lang() === "en" ? "es" : "en");
    saveData();
    Main.main();
  }

  // Copy menu ---------------------------------------------

  static copyAccept () {
    const s = Model.copy().user();
    const sudoku = new Sudoku(s);
    if (sudoku.errors().length > 0) {
      alert(_args(
        _("There are %0 errors in data"), String(sudoku.errors().length)
      ));
      View.board().markErrors();
      return;
    }
    //    const cells = sudoku.cellsSet();
    const sols = sudoku.solutions();
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
    Model.setLast(new SudokuData(
      DateDm.now().toTime(),
      DateDm.now().serialize(),
      0,
      [0, ix],
      sudoku.solve().board(),
      [...It.from(s).map(a => [...It.from(a).map(e => e)])],
      s,
      [...It.range(9).map(() => [...It.range(9).map(() => false)])]
    ));
    saveLast();
    View.mainShow();
  }

  static copyCancel () {
    View.mainShow();
  }

  // Load menu ---------------------------------------------

  /** @param {!SudokuData} data */
  static loadSelect (data) {
    Model.setLast(SudokuData.restore(data.serialize()));
    Model.mdata().setMemo([...It.from(Model.mdata().memo())
      .filter(e => e.id() !== data.id())
      .unshift(data)]);
    saveLast();
    saveData();
    View.mainShow();
  }

  static loadCancel () {
    View.mainShow();
  }

  // Solve menu --------------------------------------------

  static solveAccept () {
    View.mainShow();
  }

  // Big sudoku --------------------------------------------

  /**
   * @param {number} row
   * @param {number} col
   */
  static sudokuClick (row, col) {
    if (Model.page() === Model.PageMain()) {
      Model.last().cell()[0] = row;
      Model.last().cell()[1] = col;
      saveLast();
      View.mainShow();
    } else if (Model.page() === Model.PageCopy()) {
      Model.copy().cell()[0] = row;
      Model.copy().cell()[1] = col;
      View.copyShow();
    }
  }

  // Control end -------------------------------------------

  static controlEnd () {
    const finished = It.zip(
      It.from(Model.last().sudoku()),
      It.from(Model.last().user())
    ).every(function (e) {
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
  static typeNumber (n) {
    /** @type {SudokuData} */
    const sData = Model.page() === Model.PageMain() ? Model.last()
      : Model.page() === Model.PageCopy() ? Model.copy()
        : null;

    if (sData !== null) {
      const cell = sData.cell();
      const board = View.board();
      if (n === 0) {
        board.put(cell[0], cell[1], -1);
      } else {
        board.put(cell[0], cell[1], n);
      }
    }
  }
}
