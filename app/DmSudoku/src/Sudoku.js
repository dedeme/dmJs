// Copyright 05-Sep-2017 ºDeme
// GNU General Public License - V3 <http://www.gnu.org/licenses/>

import It from "./dmjs/It.js";
import Rbox from "./dmjs/Rbox.js";
import DateDm from "./dmjs/DateDm.js";
// eslint-disable-next-line
import {BiCounter, Model, SudokuData, SudokuDef} from "./Model.js";

export default class Sudoku {

  /** @param {!Array<!Array<number>>} board */
  constructor (board) {
    /** @private */
    this._board = board;
  }

  /** @return {!Array<!Array<number>>} */
  board () {
    return this._board;
  }

  /** @return {!Sudoku} */
  copy () {
    const b = [];
    It.from(this._board).each(row => {
      b.push([...It.from(row)]);
    });
    return new Sudoku(b);
  }

  /**
   * @private
   * @param {number} row
   * @param {number} col
   * @param {number} value
   * @return {boolean}
   */
  isRightValue (row, col, value) {
    const row2 = Math.floor(row / 3) * 3;
    const col2 = Math.floor(col / 3) * 3;

    for (let r = 0; r < 9; ++r) {
      if (r !== row && this._board[r][col] === value) return false;
    }
    for (let c = 0; c < 9; ++c) {
      if (c !== col && this._board[row][c] === value) return false;
    }
    for (let r = row2; r < row2 + 3; ++r) {
      for (let c = col2; c < col2 + 3; ++c) {
        if ((r !== row || c !== col) && this._board[r][c] === value) {
          return false;
        }
      }
    }

    return true;
  }

  /**
   * Returns a new solved sudoku or null if is not posible to solve it
   * @return {Sudoku}
   */
  solve () {
    const c = new BiCounter(9, 9);
    const su = Sudoku.mkEmpty();
    const boxes = [...It.range(9)].map(row =>
      [...It.range(9)].map(col => {
        const n = this._board[row][col];
        if (n === -1) {
          return It.from([1, 2, 3, 4, 5, 6, 7, 8, 9]);
        }
        su.board()[row][col] = n;
        return It.from([n]);
      })
    );

    /** @return {boolean} */
    const backward = () => {
      const row = c.row();
      const col = c.col();
      const n = this._board[row][col];
      su.board()[row][col] = n;
      boxes[row][col] = n === -1
        ? It.from([1, 2, 3, 4, 5, 6, 7, 8, 9])
        : It.from([n]);
      return c.dec();
    };

    /** @return {boolean} */
    const next = () => {
      const row = c.row();
      const col = c.col();
      const it = boxes[row][col];
      while (it.has) {
        const nx = it.next;
        const r = su.isRightValue(row, col, nx);
        if (r) {
          su.board()[row][col] = nx;
          return true;
        }
      }
      return false;
    };

    /** @return {boolean} */
    const forward = () => {
      return c.inc();
    };

    if (Model.linearGame(backward, next, forward)) {
      return su;
    }
    return null;
  }

  /**
   * Returns 0 if there not is any solution, 1 if there is only one and 2
   * if there are meny of them.
   * @return  {number}
   */
  solutions () {
    const c = new BiCounter(9, 9);
    const su = Sudoku.mkEmpty();
    const boxes = [...It.range(9)].map(row =>
      [...It.range(9)].map(col => {
        const n = this._board[row][col];
        if (n === -1) {
          return It.from([1, 2, 3, 4, 5, 6, 7, 8, 9]);
        }
        su.board()[row][col] = n;
        return It.from([n]);
      })
    );

    /** @return {boolean} */
    const backward = () => {
      const row = c.row();
      const col = c.col();
      const n = this._board[row][col];
      su.board()[row][col] = n;
      boxes[row][col] = n === -1
        ? It.from([1, 2, 3, 4, 5, 6, 7, 8, 9])
        : It.from([n]);
      return c.dec();
    };

    /** @return {boolean} */
    const next = () => {
      const row = c.row();
      const col = c.col();
      const it = boxes[row][col];
      while (it.has) {
        const nx = it.next;
        const r = su.isRightValue(row, col, nx);
        if (r) {
          su.board()[row][col] = nx;
          return true;
        }
      }
      return false;
    };

    /** @return {boolean} */
    const forward = () => {
      return c.inc();
    };

    return Model.linearGameSingle(backward, next, forward);
  }

  /**
   * Puts 'value' at row-column if 'value' is a valid number. Otherwise board
   * is not modified and it returns 'false'. Values are put from top-left to
   * bottom-right
   * @param {number} row
   * @param {number} col
   * @param {number} value
   * @return {boolean}
   */
  putSeq (row, col, value) {
    const isRight = () => {
      const row2 = Math.floor(row / 3) * 3;
      const col2 = Math.floor(col / 3) * 3;

      for (let r = 0; r < row; ++r) {
        if (this._board[r][col] === value) return false;
      }
      for (let c = 0; c < col; ++c) {
        if (this._board[row][c] === value) return false;
      }
      for (let r = row2; r < row; ++r) {
        for (let c = col2; c < col; ++c) {
          if (this._board[r][c] === value) return false;
        }
      }
      for (let r = row2; r < row; ++r) {
        for (let c = col; c < col2 + 3; ++c) {
          if (this._board[r][c] === value) return false;
        }
      }

      return true;
    };
    const r = isRight();
    if (r) this._board[row][col] = value;
    return r;
  }

  /**
   * Returns pairs [row, col] of coordinates with error.
   * @return {!Array<!Array<number>>}
   */
  errors () {
    const rs = [];
    for (let r = 0; r < 9; ++r) {
      for (let c = 0; c < 9; ++c) {
        const v = this._board[r][c];
        if (v !== -1 && !this.isRightValue(r, c, v))
          rs.push([r, c]);
      }
    }
    return rs;
  }

  /**
   * Returns the number of cells set
   * @return {number}
   */
  cellsSet () {
    return It.from(this._board).reduce(0, (seed, row) =>
      seed + It.from(row).reduce(0, (seed, v) => v === -1 ? seed : seed + 1)
    );
  }

  /**
   * Returns 'true' if the sudoku is finished
   * @return {boolean}
   */
  isCompleted () {
    for (let r = 0; r < 9; ++r) {
      for (let c = 0; c < 9; ++c) {
        if (this._board[r][c] === -1) return false;
      }
    }
    return this.errors().length === 0;
  }

  /**
   * @return {string}
   */
  toString () {
    let r = "";
    for (let row = 0; row < 9; ++row) {
      for (let col = 0; col < 9; ++col) {
        const v = this._board[row][col];
        r += v === -1 ? "-" : String(v);
      }
      r += "\n";
    }
    return r;
  }

  /** @return {!Sudoku} */
  static mkRandom () {
    const c = new BiCounter(9, 9);
    const su = Sudoku.mkEmpty();
    const boxes = [...It.range(9)].map(() =>
      [...It.range(9)].map(() => It.from([1, 2, 3, 4, 5, 6, 7, 8, 9]).shuffle())
    );

    /** @return {boolean} */
    const backward = () => {
      const row = c.row();
      const col = c.col();
      su.board()[row][col] = -1;
      boxes[row][col] = It.from([1, 2, 3, 4, 5, 6, 7, 8, 9]).shuffle();
      return c.dec();
    };

    /** @return {boolean} */
    const next = () => {
      const row = c.row();
      const col = c.col();
      const it = boxes[row][col];
      while (it.has) {
        const nx = it.next();
        if (su.putSeq(row, col, nx)) return true;
      }
      return false;
    };

    /** @return {boolean} */
    const forward = () => {
      return c.inc();
    };

    Model.linearGame(backward, next, forward);

    return su;
  }

  /** @return {!Sudoku} */
  static mkEmpty () {
    return new Sudoku([...It.range(9)]
      .map(() => [...It.range(9)].map(() => -1)));
  }

  /**
   * @param {number} l
   * @return {!SudokuData}
   */
  static mkLevel (l) {
    let s = Sudoku.mkRandom();
    let base = Sudoku.mkEmpty();
    let user = Sudoku.mkEmpty();

    const limit = l === 1 ? 0 : 25 + l;
    for (;;) {
      for (let r = 0; r < 9; ++r) {
        const ixBox = new Rbox([0, 1, 2, 3, 4, 5, 6, 7, 8]);
        for (let i = 0; i < 4; ++i) {
          const c = ixBox.next();
          const n = s.board()[r][c];
          base.board()[r][c] = n;
          user.board()[r][c] = n;
        }
      }
      if (base.solutions() === 1) break;
      base = Sudoku.mkEmpty();
      user = Sudoku.mkEmpty();
    }

    let i = 36;
    for (let r = 0; r < 9; ++r) {
      for (let c = 0; c < 9; ++c) {
        const v = base.board()[r][c];
        if (v !== -1) {
          base.board()[r][c] = -1;
          if (base.solutions() === 1) {
            user.board()[r][c] = -1;
            --i;
            if (i === limit) break;
          } else {
            base.board()[r][c] = v;
          }
        }
      }
      if (i === limit) break;
    }

    const pbox = new Rbox([0, 1, 2]);
    const rbox = new Rbox([0, 1, 2]);
    const s0 = [];
    const b0 = [];
    const u0 = [];
    for (let i = 0; i < 3; ++i) {
      const part = pbox.next();
      for (let j = 0; j < 3; ++j) {
        const row = rbox.next();
        s0.push(s.board()[part * 3 + row]);
        b0.push(base.board()[part * 3 + row]);
        u0.push(user.board()[part * 3 + row]);
      }
    }
    s = new Sudoku(s0);
    base = new Sudoku(b0);
    user = new Sudoku(u0);

    let ix = 0;
    while (base.board()[0][ix] !== -1) {
      ++ix;
    }
    return new SudokuData(
      DateDm.now().toTime(),
      DateDm.now().serialize(),
      0,
      [0, ix],
      s.board(),
      base.board(),
      user.board(),
      [...It.range(9)].map(() => [...It.range(9)].map(() => false))
    );
  }

  /**
   * @param {!SudokuDef} def
   * @return {!SudokuData}
   */
  static mkDef (def) {
    const user = [...It.from(def.root())].map(a => [...It.from(a)]);

    let ix = 0;
    while (user[0][ix] !== -1) {
      ++ix;
    }
    return new SudokuData(
      DateDm.now().toTime(),
      DateDm.now().serialize(),
      0,
      [0, ix],
      def.sudoku(),
      def.root(),
      user,
      [...It.range(9)].map(() => [...It.range(9)].map(() => false))
    );
  }

}
