// Copyright 07-Sep-2017 ºDeme
// GNU General Public License - V3 <http://www.gnu.org/licenses/>

goog.provide("Big");

Big = class {

  /** @param {!SudokuData} data */
  constructor (data) {
    const self = this;
    /**
     * @private
     * @type {!SudokuData}
     */
    this._data = data;
    /**
     * @private
     * @type {!Array<!Array<!Domo>>}
     */
    this._cells = []
    /** @private */
    this._element = $("table").klass("sudoku")
      .addIt(It.range(9).map(row => {
        self._cells[row] = [];
        return $("tr")
          .addIt(It.range(9).map(function (col) {
            let n = data.user()[row][col];
            let td = $("td").klass("bsudoku")
              .html(n === -1 ? "&nbsp;" : "" + n);

            if (data.root()[row][col] === -1) {
              td.on("click", () => main.sudokuClick(row, col));
            }
            self._cells[row][col] = td;
            return td;
          }));
      }));
  }

  /** @return {!Domo} */
  get element () {
    return this._element;
  }

  /**
   * @param {number} row
   * @param {number} col
   */
  select (row, col) {
    for (let r = 0; r < 9; ++r) {
      for (let c = 0; c < 9; ++c) {
        if (this._data.root()[r][c] === -1) {
          if (r === row && c === col) {
            this._cells[r][c].style(
              Big.findBorder(r, c) + "background-color : rgb(230, 240, 250);" +
              "color:" + (this._data.pencil()[r][c] ? "#a08000" : "#000000")
            );
          } else {
            this._cells[r][c].style(
              Big.findBorder(r, c) + "background-color : rgb(250, 250, 250);" +
              "color:" + (this._data.pencil()[r][c] ? "#a08000" : "#000000")
            );
          }
        } else {
          this._cells[r][c].style(
              Big.findBorder(r, c) + "background-color : rgb(230, 230, 230);"
          );
        }
      }
    }
  }

  /**
   * @param {number} dir Type Model.CursorMove
   * @param {number} row
   * @param {number} col
   */
  cursor (dir, row, col) {
    let move = (go, r, c) => {
      if (go) Ui.beep();
      else if (this._data.root()[r][c] == -1) main.sudokuClick(r, c);
      else this.cursor(dir, r, c);
    }
    switch (dir) {
      case Model.CursorMove.CursorUp: move(row === 0, row - 1, col);break;
      case Model.CursorMove.CursorDown: move(row === 8, row + 1, col);break;
      case Model.CursorMove.CursorLeft: move(col === 0, row, col - 1);break;
      case Model.CursorMove.CursorRight: move(col === 8, row, col + 1);break;
    }
  }

  /**
   * @param {number} row
   * @param {number} col
   * @param {number} n
   */
  put (row, col, n) {
    Model.last.pencil()[row][col] = Model.data.pencil;
    this._data.user()[row][col] = n;
    main.sudokuClick(row, col);
  }

  clear () {
    for (let r = 0; r < 9; ++r) {
      for (let c = 0; c < 9; ++c) {
        let del = this._data.root()[r][c] === -1 && (Model.data.pencil
          ? Model.last.pencil()[r][c]
          : true);
        if (del) {
          this._data.user()[r][c] = -1;
          this._cells[r][c].html("&nbsp;");
        }
      }
    }
  }

  markErrors () {
    let self = this;
    It.from(new Sudoku(self._data.user()).errors()).each(coor => {
      let r = coor[0];
      let c = coor[1];
      self._cells[r][c].style(
        self._data.root()[r][c] !== -1
          ? Big.findBorder(r, c) + "background-color : rgb(230, 230, 230);" +
            "color: rgb(120, 0, 0);"
          : Big.findBorder(r, c) + "background-color : rgb(250, 250, 250);" +
            "color: rgb(120, 0, 0);"
      );
    });
  }

  markSolved () {
    for (let r = 0; r < 9; ++r) {
      for (let c = 0; c < 9; ++c) {
        if (this._data.root()[r][c] != -1) {
          this._cells[r][c].style(
            Big.findBorder(r, c) + "background-color : rgb(230, 230, 230);"
          );
        } else {
          if (this._data.user()[r][c] === this._data.sudoku()[r][c]){
            this._cells[r][c].style(
              Big.findBorder(r, c) + "background-color : rgb(250, 250, 250);"
            );
          } else {
            this._cells[r][c].style(
              Big.findBorder(r, c) + "background-color : rgb(250, 250, 250);" +
                "color: rgb(120, 0, 0);"
            );
          }
          this._cells[r][c].html("" + this._data.sudoku()[r][c]);
        }
      }
    }
  }

}

/**
 * @private
 * @param {number} row
 * @param {number} col
 * @return {string}
 */
Big.findBorder = (row, col) => {
  let top = "border-top : 2px solid rgb(110,130,150);";
  let bottom = "border-bottom : 2px solid rgb(110,130,150);";
  let left = "border-left : 2px solid rgb(110,130,150);";
  let right = "border-right : 2px solid rgb(110,130,150);";
  let row3 = row - Math.floor(row / 3) * 3;
  let col3 = col - Math.floor(col / 3) * 3;
  return  row3 === 0
    ? col3 === 0
      ? top + left
      : col === 8
        ? top + right
        : top
    : row === 8
      ? col3 === 0
        ? bottom + left
        : col === 8
          ? bottom + right
          : bottom
      : col3 === 0
        ? left
        : col === 8
          ? right
          : ""
  ;
}
