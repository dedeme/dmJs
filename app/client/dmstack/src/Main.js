// Copyright 03-Oct-2019 ºDeme
// GNU General Public License - V3 <http://www.gnu.org/licenses/>

import Args from "./Args.js";
import Path from "./util/Path.js";
import Imports from "./Imports.js";
import {Symbol} from "./Symbol.js";
import Primitives from "./Primitives.js";
import Reader from "./Reader.js";
import Machine from "./Machine.js";
import List from "./util/List.js";

/** Main page. */
export default class Main {

  /**
    Application start.
    @param {string} path Path from html page of .dms main file.
    @param {boolean=} debug True if application must run in debug mode.
  **/
  static async start (path, debug) {
    Args.init(debug || false);
    Symbol.init();
    Primitives.init();
    Imports.init();

    path = path.endsWith(".dms") ? path : path + ".dms";
    path = Path.canonical(path);
    const pathId = path.substring(0, path.length - 4);
    const ssource = Symbol.mk(pathId);
    Imports.putOnWay(ssource);

    const code = await Imports.load(path);
    Main.process(path, pathId, code);
  }

  static process (path, pathId, code) {
    const r = new Reader(pathId, code);
    Machine.isolateProcess(path, new List(), r.process());
  }
}
