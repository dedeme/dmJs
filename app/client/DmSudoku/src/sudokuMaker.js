// Copyright 05-Sep-2017 ºDeme
// GNU General Public License - V3 <http://www.gnu.org/licenses/>

goog.provide("sudokuMaker");
goog.require("WorkerRequest");
goog.require("WorkerResponse");
goog.require("Sudoku");

/** @suppress {globalThis} */
this["onmessage"] = function (e) {
  let rq  = WorkerRequest.restore(e.data/**/);
  var rp = new WorkerResponse (
    rq.isCache(), rq.level(), Sudoku.mkLevel(rq.level())
  )
  postMessage(rp.serialize());
};
