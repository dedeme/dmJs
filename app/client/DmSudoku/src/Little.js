// Copyright 07-Sep-2017 ºDeme
// GNU General Public License - V3 <http://www.gnu.org/licenses/>

goog.provide("Little");


Little = class {
  /** @param {!SudokuData} data */
  constructor (data) {
    let board = data.user();

    this._element = $("table").klass("sudoku")
      .addIt(It.range(9).map(row => {
        return $("tr")
          .addIt(It.range(9).map(function (col) {
            let n = board[row][col];
            return $("td").klass("lsudoku").style(
              Little.findBorder(row, col)
            ).html(n === -1 ? "&nbsp;" : "" + n);
          }));
      }));
  }

  /** @return {!Domo} */
  element () {
    return this._element;
  }

  /**
   * @private
   * @param {number} row
   * @param {number} col
   * @return {string}
   */
  static findBorder (row, col) {
    let top = "border-top : 2px solid rgb(110,130,150);";
    let bottom = "border-bottom : 2px solid rgb(110,130,150);";
    let left = "border-left : 2px solid rgb(110,130,150);";
    let right = "border-right : 2px solid rgb(110,130,150);";
    let row3 = row - Math.floor(row / 3) * 3;
    let col3 = col - Math.floor(col / 3) * 3;
    return  row3 == 0
      ? col3 == 0
        ? top + left
        : col == 8
          ? top + right
          : top
      : row == 8
        ? col3 == 0
          ? bottom + left
          : col == 8
            ? bottom + right
            : bottom
        : col3 == 0
          ? left
          : col == 8
            ? right
            : ""
    ;
  }

}
