// Copyright 03-Oct-2019 ºDeme
// GNU General Public License - V3 <http://www.gnu.org/licenses/>

import Args from "./Args.js";
import Path from "./util/Path.js";
import Imports from "./Imports.js";
import {Symbol} from "./Symbol.js";
import Primitives from "./Primitives.js";
import Reader from "./Reader.js";
import Machine from "./Machine.js";
import Fails from "./Fails.js";
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

    path = path.endsWith(".dmjs") ? path : path + ".dmjs";
    path = Path.canonical(path);
    const pathId = path.substring(0, path.length - 5);
    const ssource = Symbol.mk(pathId);

    const code = await Imports.load("Main:0", path);
    const r = new Reader(pathId, code);
    const mainPrg = r.process();
    Imports.addCache(ssource, mainPrg);

    for (const lPId of r.imports) {
      const [line, pId] = lPId.split(":");
      const ssource = Symbol.mk(pathId);
      Imports.putOnWay(ssource);
      await Main.read(Symbol.toStr(r.source) + ":" + line, pId);
      Imports.quitOnWay(ssource);
    }

    try {
      Machine.isolateProcess(path, new List(), mainPrg);
    } catch (e) {
      if (typeof (e) === "string") {
        console.log(e); // eslint-disable-line
      } else {
        Fails.fromException(e);
      }
    }
  }

  static async read (source, pathId) {
    const ssource = Symbol.mk(pathId);
    if (Imports.isOnWay(ssource)) {
      const ix = source.indexOf(":");
      const s = ix === -1
        ? "?"
        : Symbol.toStr(Number(source.substring(0, ix)))
      ;
      throw new Error("Cyclic imports in " + s + " -> " + pathId + ".dmjs");
    }

    let prg = Imports.takeCache(ssource);
    if (prg) return;
    const code = await Imports.load(source, pathId + ".dmjs");
    const r = new Reader(pathId, code);
    prg = r.process();
    Imports.addCache(ssource, prg);

    for (const lPId of r.imports) {
      const [line, pId] = lPId.split(":");
      const ssource = Symbol.mk(pathId);
      Imports.putOnWay(ssource);
      await Main.read(Symbol.toStr(r.source) + ":" + line, pId);
      Imports.quitOnWay(ssource);
    }
  }
}
