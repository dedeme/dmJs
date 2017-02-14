//- dm/prejava.js
//- dm/Test.js
//- dm/Tp.js
//- dm/It.js
//- dm/str.js
//- dm/b41.js
//- dm/DateDm.js
//- dm/cryp.js
//- dm/Dec.js
/*
 * Copyright 05-Feb-2017 ºDeme
 * GNU General Public License - V3 <http://www.gnu.org/licenses/>
 */

// Correction for java
dm.It.sortl = function (i) {
  var a = i.map(function (e) { return e.replace(/ /g, " ! "); }).to();
  return dm.It.from(
    a.sort(function (e1, e2) { return e1.localeCompare(e2); })
  ).map(function (e) { return e.replace(/ ! /g, " "); });
}

// Correction for java
dm.str.localeCompare = function (s1, s2) {
  s1 = s1.replace(/ /g, " ! ");
  s2 = s2.replace(/ /g, " ! ");
  return s1.localeCompare(s2);
}

Math.log10 = Math.log10 || function(x) {
  return Math.log(x) * Math.LOG10E;
};
