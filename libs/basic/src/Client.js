// Copyright 09-Sep-2017 ºDeme
// GNU General Public License - V3 <http://www.gnu.org/licenses/>

/**
 * Client to connect via Ajax.
 *
 * *** Protocol ***
 * ****************
 *   1.- CONNECT: Client program try to connect with sessionId
 *     * Wrong -> (communicationKey = "") AUTHENTICATION
 *     * Right -> Returns pageId and communicationKey
 *
 *   2.- NORMAL COMMUNICATION: Client send data with sessionId
 *
 *   *.- AUTHENTICATION: Client send user, password and persisitent.
 *     * Wrong -> AUTHENTICATION
 *     * RIGHT -> Returns sessionId, pageId, communicationKey and user level
 *
 * *** Client Messages ***
 * ***********************
 *   AUTHENTICATION: :userName:userKey:[0/1]
 *     userName -> in B64.
 *     userKey -> in Cryp.key.
 *     [0/1] -> "1" Indicates temporary connection. "0" Indicates permanent.
 *   CONNECT: sessionId
 *     sessionId -> As came from server.
 *   NORMAL COMMUNICATION: sessionId:data
 *     sessionId -> As came from server.
 *     data -> A pageId field is added. After that it is codified con
 *             Cryp.cryp and communicationKey
 *
 * *** Server Messages ***
 * ***********************
 *   AUTHENTICATION: Data.key, Data.sessionId, Data.pageId, Data.level,
 *                   Data.error
 *     Data is codified with the same key which sent user.
 *     Data.key is a fresh string or "" if connection failed.
 *     Data.sessionId is a fresh string or "".
 *     Data.pageId is a fresh string or "".
 *     Data.level "0" for admin and "" if connection failed.
 *     Data.error For debug only.
 *   CONNECT: Data.key, Data.PageId, Data.error
 *     Data is codified with sessionId.
 *     Data.key is a fresh string or "" if connection failed.
 *     Data.PageId is a fresh string or "". It is consumed by Client
 *     Data.error string for debugging only.
 *   NORMAL COMMUNICATION: Data.? | Data.expired, Data.error
 *     Data is codified with communicationKey.
 *     Data.? | Data.expired Response fields. If session is expired the only
 *                           field returned is expired with value true.
 *     Data.error string for debugging only.
 */
goog.provide("github_dedeme.Client");

goog.require("github_dedeme.Store");
goog.require("github_dedeme.Cryp");

{
  const Klen = 300;
  const Store = github_dedeme.Store/**/;
  const Cryp = github_dedeme.Cryp/**/;
  const B64 = github_dedeme.B64/**/;

github_dedeme.Client/**/ = class {
  /**
   * @param {string} appName Used to customize LocalStore
   * @param {function ():void} fexpired Function to launch expired page
   */
  constructor (appName, fexpired) {
    /**
     * @private
     * @const {string}
     */
    this._appName = appName;

    /**
     * @private
     * @const {function ():void}
     */
    this._fexpired = fexpired;

    /**
     * @private
     * @type {string}
     */
    this._pageId = "";

    /**
     * @private
     * @type {string}
     */
    this._connectionId = "";

    /**
     * When a request is sent 'this._lock' is set to 'true' and is not posible
     * to send new requests until request.readyState === 4.
     * @private
     * @type {boolean}
     */
    this._lock = false;
  }

  /**
   * @private
   * @return {string}
   */
  sessionId () {
    return Store.get("Client_sessionId_" + this._appName) || B64.encode("0");
  }

  /**
   * @private
   * @param {string} value
   */
  setSessionId (value) {
    Store.put("Client_sessionId_" + this._appName, value);
  }

  /**
   * @private
   * @return {string}
   */
  key () {
    return Store.get("Client_key_" + this._appName) || B64.encode("0");
  }

  /**
   * @private
   * @param {string} value
   */
  setKey (value) {
    Store.put("Client_key_" + this._appName, value);
  }

  /** @return {string} */
  user () {
    return Store.get("Client_user_" + this._appName) || "";
  }

  /** @return {void} */
  setPageId() {
    const value = Cryp.genK(250);
    Store.put("Client_pageId_" + this._appName, value)
    this._pageId = value;
  }

  /**
   * @private
   * @param {string} rq data to send in B64
   * @param {function (string):void} f Action to do. The string of 'f' is
   *        B64 codified.
   * @return {void}
   */
  sendServer(rq, f) {
    const self = this;

    let request = new XMLHttpRequest();
    request.onreadystatechange/**/ = function (e) {
      if (request.readyState/**/ === 4) {
        self._lock = false;
        f(request.responseText/**/.trim())
      }
    };
    if (self._lock) {
      return;
    }
    self._lock = true;
    request.open(
      "POST",
      "http://" + location.host/**/ + "/cgi-bin/ccgi.sh",
      true
    );
    request.setRequestHeader(
      "Content-Type"
    , "text/plain"
    );
    request.send(this._appName + ":" + rq);
  }

  /**
   * @param {function (boolean):void} f 'f' receives ok
   * @return {void}
   */
  connect (f) {
    const self = this;
    self.sendServer(
      self.sessionId(),
      rp => {
        try {
          let jdata = Cryp.decryp(self.sessionId(), rp);
          let data = /** @type {!Object<string, ?>} */(JSON.parse(jdata))
          if (data["error"] !== "") {
            console.log("SERVER ERROR: " + data["error"])
          } else {
            let key = data["key"];
            if (key === "") {
              f(false);
            } else {
              self.setKey(key);
              self._connectionId = data["connectionId"];
              f(true);
            }
          }
        } catch (e) {
          console.log("ROW SERVER RESPONSE:");
          console.log(rp);
          console.log("CLIENT ERROR:")
          console.log(e)
        }
      }
    );
  }

  /**
   * @param {string} user
   * @param {string} pass (As is written for user)
   * @param {boolean} expiration "true" means a temporary connection.
   * @param {function (boolean):void} f
   * @return {void}
   */
  authentication (user, pass, expiration, f) {
    const self = this;
    const key = Cryp.key(self._appName, Klen);
    const p = Client.crypPass(pass);
    let exp = expiration ? "1" : "0";
    self.sendServer(
      ":" + Cryp.cryp(key, `${user}:${p}:${exp}`),
      rp => {
        try {
          let jdata = Cryp.decryp(key, rp);
          let data = /** @type {!Object<string, ?>} */(JSON.parse(jdata))
          if (data["error"] !== "") {
            console.log("SERVER ERROR: " + data["error"])
          } else {
            let sessionId = data["sessionId"];
            if (sessionId === "") {
              f(false);
            } else {
              self.setKey(data["key"]);
              self.setSessionId(sessionId);
              Store.put("Client_user_" + self._appName, user);
              f(true);
            }
          }
        } catch (e) {
          console.log("ROW SERVER RESPONSE:");
          console.log(rp);
          console.log("CLIENT ERROR:");
          console.log(e);
        }
      }
    );
  }

  /**
   * @private
   * @param {!Object<string, ?>} data
   * @param {function (!Object<string, ?>):void} f
   * @param {boolean} withConnectionId
   * @return {void}
   */
  _send (data, f, withConnectionId) {
    let self = this;
    if (withConnectionId) {
      data["connectionId"] = self._connectionId;
    }
    self.sendServer(
      self.sessionId() + ":" + Cryp.cryp(self.key(), JSON.stringify(data)),
      rp => {
        try {
          let jdata = Cryp.decryp(self.key(), rp);
          let data = /** @type {!Object<string, ?>} */(JSON.parse(jdata));
          if (data["error"] !== "") {
            console.log("SERVER ERROR: " + data["error"])
          } else {
            f(data);
          }
        } catch (e) {
          try {
            const jdata = Cryp.decryp("nosession", rp);
            const data = /** @type {!Object<string, ?>} */(JSON.parse(jdata));
            let expired = data["expired"] || false;
            if (expired) {
              self._fexpired();
            } else {
              throw(e);
            }
          } catch (e) {
            console.log("ROW SERVER RESPONSE:");
            console.log(rp);
            console.log("CLIENT ERROR:");
            console.log(e);
          }
        }
      }
    );
  }

  /**
   * @param {!Object<string, ?>} data
   * @param {function (!Object<string, ?>):void} f
   * @return {void}
   */
  send0 (data, f) {
    this._send(data, f, false);
  }

  /**
   * send checks if connectionId is correct,
   * @param {!Object<string, ?>} data
   * @param {function (!Object<string, ?>):void} f
   * @return {void}
   */
  send (data, f) {
    this._send(data, f, true);
  }

  /**
   * Processing of user password before sending it to server.
   * @param {string} pass
   * @return {string}
   */
  static crypPass (pass) {
    return Cryp.key(pass, Klen);
  }

}}

