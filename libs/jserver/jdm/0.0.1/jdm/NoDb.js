//- jdm/Server.js
/*
 * Copyright 17-Feb-2017 ºDeme
 * GNU General Public License - V3 <http://www.gnu.org/licenses/>
 */
/*global Java, jdm*/

(function () {
  "use strict";

  var io = jdm.io;
  var It = jdm.It;
  var cryp = jdm.cryp;


  /// Params:
  ///   server:
  ///   path  : Data base path relative to [server.root] (e.g. data/conf.db)
  ///   klass : Object class to save (e.g. MyClass).
  ///           This class must be serializable
  //# Server - str - * - NoDb
  var NoDb = function (server, path, klass) {
    //# Server
    this.server = server;
    /// Data base path relative to [server.root] (e.g. data/conf.db)
    //# str
    this.path = path;
    /// Object class to save
    //#
    this.klass = klass;

    var absolutePath = io.cat([server.root, path]);

    if (!io.exists(absolutePath)) {
      io.mkdir(io.file(absolutePath).getParent());
      io.write(absolutePath, "");
    }

    /// Read every element
    //# - It<*>
    this.read = function () {
      var s = io.read(absolutePath);
      if (s === "") {
        return It.empty();
      }
      return It.from(s.split("\n")).map(function (e) {
        return klass.restore(JSON.parse(cryp.autoDecryp(e)));
      });
    };

    /// Write it. All table will be changed.
    ///   it: It is a iterator over objects of class 'this.klass'
    //# It<*> -
    this.write = function (it) {
      io.write(absolutePath, It.join(it.map(function (e) {
        return cryp.autoCryp(4, JSON.stringify(e.serialize()));
      }), "\n"));
    };

    /// Delete data base file
    //# -
    this.delFile = function () {
      io.del(absolutePath);
    };

    /// 'e' is an object of class 'this.klass'
    //# * -
    this.add = function (e) {
      this.write(this.read().add(e));
    };

    /// Return the first element which passed to 'f' gives 'true' or 'null'
    /// if such element does not exist.
    ///   f: It is a function over an object of class 'this.klass'
    //# (* - bool) - *
    this.findFirst = function (f) {
      return this.read().findFirst(f);
    };

    /// Return an array with every element which passed to 'f' gives 'true'.
    ///   f: It is a function over a object of class 'this.klass'
    //# (* - bool) - Arr<*>
    this.find = function (f) {
      return this.read().find(f);
    };

    /// Delete every element which passed to 'f' gives 'true'.
    /// If no such element exits, 'delFirst' does nothing.
    ///   f: It is a function over a object of class 'this.klass'
    //# (* - bool) -
    this.del = function (f) {
      var f2 = function (e) { return !f(e); };
      this.write(this.read().filter(f2));
    };

    /// Modifies elements with function 'f'
    ///   f: It is a function over an object of class 'this.klass' which
    ///      returns an object of the same class.
    //# (* - *) -
    this.modify = function (f) {
      this.write(this.read().map(f));
    };

  };
  jdm.NoDb = NoDb;

}());
