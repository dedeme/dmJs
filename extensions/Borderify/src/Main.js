// Copyright 01-Jul-2019 ºDeme
// GNU General Public License - V3 <http://www.gnu.org/licenses/>

import Ui from "./dmjs/Ui.js";

const $ = Ui.$;

export default class Main {

  /** return {void} */
  run () {
    $("@body").style("border:5px solid green");
  }
}
