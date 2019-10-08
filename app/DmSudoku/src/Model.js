// Copyright 05-Sep-2017 ºDeme
// GNU General Public License - V3 <http://www.gnu.org/licenses/>

import Sudoku from "./Sudoku.js";
import It from "./dmjs/It.js";
import DateDm from "./dmjs/DateDm.js";

export class SudokuDef {
  /**
   * @param {!Array<!Array<number>>} sudoku
   * @param {!Array<!Array<number>>} root
   */
  constructor (
    sudoku,
    root
  ) {
    /** @private */
    this._sudoku = sudoku;
    /** @private */
    this._root = root;
  }

  /** @return {!Array<!Array<number>>} */
  sudoku () {
    return this._sudoku;
  }

  /** @return {!Array<!Array<number>>} */
  root () {
    return this._root;
  }

  /** @return {!Array<?>} */
  serialize () {
    return [
      this._sudoku,
      this._root
    ];
  }

  /**
   * @param {!Array<?>} serial
   * @return {!SudokuDef}
   */
  static restore (serial) {
    return new SudokuDef(
      serial[0],
      serial[1]
    );
  }
}

export class SudokuData {
  /**
   * @param {number} id
   * @param {!Array<number>} date DateDm serialized
   * @param {number} time
   * @param {!Array<number>} cell Used [row, column]
   * @param {!Array<!Array<number>>} sudoku
   * @param {!Array<!Array<number>>} root
   * @param {!Array<!Array<number>>} user
   * @param {!Array<!Array<boolean>>} pencil
   */
  constructor (
    id,
    date,
    time,
    cell,
    sudoku,
    root,
    user,
    pencil
  ) {
    /** @private */
    this._id = id;
    /** @private */
    this._date = date;
    /** @private */
    this._time = time;
    /** @private */
    this._cell = cell;
    /** @private */
    this._sudoku = sudoku;
    /** @private */
    this._root = root;
    /** @private */
    this._user = user;
    /** @private */
    this._pencil = pencil;
  }

  /** @return {number} */
  id () {
    return this._id;
  }

  /** @return {!Array<number>} */
  date () {
    return this._date;
  }

  /** @return {number} */
  time () {
    return this._time;
  }

  /** @param {number} value */
  setTime (value) {
    this._time = value;
  }

  /** @return {!Array<number>} */
  cell () {
    return this._cell;
  }

  /** @return {!Array<!Array<number>>} */
  sudoku () {
    return this._sudoku;
  }

  /** @return {!Array<!Array<number>>} */
  root () {
    return this._root;
  }

  /** @return {!Array<!Array<number>>} */
  user () {
    return this._user;
  }

  /** @return {!Array<!Array<boolean>>} */
  pencil () {
    return this._pencil;
  }

  /** @return {!Array<?>} */
  serialize () {
    return [
      this._id,
      this._date,
      this._time,
      this._cell,
      this._sudoku,
      this._root,
      this._user,
      this._pencil
    ];
  }

  /**
   * @param {!Array<?>} serial
   * @return {!SudokuData}
   */
  static restore (serial) {
    return new SudokuData(
      serial[0],
      serial[1],
      serial[2],
      serial[3],
      serial[4],
      serial[5],
      serial[6],
      serial[7]
    );
  }
}

export class Data {
  /**
   * @param {!Array<SudokuDef>} cache
   * @param {!Array<!SudokuData>} memo
   * @param {string} lang "en" or "es"
   * @param {number} level 1 to 5 inclusive
   * @param {boolean} pencil If pencil is activated
   */
  constructor (
    cache,
    memo,
    lang,
    level,
    pencil
  ) {
    /** @private */
    this._cache = cache;
    /** @private */
    this._memo = memo;
    /** @private */
    this._lang = lang;
    /** @private */
    this._level = level;
    /** @private */
    this._pencil = pencil;
  }

  /** @return {!Array<SudokuDef>} */
  cache () {
    return this._cache;
  }

  /** @param {!Array<SudokuDef>} value */
  setCache (value) {
    this._cache = value;
  }

  /** @return {!Array<!SudokuData>} */
  memo () {
    return this._memo;
  }

  /** @param {!Array<!SudokuData>} value */
  setMemo (value) {
    this._memo = value;
  }

  /** @return {string} */
  lang () {
    return this._lang;
  }

  /** @param {string} value */
  setLang (value) {
    this._lang = value;
  }

  /** @return {number} */
  level () {
    return this._level;
  }

  /** @param {number} value */
  setLevel (value) {
    this._level = value;
  }

  /** @return {boolean} */
  pencil () {
    return this._pencil;
  }

  /** @param {boolean} value */
  setPencil (value) {
    this._pencil = value;
  }

  /** @return {!Array<?>} */
  serialize () {
    return [
      [...It.from(this._cache).map(sd => sd === null ? sd : sd.serialize())],
      [...It.from(this._memo).map(sd => sd.serialize())],
      this._lang,
      this._level,
      this._pencil
    ];
  }

  /**
   * @param {!Array<?>} serial
   * @return {!Data}
   */
  static restore (serial) {
    return new Data(
      [...It.from(serial[0]).map(s => s === null ? s : SudokuDef.restore(s))],
      [...It.from(serial[1]).map(s => SudokuData.restore(s))],
      serial[2],
      serial[3],
      serial[4]
    );
  }
}

export class WorkerRequest {
  /**
   * @param {boolean} isCache
   * @param {number} level
   */
  constructor (
    isCache,
    level
  ) {
    /** @private */
    this._isCache = isCache;
    /** @private */
    this._level = level;
  }

  /** @return {boolean} */
  isCache () {
    return this._isCache;
  }

  /** @return {number} */
  level () {
    return this._level;
  }

  /** @return {!Array<?>} */
  serialize () {
    return [
      this._isCache,
      this._level
    ];
  }

  /**
   * @param {!Array<?>} serial
   * @return {!WorkerRequest}
   */
  static restore (serial) {
    return new WorkerRequest(
      serial[0],
      serial[1]
    );
  }
}

export class WorkerResponse {
  /**
   * @param {boolean} isCache
   * @param {number} level
   * @param {!SudokuData} sudokuData
   */
  constructor (
    isCache,
    level,
    sudokuData
  ) {
    /** @private */
    this._isCache = isCache;
    /** @private */
    this._level = level;
    /** @private */
    this._sudokuData = sudokuData;
  }

  /** @return {boolean} */
  isCache () {
    return this._isCache;
  }

  /** @return {number} */
  level () {
    return this._level;
  }

  /** @return {!SudokuData} */
  sudokuData () {
    return this._sudokuData;
  }

  /** @return {!Array<?>} */
  serialize () {
    return [
      this._isCache,
      this._level,
      this._sudokuData.serialize()
    ];
  }

  /**
   * @param {!Array<?>} serial
   * @return {!WorkerResponse}
   */
  static restore (serial) {
    return new WorkerResponse(
      serial[0],
      serial[1],
      SudokuData.restore(serial[2])
    );
  }
}


let data = new Data(
  [null, null, null, null, null],
  [],
  "es",
  5, // Conected with initial definition of Model.last
  false
);
let last = Sudoku.mkDef(new SudokuDef(
  [
    [2, 8, 5, 6, 3, 9, 1, 4, 7],
    [9, 1, 7, 4, 2, 8, 6, 3, 5],
    [3, 6, 4, 5, 1, 7, 8, 2, 9],
    [8, 9, 6, 2, 4, 5, 3, 7, 1],
    [1, 4, 2, 7, 8, 3, 9, 5, 6],
    [5, 7, 3, 1, 9, 6, 2, 8, 4],
    [4, 3, 8, 9, 7, 1, 5, 6, 2],
    [6, 2, 9, 8, 5, 4, 7, 1, 3],
    [7, 5, 1, 3, 6, 2, 4, 9, 8]],
  [
    [-1, -1, -1, -1, 3, -1, -1, -1, 7],
    [9, -1, -1, 4, -1, -1, 6, -1, -1],
    [-1, -1, -1, -1, -1, 7, -1, -1, -1],
    [8, -1, -1, -1, -1, 5, 3, -1, 1],
    [1, -1, -1, -1, 8, -1, 9, 5, -1],
    [5, 7, -1, 1, -1, -1, -1, 8, -1],
    [-1, 3, -1, 9, -1, -1, 5, 6, -1],
    [6, -1, 9, 8, -1, -1, -1, -1, 3],
    [-1, 5, 1, 3, -1, 2, -1, -1, -1]]
));
let copy = SudokuData.restore(last.serialize());
let page = 0; // Model.PageMain()
let correction = false;

export class Model {
  /**
   * Sequence steps according to next rules:
   *    1. Starts calling 'next()'. If next() result is true, calls forward().
   *       Otherwise calls backward()
   *    2. If forward() returns 'true', calls next(). Otherwise finishes
   *       returning 'true'
   *    3. If backward() retuns 'true', calls next(). Otherwise finishes
   *       returning 'false'
   * @param {function():boolean} backward
   * @param {function():boolean} next
   * @param {function():boolean} forward
   * @return {boolean}
   */
  static linearGame (backward, next, forward) {
    for (;;) {
      if (next()) {
        if (!forward()) return true;
      } else if (!backward()) {
        return false;
      }
    }
  }

  /**
   * Returns the game number of solutions. Parameters are like in
   * 'linearGame()'
   * @param {function():boolean} backward
   * @param {function():boolean} next
   * @param {function():boolean} forward
   * @return {number}
   */
  static linearGameSolutions (backward, next, forward) {
    let r = 0;
    for (;;) {
      if (next()) {
        if (!forward()) {
          ++r;
          if (!backward()) return r;
        }
      } else if (!backward()) {
        return r;
      }
    }
  }

  /**
   * Returns 0 if there not is any solution, 1 if there is only one and 2
   * if there are meny of them.
   * @param {function():boolean} backward
   * @param {function():boolean} next
   * @param {function():boolean} forward
   * @return {number}
   */
  static linearGameSingle (backward, next, forward) {
    let r = 0;
    for(;;) {
      if (next()) {
        if (!forward()) {
          ++r;
          if (r > 1 || !backward()) return r;
        }
      } else if (!backward()) {
        return r;
      }
    }
  }

  /**
   * @param {string} lang
   * @param {!DateDm} d
   * @return {string}
   */
  static mkDate (lang, d) {
    if (lang === "es") {
      return d.format("%D-%b-%Y");
    }
    const months = DateDm.months();
    DateDm.setMonths([
      "Jan", "Feb", "Mar", "Apr", "May", "Jun",
      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
    ]);
    const r = d.format("%D-%b-%Y");
    DateDm.setMonths(months);
    return r;
  }

  /**
   * @param {number} s
   * @return {string}
   */
  static formatScs (s) {
    const arr = Model.convertScs(s);
    return arr[0] + ":" + arr[1] + ":" + arr[2];
  }

  /**
   * @param {number} s
   * @return {!Array<string>}
   */
  static convertScs (s) {
    /** @type function(number):string } */
    const n2 = n => {
      const r = String(n);
      if (r.length < 2) return "0" + r;
      return r;
    };
    const m = Math.floor(s / 60);
    const h = Math.floor(m / 60);
    return [String(h), n2(m - h * 60), n2(s - m * 60)];
  }

  /** @return {number} */
  static PageMain () {
    return 0;
  }

  /** @return {number} */
  static PageCopy () {
    return Model.PageMain() + 1;
  }

  /** @return {number} */
  static PageSolve () {
    return Model.PageCopy() + 1;
  }

  /** @return {number} */
  static CursorUp () {
    return 0;
  }

  /** @return {number} */
  static CursorDown () {
    return Model.CursorUp() + 1;
  }

  /** @return {number} */
  static CursorLeft () {
    return Model.CursorDown() + 1;
  }

  /** @return {number} */
  static CursorRight () {
    return Model.CursorLeft() + 1;
  }

  /**
   * Saved in store
   * @return {!Data}
   */
  static mdata () {
    return data;
  }

  /** @param {!Data} value */
  static setMdata (value) {
    data = value;
  }

  /**
   * Saved in store
   * @return {!SudokuData}
   */
  static last () {
    return last;
  }

  /** @param {!SudokuData} value */
  static setLast (value) {
    last = value;
  }

  /**
   * User definied new sudoku
   * @return {!SudokuData}
   */
  static copy () {
    return copy;
  }

  /** @param {!SudokuData} value */
  static setCopy (value) {
    copy = value;
  }

  /**
   * Page in which the program is.
   * @return {number}
   */
  static page () {
    return page;
  }

  /** @param {number} value */
  static setPage (value) {
    page = value;
  }

  /**
   * If its value is 'true' sudoku has wrong numbers on red.
   * @return {boolean}
   */
  static correction () {
    return correction;
  }

  /** @param {boolean} value */
  static setCorrection (value) {
    correction = value;
  }

}

/// Counter for bidimentsional arrays
export class BiCounter {
  /**
   * Create the counter.
   * @param {number} rowSize Maximun row value (exclusive)
   * @param {number} colSize Maximun column value (exclusive)
   */
  constructor (rowSize, colSize) {
    /** @private */
    this._rowSize = rowSize;
    /** @private */
    this._colSize = colSize;
    /**
     * @private
     * @type {number}
     */
    this._rowLimit = rowSize - 1;
    /**
     * @private
     * @type {number}
     */
    this._colLimit = colSize - 1;
    /** @private */
    this._row = 0;
    /** @private */
    this._col = 0;
  }

  /** @return {!number} */
  rowSize () {
    return this._rowSize;
  }

  /** @return {!number} */
  colSize () {
    return this._colSize;
  }

  /** @return {!number} */
  row () {
    return this._row;
  }

  /** @return {!number} */
  col () {
    return this._col;
  }

  /**
   * Increments counter, returning 'false' if it is not possible.
   * @return {boolean}
   */
  inc () {
    ++this._col;
    if (this._col === this._colSize) {
      if (this._row === this._rowLimit) return false;
      this._col = 0;
      ++this._row;
    }
    return true;
  }

  /**
   * Decrements counter, returning 'false' if it is not possible.
   * @return {boolean}
   */
  dec () {
    --this._col;
    if (this._col === -1) {
      if (this._row === 0) return false;
      this._col = this._colLimit;
      --this._row;
    }
    return true;
  }
}
