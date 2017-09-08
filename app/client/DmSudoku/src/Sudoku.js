// Copyright 05-Sep-2017 ºDeme
// GNU General Public License - V3 <http://www.gnu.org/licenses/>

goog.provide("Sudoku");
goog.require("github.dedeme");

Sudoku = class {

  /** @param {!Array<!Array<number>>} board */
  constructor (board) {
    /** @private */
    this._board = board;
  }

  /** @return {!Array<!Array<number>>} */
  get board () {
    return this._board;
  }

  /** @return {!Sudoku} */
  copy () {
    let b = []
    It.from(this._board).each(row => {
      b.push(It.from(row).to())
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
    let row2 = Math.floor(row / 3) * 3;
    let col2 = Math.floor(col / 3) * 3;

    for (let r = 0; r < 9; ++r) {
      if (r != row && this._board[r][col] === value) return false;
    }
    for (let c = 0; c < 9; ++c) {
      if (c != col && this._board[row][c] === value) return false;
    }
    for (let r = row2; r < row2 + 3; ++r) {
      for (let c = col2; c < col2 + 3; ++c) {
        if ((r != row || c != col) && this._board[r][c] === value) return false;
      }
    }

    return true;
  }

  /**
   * Returns a new solved sudoku or null if is not posible to solve it
   * @return {Sudoku}
   */
  solve () {
    let c = new BiCounter(9, 9);
    let su = Sudoku.mkEmpty();
    let boxes = It.range(9).map(row =>
      It.range(9).map(col => {
        let n = this._board[row][col];
        if (n == -1) {
          return It.from([1, 2, 3, 4, 5, 6, 7, 8, 9]);
        } else {
          su.board[row][col] = n;
          return It.from([n]);
        }
      }).to()
    ).to();

    /** @return {boolean} */
    let backward = () => {
      let row = c.row();
      let col = c.col();
      let n = this._board[row][col];
      su.board[row][col] = n;
      boxes[row][col] = n === -1
        ? It.from([1, 2, 3, 4, 5, 6, 7, 8, 9])
        : It.from([n]);
      return c.dec();
    }

    /** @return {boolean} */
    let next = () => {
      let row = c.row();
      let col = c.col();
      let it = boxes[row][col];
      while (it.hasNext()) {
        let nx = it.next();
        let r = su.isRightValue(row, col, nx);
        if (r) {
          su.board[row][col] = nx;
          return true;
        }
      }
      return false;
    }

    /** @return {boolean} */
    let forward = () => {
      return c.inc();
    }

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
    let c = new BiCounter(9, 9);
    let su = Sudoku.mkEmpty();
    let boxes = It.range(9).map(row =>
      It.range(9).map(col => {
        let n = this._board[row][col];
        if (n == -1) {
          return It.from([1, 2, 3, 4, 5, 6, 7, 8, 9]);
        } else {
          su.board[row][col] = n;
          return It.from([n]);
        }
      }).to()
    ).to();

    /** @return {boolean} */
    let  backward = () => {
      let row = c.row();
      let col = c.col();
      let n = this._board[row][col];
      su.board[row][col] = n;
      boxes[row][col] = n === -1
        ? It.from([1, 2, 3, 4, 5, 6, 7, 8, 9])
        : It.from([n]);
      return c.dec();
    }

    /** @return {boolean} */
    let next = () => {
      let row = c.row();
      let col = c.col();
      let it = boxes[row][col];
      while (it.hasNext()) {
        var nx = it.next();
        var r = su.isRightValue(row, col, nx);
        if (r) {
          su.board[row][col] = nx;
          return true;
        }
      }
      return false;
    }

    /** @return {boolean} */
    let forward = () => {
      return c.inc();
    }

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
    let isRight = () => {
      let row2 = Math.floor(row / 3) * 3;
      let col2 = Math.floor(col / 3) * 3;

      for (let r = 0; r < row; ++r) {
        if (this._board[r][col] == value) return false;
      }
      for (let c = 0; c < col; ++c) {
        if (this._board[row][c] == value) return false;
      }
      for (let r = row2; r < row; ++r) {
        for (let c = col2; c < col; ++c) {
          if (this._board[r][c] == value) return false;
        }
      }
      for (let r = row2; r < row; ++r) {
        for (let c = col; c < col2 + 3; ++c) {
          if (this._board[r][c] == value) return false;
        }
      }

      return true;
    }
    let r = isRight();
    if (r) this._board[row][col] = value;
    return r;
  }

  /**
   * Returns pairs [row, col] of coordinates with error.
   * @return {!Array<!Array<number>>}
   */
  errors () {
    let rs = [];
    for (let r = 0; r < 9; ++r) {
      for (let c = 0; c < 9; ++c) {
        let v = this._board[r][c];
        if (v != -1 && !this.isRightValue(r, c, v))
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
      seed + It.from(row).reduce(0, (seed, v) => v == -1 ? seed : seed + 1)
    );
  }

  /**
   * Returns 'true' if the sudoku is finished
   * @return {boolean}
   */
  isCompleted () {
    for (let r = 0; r < 9; ++r) {
      for (let c = 0; c < 9; ++c) {
        if (this._board[r][c] == -1) return false;
      }
    }
    return this.errors().length == 0;
  }

  /**
   * @return {string}
   */
  toString ()  {
    let r = "";
    for (let row = 0; row < 9; ++row) {
      for (let col = 0; col < 9; ++col) {
        let v = this._board[row][col];
        r += v == -1 ? "-" : "" + v;
      }
      r += "\n";
    }
    return r;
  }

  /** @return {!Sudoku} */
  static mkRandom() {
    let c = new BiCounter(9, 9);
    let su = Sudoku.mkEmpty();
    let boxes = It.range(9).map(i =>
      It.range(9).map(j => It.from([1, 2, 3, 4, 5, 6, 7, 8, 9]).shuffle()).to()
    ).to();

    /** @return {boolean} */
    let backward = () => {
      let row = c.row();
      let col = c.col();
      su.board[row][col] = -1;
      boxes[row][col] = It.from([1, 2, 3, 4, 5, 6, 7, 8, 9]).shuffle();
      return c.dec();
    }

    /** @return {boolean} */
    let next = () => {
      let row = c.row();
      let col = c.col();
      let it = boxes[row][col];
      while (it.hasNext()) {
        let nx = it.next();
        if (su.putSeq(row, col, nx)) return true;
      }
      return false;
    }

    /** @return {boolean} */
    let forward = () => {
      return c.inc();
    }

    Model.linearGame(backward, next, forward);

    return su;
  }

  /** @return {!Sudoku} */
  static mkEmpty () {
    return new Sudoku(It.range(9).map(i => It.range(9).map(j => -1).to()).to());
  }

  /**
   * @param {number} l
   * @return {!SudokuData}
   */
  static mkLevel(l) {
    let s = Sudoku.mkRandom();
    let base = Sudoku.mkEmpty();
    let user = Sudoku.mkEmpty();

    let limit = l === 1 ? 0 : 25 + l;
    while (true) {
      for (let r = 0; r < 9; ++r) {
        let ixBox = new Box([0, 1, 2, 3, 4, 5, 6, 7, 8]);
        for (let i = 0; i < 4; ++i) {
          let c = ixBox.next();
          let n = s.board[r][c];
          base.board[r][c] = n;
          user.board[r][c] = n;
        }
      }
      if (base.solutions() === 1) break;
      base = Sudoku.mkEmpty();
      user = Sudoku.mkEmpty();
    }

    let i = 36;
    for (let r = 0; r < 9; ++r) {
      for (let c = 0; c < 9; ++c) {
        let v = base.board[r][c];
        if (v !== -1) {
          base.board[r][c] = -1;
          if (base.solutions() === 1) {
            user.board[r][c] = -1;
            --i;
            if (i === limit) break;
          } else {
            base.board[r][c] = v;
          }
        }
      }
      if (i === limit) break;
    }

    let pbox = new Box([0, 1, 2]);
    let rbox = new Box([0, 1, 2]);
    let s0 = [];
    let b0 = [];
    let u0 = [];
    for (let i = 0; i < 3; ++i) {
      let part = pbox.next();
      for (let j = 0; j < 3; ++j) {
        let row = rbox.next();
        s0.push(s.board[part * 3 + row]);
        b0.push(base.board[part * 3 + row]);
        u0.push(user.board[part * 3 + row]);
      }
    }
    s = new Sudoku(s0);
    base = new Sudoku(b0);
    user = new Sudoku(u0);

    let ix = 0;
    while (base.board[0][ix] !== -1) {
      ++ix;
    }
    return new SudokuData(
      DateDm.now().toTime(),
      DateDm.now().serialize(),
      0,
      [0, ix],
      s.board,
      base.board,
      user.board,
      It.range(9).map(i => It.range(9).map(j => false).to()).to()
    )
  }

  /**
   * @param {!SudokuDef} def
   * @return {!SudokuData}
   */
  static mkDef(def) {
    let user = It.from(def.root()).map(a => It.from(a).to()).to();

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
      It.range(9).map(i => It.range(9).map(j => false).to()).to()
    );
  }

}
