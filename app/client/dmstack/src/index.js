// Copyright 03-Oct-2019 ºDeme
// GNU General Public License - V3 <http://www.gnu.org/licenses/>

import Main from "./Main.js";

/**
  Application entry.
  @param {string} path Path from html page of .dms main file.
  @param {boolean=} debug True if application must run in debug mode.
**/
export function main (path, debug) {
  Main.start(path, debug);
}

window["main"] = main;
