//- dm/dm.js
//- dm/store.js
//- dm/ajax.js
/*
 * Copyright 18-Feb-2017 ºDeme
 * GNU General Public License - V3 <http://www.gnu.org/licenses/>
 */
/*global window, dm */

(() => {
  const store = dm.store;
  const ajax = dm.ajax;

  class ClientRequest {
    // Data must be a JSONizable object
    // str - str - str - ? - ClientRequest
    constructor (user, sessionId, pageId, data) {
      this.user = user;
      this.sessionId = sessionId;
      this.pageId = pageId;
      this.data = data;
    }
    serialize () {
      return [this.error, this.expired, this.data];
    }
  }
  ClientRequest.restore = s => new ClientRequest(s[0], s[1], s[2], s[3]);

  class ClientResponse {
    // Data must be a JSONizable object
    // str - bool - * - ClientResponse
    constructor (error, expired, data) {
      this.error = error;
      this.expired = expired;
      this.data = data;
    }
    serialize () {
      return [this.error, this.expired, this.data];
    }
  }
  ClientResponse.restore = s => new ClientResponse(s[0], s[1], s[2]);

  class AuthResult {
    // Authenticaton response
    // str - str - str - AuthResult
    constructor (level, sessionId, pageId) {
      this.level = level;
      this.sessionId = sessionId;
      this.pageId = pageId;
    }
    serialize () {
      return [this.level, this.sessionId, this.pageId];
    }
  }
  AuthResult.restore = s => new AuthResult(s[0], s[1], s[2]);

  // --------------------------------------------- //

  class Client {
    //# str - Client
    constructor (app) {
      this._app = app;
      this._user = "_" + this._app + "__" + "user";
      this._sessionId = "_" + this._app + "__" + "sessionId";
      this._level = "_" + this._app + "__" + "level";
      this._locked = false;
      //# str
      this.pageId = "";
    }

    //# str
    get app () {
      return this._app;
    }

    /// Get user name from local store (default "")
    //# - str
    get user () {
      const r = store.get(this._user);
      return r === null ? "" : r;
    }

    /// Set user name from local store
    //# str - !Client
    set user (id) {
      store.put(this._user, id);
    }

    /// Get sessionId from local store (default "")
    //# - str
    get sessionId () {
      return store.get(this._sessionId) || "";
    }

    /// Set sessionId from local store
    //# str - !Client
    set sessionId (id) {
      store.put(this._sessionId, id);
    }

    /// Get user name from local store (default "")
    //# - str
    get level () {
      const r = store.get(this._level);
      return r == null ? "-1" : r;
    }

    /// Set user name from local store
    //# str - !Client
    set level (lv) {
      store.put(this._level, lv);
    }

    /// Close session
    //# -
    close () {
      store.del(this._user);
      store.del(this._sessionId);
      store.del(this._level);
      this.pageId = "";
    }

    /**
     * Sends a locking request to server.<p>
     *
     *   script : Script path to read (e.g. "main/index.js")
     *   func   : Function to execute in server (e.g. "session").
     *   data   : Array result of an object serialization. Data that will be
     *            past to func through a ClientRequest serialized.
     *   expired: Session expired callback function
     *   action : Normal callback function. Data is received through a
     *            ClientResponse serialized. Client manage fields error and
     *            expired and send field data to callback. Field data is an
     *            array resultant of a serialization.
     */
    //# str - str - Arr<str> - ( - ) - (Arr<str> - ) -
    send (script, func, data, expired, action) {
      if (this._locked) {
        window.console.log(
          "Request cancelled because there is other request in course."
        );
        return;
      }
      this._locked = true;
      const rq = new ClientRequest(
        this.user, this.sessionId, this.pageId, data
      );
      // Arr<*> -
      const f = arr => {
        this._locked = false;
        const d = ClientResponse.restore(arr);
        if (d.error !== null && d.error !== "") window.console.log(d.error);
        else if (expired !== null && d.expired) expired();
        else action(d.data);
      };
      const pars = {
        "app_name" : this.app,
        "script"   : script,
        "func"     : func,
        "data"     : rq.serialize()
      };
      ajax.send(
        "http://" + window.location.host + "/cgi-bin/jdmcgi.sh",
        pars, f
      );
    }

    /**
     * Sends a request for pageId. This function is intended for being used at
     * the first entry in page.
     *   script : Script path to read (e.g. "main/index.js")
     *   func   : Function to execute in server (e.g. "session").
     *   action : Normal callback function. Field data is a string with a new
     *            pageId. If user password is not valid returns:
     *              "init": If is the first time that applications is used
     *              "": If identification fails
     */
    //# str - str - func(str) -
    startSend (script, func, action) {
      const rq = new ClientRequest(this.user, this.sessionId, "", []);
      // Arr<*> -
      const f = arr => {
        const d = ClientResponse.restore(arr);
        if (d.error !== null && d.error !== "") window.console.log(d.error);
        else action(d.data);
      };
      const pars = {
        "app_name" : this.app,
        "script"   : script,
        "func"     : func,
        "data"     : rq.serialize()
      };
      ajax.send(
        "http://" + window.location.host + "/cgi-bin/jdmcgi.sh",
        pars, f
      );
    }

    /**
     * Sends an authentication request
     *   script : Script path to read (e.g. "main/index.js")
     *   func   : Function to execute in server (e.g. "session").
     *   pass   : Password 'cryp.key(pass, 120)' encripted
     *   action : callback
     */
    //# str - str - str - func() -
    authSend (script, func, pass, action) {
      const rq = new ClientRequest(this.user, "", "", [pass]);
      // Arr<*> -
      const f = arr => {
        const d = ClientResponse.restore(arr);
        if (d.error !== null && d.error !== "" ) {
          window.console.log(d.error);
        } else {
          const ar = AuthResult.restore(d.data);
          this.level = ar.level;
          this.sessionId = ar.sessionId;
          this.pageId = ar.pageId;
          action();
        }
      };
      const pars = {
        "app_name" : this.app,
        "script"   : script,
        "func"     : func,
        "data"     : rq.serialize()
      };
      ajax.send(
        "http://" + window.location.host + "/cgi-bin/jdmcgi.sh",
        pars, f
      );
    }
  }
  dm.Client = Client;

})();



