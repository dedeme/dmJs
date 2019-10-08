// Copyright 05-Sep-2017 ºDeme
// GNU General Public License - V3 <http://www.gnu.org/licenses/>

import {WorkerRequest, WorkerResponse} from "./Model.js";
import Sudoku from "./Sudoku.js";

/** @suppress {globalThis} */
window.onmessage = function (e) {
  const rq = WorkerRequest.restore(e.data);
  const rp = new WorkerResponse(
    rq.isCache(), rq.level(), Sudoku.mkLevel(rq.level())
  );
  postMessage(rp.serialize());
};
