//- jdm/io.js
//- jdm/cryp.js
/*
 * Copyright 17-Feb-2017 ºDeme
 * GNU General Public License - V3 <http://www.gnu.org/licenses/>
 */
/*global Java, jdm*/

(function () {
  "use strict";

  var io = jdm.io;
  var cryp = jdm.cryp;
  var It = jdm.It;

  // Data must be a JSONizable object
  // str - str - * - ClientRequest
  var ClientRequest = function (sessionId, data) {
    this.sessionId = sessionId;
    this.data = data;
    this.serialize = function () {
      return [sessionId, data];
    };
  };
  ClientRequest.restore = function (s) {
    return new ClientRequest(s[0], s[1]);
  };

  // Data must be a JSONizable object
  // str - bool - * - ClientResponse
  var ClientResponse = function (error, unknown, expired, data) {
    this.error = error;
    this.unknown = unknown;
    this.expired = expired;
    this.data = data;
    this.serialize = function () {
      return [error, unknown, expired, data];
    };
  };
  ClientResponse.restore = function (s) {
    return new ClientResponse(s[0], s[1], s[2], s[3]);
  };

  /// Authenticaton response
  //# str - str - AuthResult
  var AuthResult = function (level, sessionId) {
    this.level = level;
    this.sessionId = sessionId;
    this.serialize = function () {
      return [level, sessionId];
    };
  };
  AuthResult.restore = function (s) {
    return new AuthResult(s[0], s[1]);
  };

  // User data response
  // str - str - UserEntry
  var UserEntry = function (user, pass, level) {
    this.user = user;
    this.pass = pass;
    this.level = level;
    this.serialize = function () {
      return JSON.stringify([user, pass, level]);
    };
  };
  UserEntry.restore = function (serial) {
    var s = JSON.parse(serial);
    return new UserEntry(s[0], s[1], s[2]);
  };

  /// Session data response. Expiration is a Date.getTime.
  //# num - str - str - SessionEntry
  var SessionEntry = function (sessionId, expiration, user, level) {
    this.sessionId = sessionId;
    this.expiration = expiration;
    this.user = user;
    this.level = level;
    this.serialize = function () {
      return JSON.stringify([sessionId, expiration, user, level]);
    };
  };
  SessionEntry.restore = function (serial) {
    var s = JSON.parse(serial);
    return new SessionEntry(s[0], s[1], s[2], s[2]);
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

    // str - ?UserEntry
    function readUser(user) {
      var s = io.read(userDb);
      if (s === "") {
        return null;
      }
      var d = s.split(":");
      return It.from(d).map(function (e) {
        return UserEntry.restore(e);
      }).findFirst(function (us) {
        return us.user === user;
      });
    }

    // str - UserEntry -
    function writeUser(userEntry) {
      var d = io.read(userDb);
      if (d) {
        io.write(userDb, d + ":" + userEntry.serialize());
      } else {
        io.write(userDb, userEntry.serialize());
      }
    }

    /// If 'user' already exists, returns 'false'
    //# str - str - str - bool
    this.addUser = function (user, pass, level) {
      var entry = readUser(user);
      if (entry !== null) {
        return false;
      }
      var p = cryp.key(pass, 120);
      var uentry = new UserEntry(user, p, level);
      writeUser(uentry);
      return true;
    };

    ///
    //# str -
    this.delUser = function (user) {
      var s = io.read(userDb);
      if (s === "") {
        return;
      }
      var d = s.split(":");
      var nd = It.from(d).filter(function (e) {
        var us = UserEntry.restore(e);
        return us.user !== user;
      }).to();
      io.write(userDb, nd.join(":"));
    };

    ///
    //# str - str - bool
    this.changePass = function (user, oldPass, newPass) {
      var entry = readUser(user);
      if (entry === null) {
        return false;
      }
      if (entry.pass !== cryp.key(oldPass, 120)) {
        return false;
      }
      var newUser = new UserEntry(user, cryp.key(newPass, 120), entry.level);
      this.delUser(user);
      this.writeUser(newUser);
      return true;
    };

    //# str - str -
    this.changeLevel = function (user, level) {
      var entry = readUser(user);
      if (entry === null) {
        return false;
      }
      var newUser = new UserEntry(user, entry.pass, level);
      this.delUser(user);
      this.writeUser(newUser);
      return true;
    };

    var sessionDb = io.cat([this.root, "sessions.db"]);

    // str - ?SessionEntry
    function readSession(sessionId) {
      var s = io.read(sessionDb);
      if (s === "") {
        return null;
      }
      var d = s.split(":");
      return It.from(d).map(function (e) {
        return SessionEntry.restore(e);
      }).findFirst(function (ss) {
        return ss.sessionId === sessionId;
      });
    }

    // str - !SessionEntry -
    function writeSession(sessionEntry) {
      var t = Date.now();
      var s = io.read(sessionDb);
      var nd = [];
      var d;
      if (s !== "") {
        d = io.read(sessionDb).split(":");
        nd = It.from(d).filter(function (e) {
          var ss = SessionEntry.restore(e);
          return ss.expiration <= t;
        }).to();
      }
      nd.push(sessionEntry.serialize());
      io.write(sessionDb, nd.join(":"));
    }

    /**
     * Read client data and send it to 'f'. 'f' has to return an serialized
     * object.
     *   data : JSON value with a ClientRequest (It is row data send by client)
     *   f : Function to execute. It sends a JSONizable object (the 'data'
     *       value of the ClientRequest) and expects another JSONizable
     *       object to send in a ClientResponse.
     *   return: JSONized serialized ClientResponse whose field data is the
     *           object resturned by 'f'.
     * Example of use:
     *    function x(data) {
     *        var server = jdm.mkServer();
     *        return server.rp(data, function (d) {
     *          return process(d)
     *        });
     *    }
     */
    //# str - (* - *) - str
    this.rp = function (data, f) {
      var dobj = JSON.parse(data);
      var rq = ClientRequest.restore(dobj.data);

      var rp;
      if (rq.sessionId === "") {
        rp = new ClientResponse("", true, true, "Unkown");
      } else {
        var ss = readSession(rq.sessionId);
        if (ss === null) {
          rp = new ClientResponse("", true, true, "Unkown");
        } else if (ss.expiration < Date.now()) {
          rp = new ClientResponse("", false, true, "Expired");
        } else {
          rp = new ClientResponse("", false, false, f(rq.data));
        }
      }

      return JSON.stringify(rp.serialize());
    };

    /**
     * Checks sessionId and sends to client pageId or "" if the check fails.<p>
     * If application has not been initialized, intializes it (making sessionDb
     * and userDb files) and call 'f'
     *   data : JSONized serialized ClientRequest
     *   return: JSONized serialized ClientResponse whose field data is an
     *           AuthResult (without serialization).
     */
    //# str - str
    this.authRp = function (data) {
      var dobj = JSON.parse(data);
      var rq = ClientRequest.restore(dobj.data).data;

      var rp;
      var pass = cryp.key(rq.pass, 120);
      var uentry = readUser(rq.user);
      if (uentry && uentry.pass === pass) {
        var ex = rq.persistent ? 31536000000 : this.expiration;
        var sentry = new SessionEntry(
          cryp.genK(120),
          Date.now() + ex,
          uentry.user,
          uentry.level
        );
        writeSession(sentry);
        rp = new ClientResponse("", false, false,
          new AuthResult(uentry.level, sentry.sessionId));
      } else {
        rp = new ClientResponse("", false, false, new AuthResult("-1", ""));
      }

      return JSON.stringify(rp.serialize());
    };

    /// Initializes server and returns a response.  Use:
    ///   server = new Server "app", 0,30
    ///   ... Initialization operations ...
    ///   return server.init!
    //# -
    this.init = function () {
      if (!io.exists(this.root)) {
        io.mkdir(this.root);
        if (!io.exists(sessionDb)) {
          io.write(sessionDb, "");
        }
        if (!io.exists(userDb)) {
          io.write(userDb, "");
          this.addUser("admin", cryp.key("deme", 120), "0");
        }
      }
    };

  };

  jdm.Server = Server;

}());

