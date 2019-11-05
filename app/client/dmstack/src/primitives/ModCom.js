// Copyright 28-Oct-2019 ºDeme
// GNU General Public License - V3 <http://www.gnu.org/licenses/>

/* eslint no-console: "off" */

import {Pmodule, PmoduleEntry} from "../Pmodule.js"; // eslint-disable-line
import Machine from "../Machine.js"; // eslint-disable-line
import {Symbol} from "../Symbol.js";
import Token from "../Token.js"; // eslint-disable-line
import Tk from "../Tk.js";

/**
  Asynchronic send.
  @param {string} method: "GET", "POST", "PUT", "DELETE", etc.
  @param {string} url For example:
    "http://" + location.host + "/cgi-bin/ccgi.sh"
    "http://"  + location.host
  @param {string} contentType: text/plain, text/html, multipart/form-data, ...
  @param {string} rq: Data to send
  @param {function(string):void} fnOk Executed if response is Ok. Text data
    is passed to fnOk.
  @param {function(string):void} fnFail Executed if response is an error.
    Error message is passed to fnFail.
**/
function jsRequest (method, url, contentType, rq, fnOk, fnFail) {
  const request = new XMLHttpRequest();

  request.onload = () => {
    if (request.status === 200) fnOk(request.responseText);
    else fnFail(request.statusText);
  };
  request.onerror = () => fnFail("Network Error");

  request.open(method, url, true);
  request.setRequestHeader("Content-Type", contentType);
  request.send(rq);
}

/** @type function (!Machine):void} */
const request = m => {
  const prga = Array.from(Tk.popList(m));
  const rq = Tk.popString(m);
  const contentType = Tk.popString(m);
  const url = Tk.popString(m);
  const method = Tk.popString(m);
  function fnOk (rp) {
    prga.unshift(Token.mkList([Token.mkString(rp)]));
    Machine.isolateProcess("", m.pmachines, Token.mkList(prga));
  }
  function fnFail (e) {
    prga.unshift(Token.mkList([Token.mkString(e), Token.mkInt(0)]));
    Machine.isolateProcess("", m.pmachines, Token.mkList(prga));
  }
  jsRequest(method, url, contentType, rq, fnOk, fnFail);
};

/** @type function (!Machine):void} */
const localRq = m => {
  const prg = m.popExc(Token.LIST);
  const rq = m.popExc(Token.STRING);
  const url = Tk.popString(m);
  m.push(Token.mkString("POST"));
  m.push(Token.mkString("http://" + location.host + "/" + url));
  m.push(Token.mkString("text/plain"));
  m.push(rq);
  m.push(prg);
  request(m);
};

/** @type function (!Machine):void} */
const upload = m => {
  const prg = m.popExc(Token.LIST);
  const url = Tk.popString(m);
  m.push(Token.mkString("POST"));
  m.push(Token.mkString(
    url.startsWith("/") ? "http://" + location.host + url : url
  ));
  m.push(Token.mkString("text/plain"));
  m.push(Token.mkString(""));
  m.push(prg);
  request(m);
};

/** Global symbols. */
export default class ModCom {
  /** @return {!Array<!PmoduleEntry>} */
  static mk () {
    const r = Pmodule.mk();

    /**
      @param {string} name
      @param {function (!Machine):void} fn
      @return void
    **/
    function add (name, fn) {
      Pmodule.add(r, Symbol.mk(name), fn);
    }

    // General request
    // <STRING, STRING, STRING, STRING, LIST> - <>
    // <method, url, contentType, rq, Proc(Either->void) > - <>
    add("rq", request);
    // Localhost text request. 'url' is relative to localhost
    // <STRING, STRING, LIST> - <>
    // <url, rq, Proc(Either->void) > - <>
    add("localRq", localRq);
    // Text file request. 'url' can be absolute (http...) or relative to
    // localhost (Then starts with "/")
    // <STRING, STRING, LIST> - <>
    // <url, Proc(Either->void) > - <>
    add("upload", upload);

    return r;
  }
}
