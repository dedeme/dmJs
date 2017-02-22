//- dm/dm.js
//- dm/io.js
//- dm/cryp.js
/*
 * Copyright 17-Feb-2017 ºDeme
 * GNU General Public License - V3 <http://www.gnu.org/licenses/>
 */
/*global Java, dm*/

(function () {
  "use strict";

  var io = dm.io;
  var cryp = dm.cryp;

  // Data must be a JSONizable object
  // str - str - str - ? - ClientRequest
  var ClientRequest = function (user, sessionId, pageId, data) {
    this.user = user;
    this.sessionId = sessionId;
    this.pageId = pageId;
    this.data = data;
    this.serialize = function () {
      return [user, sessionId, pageId, data];
    };
  };
  ClientRequest.restore = function (s) {
    return new ClientRequest(s[0], s[1], s[2], s[3]);
  };

  // Data must be a JSONizable object
  // str - bool - * - ClientResponse
  var ClientResponse = function (error, expired, data) {
    this.error = error;
    this.expired = expired;
    this.data = data;
    this.serialize = function () {
      return [error, expired, data];
    };
  };
  ClientResponse.restore = function (s) {
    return new ClientResponse(s[0], s[1], s[2]);
  };

  /// Authenticaton response
  //# str - str - str - AuthResult
  var AuthResult = function (level, sessionId, pageId) {
    this.level = level;
    this.sessionId = sessionId;
    this.pageId = pageId;
    this.serialize = function () {
      return [level, sessionId, pageId];
    };
  };
  AuthResult.restore = function (s) {
    return new AuthResult(s[0], s[1], s[2]);
  };

  // User data response
  // str - str - UserEntry
  var UserEntry = function (pass, level) {
    this.pass = pass;
    this.level = level;
    this.serialize = function () {
      return [pass, level];
    };
  };
  UserEntry.restore = function (s) {
    return new UserEntry(s[0], s[1]);
  };

  /// Session data response. Expiration is a Date.getTime.
  //# str - str - num - SessionEntry
  var SessionEntry = function (sessionId, pageId, expiration) {
    this.sessionId = sessionId;
    this.pageId = pageId;
    this.expiration = expiration;
    this.serialize = function () {
      return [sessionId, pageId, expiration];
    };
  };
  SessionEntry.restore = function (s) {
    return new SessionEntry(s[0], s[1], s[2]);
  };

  /// Params:
  ///   app : Application name (e.g. "ContaHouse")
  ///   expiration : Hours to expiration
  //# str - num - Server
  var Server = function (app, expiration) {
    //# str
    this.app = app;

    /// Value in milliseconds
    //# num
    this.expiration = expiration * 3600000;

    /// Working directory
    //# str
    this.root = io.cat([io.userDir, "dmcgi", app]);

    var userDb = io.cat([this.root, "users.db"]);

    // str - UserEntry
    function readUser(user) {
      var us = JSON.parse(io.read(userDb));
      var au = us[user];
      if (au === undefined) {
        return null;
      }
      return UserEntry.restore(au);
    }

    // str - UserEntry -
    function writeUser(user, userEntry) {
      var us = JSON.parse(io.read(userDb));
      var au = userEntry.serialize();
      us[user] = au;
      io.write(userDb, JSON.stringify(us));
    }

    var sessionDb = io.cat([this.root, "sessions.db"]);

    // str - SessionEntry
    function readSession(user) {
      var ss = JSON.parse(io.read(sessionDb));
      var as = ss[user];
      if (as === undefined) {
        return null;
      }
      return SessionEntry.restore(as);
    }

    // str - !SessionEntry -
    function writeSession(user, sessionEntry) {
      var ss = JSON.parse(io.read(sessionDb));
      var as = sessionEntry.serialize();
      ss[user] = as;
      io.write(sessionDb, JSON.stringify(ss));
    }

    /**
     * Read client data and send it to 'f'. 'f' has to return an serialized
     * object.
     *   data : JSON value with a ClientRequest (It is row data send by client)
     *   f : Function to execute. It sends a serialized object and expects
     *       another serialized object
     * Example of use:
     *
     */
    //# str - (Arr<*> - Arr<*>) - str
    this.rq = function (data, f) {
      function mkExpired() {
        var rp = new ClientResponse("", true, "Control failed");
        return JSON.stringify(rp.serialize());
      }

      var dobj = JSON.parse(data);
      var rq = ClientRequest.restore(dobj.data);

      if (!this.sessionControl(rq.user, rq.sessionId)) {
        return mkExpired();
      }
      if (rq.pageId !== "") {
        if (!this.pageControl(rq.user, rq.pageId)) {
          return mkExpired();
        }
      }

      var rp = new ClientResponse("", false, f(rq.data));
      return JSON.stringify(rp.serialize());
    };

    /**
     * Checks sessionId and sends to client pageId or "" if the check fails.<p>
     * If application has not been initialized, intializes it (making sessionDb
     * and userDb files) and call 'f'
     *   f : Function to execute for initialization.
     */
    //# str - ( - ) - str
    this.startRq = function (data, f) {
      var dobj = JSON.parse(data);
      var rq = ClientRequest.restore(dobj.data);

      var init = false;
      var u = "admin";
      var p = cryp.key("deme", 120);
      var l = "0";
      if (!io.exists(sessionDb)) {
        init = true;
        io.write(sessionDb, JSON.stringify({}));
        io.write(userDb, JSON.stringify({}));
        this.add(u, p, l);
      }

      var rp;
      if (init) {
        f();
        rp = new ClientResponse("", false, "init");
      } else if (!this.sessionControl(rq.user, rq.sessionId)) {
        rp = new ClientResponse("", false, "");
      } else {
        rp = new ClientResponse("", false, this.newPage(rq.user));
      }
      return JSON.stringify(rp.serialize());
    };

    /**
     * Checks sessionId and sends to client pageId or "" if the check fails.<p>
     * If application has not been initialized, intializes it (making sessionDb
     * and userDb files) and call 'f'
     *   f : Function to execute for initialization.
     */
    //# str - str
    this.authRq = function (data) {
      var dobj = JSON.parse(data);
      var rq = ClientRequest.restore(dobj.data);
      var user = rq.user;
      var pass = rq.data[0];
      var a = this.authentication(user, pass);
      var rp = new ClientResponse("", false, a.serialize());
      return JSON.stringify(rp.serialize());
    };

    /// Initializes server and returns a response.  Use:
    ///   server = new Server "app", 0,30
    ///   ... Initialization operations ...
    ///   return server.init!
    //# - str
    this.init = function () {
      if (!io.exists(sessionDb)) {
        io.write(sessionDb, JSON.stringify({}));
      }
      if (!io.exists(userDb)) {
        io.write(userDb, JSON.stringify({}));
        this.add("admin", cryp.key("deme", 120), "0");
      }
      var rp = new ClientResponse("", false, "Initialization done");
      return JSON.stringify(rp.serialize());
    };

    /// If its return is {"", "", -1} -> not authenticated
    //# str - str - AuthResult
    this.authentication = function (user, pass) {
      function setSessionId(level) {
        var entry = new SessionEntry(
          cryp.genK(120),
          cryp.genK(120),
          Date.now() + this.expiration
        );
        writeSession(user, entry);
        return new AuthResult(level, entry.sessionId, entry.pageId);
      }
      var entry = readUser(user);
      pass = cryp.key(pass, 120);
      if (entry && entry.pass === pass) {
        return setSessionId(entry.level);
      }
      return new AuthResult("-1", "", "");
    };

    /// If 'user' already exists, returns 'false'
    //# str - str - str - bool
    this.add = function (user, pass, level) {
      var entry = readUser(user);
      if (entry !== null) {
        return false;
      }
      var p = cryp.key(pass, 120);
      var uentry = new UserEntry(p, level);
      writeUser(user, uentry);
      return true;
    };

    ///
    //# str -
    this.del = function (user) {
      var us = JSON.parse(io.read(userDb));
      delete us[user];
      io.write(userDb, JSON.stringify(us));
    };

    /// Return true is pass is correct
    //# str - str - bool
    this.passControl = function (user, pass) {
      var entry = readUser(user);
      pass = cryp.key(pass, 120);
      if (entry && entry.pass === pass) {
        return true;
      }
      return false;
    };

    ///
    //# str - str -
    this.changePass = function (user, pass) {
      var p = cryp.key(pass, 120);
      var entry = readUser(user);
      if (entry !== null) {
        writeUser(user, new UserEntry(p, entry.level));
      }
    };

    //# str - str -
    this.changeLevel = function (user, level) {
      var entry = readUser(user);
      if (entry !== null) {
        writeUser(user, new UserEntry(entry.pass, level));
      }
    };

    /// Return true is 'sessionId' is correct and request is in time.
    //# str - str - bool
    this.sessionControl = function (user, sessionId) {
      var t = Date.now();
      var s = readSession(user);
      if (s === null || s.expiration < t ||
          sessionId === "" || sessionId !== s.sessionId) {
        return false;
      }
      writeSession(
        user,
        new SessionEntry(s.sessionId, s.pageId, t + this.expiration)
      );
      return true;
    };

    /// Return a new id for page control. If user does not exists, returns ""
    //# str - str
    this.newPage = function (user) {
      var t = Date.now();
      var s = readSession(user);
      if (s === null) {
        return "";
      }
      var r = cryp.genK(120);
      writeSession(
        user,
        new SessionEntry(s.sessionId, r, t + this.expiration)
      );
      return r;
    };

    /// Return true is 'pageId' is correct
    //# str - str - bool
    this.pageControl = function (user, pageId) {
      var s = readSession(user);
      if (s === null || pageId !== s.pageId) {
        return false;
      }
      return true;
    };

  };

  dm.Server = Server;

}());

