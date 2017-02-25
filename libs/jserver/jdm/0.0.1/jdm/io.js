//- jdm/jdm.js
/*
 * Copyright 17-Feb-2017 ºDeme
 * GNU General Public License - V3 <http://www.gnu.org/licenses/>
 */
/*global Java, java, jdm*/

(function () {
  "use strict";

  var io = {};

  /// Data set used by <a href="#hp:io.dir">io.dir</a>
  //# str - bool - bool - num - num - DirEntry
  var DirEntry = function (name, isDir, isFile, length, modified) {
    this.name = name;
    this.isDir = isDir;
    this.length = length;
    this.modified = modified;
    this.serialize = function () {
      return [name, isDir, isFile, length, modified];
    };
  };
  DirEntry.restore = function (s) {
    return new DirEntry(s[0], s[1], s[2], s[3]);
  };
  io.DirEntry = DirEntry;

  /// Return a new file with path 'a'
  //# str - File
  io.file = function (a) {
    var File = java["io"].File;
    if (a === "") {
      return new File("");
    }
    return new File(a);
  };

  /// Joins several paths ussing system separator and returns its result.
  //# Arr<str> - str
  io.cat = function (a) {
    var File = java["io"].File;
    if (a.length === 0) {
      return "";
    }
    var r = new File(a[0]);
    var i, f;
    for (i = 1; i < a.length; ++i) {
      f = a[i];
      if (r.toString() === "") {
        r = new File(f);
      } else {
        r = new File(r, f);
      }
    }
    return r.toString();
  };

  /// Returns user.dir. In web applications returns /cgi/ root
  //# str
  io.userDir = java["lang"].System.getProperty("user.dir");

  //# str - bool
  io.exists = function (f) {
    return io.file(f).exists();
  };

  //# str - bool
  io.isDirectory = function (f) {
    return io.file(f).isDirectory();
  };

  /// Returns name of files and directories in 'd'
  //# str - Arr<str>
  io.dirNames = function (d) {
    return io.file(d).list();
  };

  /// Returns directory entries
  //# str - Arr<DirEntry>
  io.dir = function (d) {
    var fs = io.file(d).listFiles();
    var r = [];
    var i;
    var f;
    for (i = 0; i < fs.length; ++i) {
      f = fs[i];
      r.push(
        new DirEntry(f.getName(), f.isDirectory(), f.isFile(),
          f.length(), f.lastModified())
      );
    }
    return r;
  };

  /// Creates a new directory and its parents if it is necessary
  //# str -
  io.mkdir = function (d) {
    io.file(d).mkdirs();
  };

  /// Deletes a file or directory. Directory must be empty.
  //# str -
  io.del = function(d) {
    io.file(d).delete();
  };

  /// Reads a complete text file
  //# str - str
  io.read = function (path) {
    var Files = Java.type("java.nio.file.Files");
    var p = io.file(path).toPath();
    return new java.lang.String(Files.readAllBytes(p), "UTF-8");
  };

  /// Writes text in a new file
  //# str - str -
  io.write = function (path, text) {
    var Files = Java.type("java.nio.file.Files");
    var p = io.file(path).toPath();
    Files.write(p, new java.lang.String(text).getBytes("UTF-8"));
  };

  jdm.io = io;
}());
