// Copyright 07-Sep-2017 ºDeme
// GNU General Public License - V3 <http://www.gnu.org/licenses/>

import Ui from "./dmjs/Ui.js";
import It from "./dmjs/It.js";
// eslint-disable-next-line
import Domo from "./dmjs/Domo.js";
// eslint-disable-next-line
import {SudokuData} from "./Model.js";

const $ = Ui.$;

export default class Little {
  /** @param {!SudokuData} data */
  constructor (data) {
    const board = data.user();

    this._element = $("table").klass("sudoku")
      .adds([...It.range(9)].map(row => {
        return $("tr")
          .adds([...It.range(9)].map(function (col) {
            const n = board[row][col];
            return $("td").klass("lsudoku").style(
              Little.findBorder(row, col)
            ).html(n === -1 ? "&nbsp;" : String(n));
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
    const top = "border-top : 2px solid rgb(110,130,150);";
    const bottom = "border-bottom : 2px solid rgb(110,130,150);";
    const left = "border-left : 2px solid rgb(110,130,150);";
    const right = "border-right : 2px solid rgb(110,130,150);";
    const row3 = row - Math.floor(row / 3) * 3;
    const col3 = col - Math.floor(col / 3) * 3;
    return row3 === 0
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

}
