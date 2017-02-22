//- dm/dm.js
//- dm/It.js
/*
 * Copyright 11-Feb-2017 ºDeme
 * GNU General Public License - V3 <http://www.gnu.org/licenses/>
 */
/*global dm */

/// Functions to manipulate strings

(function () {
  "use strict";

  dm.str = {};
  var str = dm.str;
  var It = dm.It;

  /// Cuts [text] left, returning [width] positions at right.
  //# str - num - str
  str.cutLeft = function (text, width) {
    if (text.length > width) {
      return "..." + text.substring(text.length - width + 3);
    }
    return text;
  };

  /// Cuts [text] right, returning [width] positions at left.
  //# str - num - str
  str.cutRight = function (text, width) {
    if (text.length > width) {
      return text.substring(0, width - 3) + "...";
    }
    return text;
  };

  /// Remove starting blanks
  //# str - str
  str.ltrim = function (s) { return s.replace(/^\s+/, ""); };

  /// Remove trailing blanks
  //# str - str
  str.rtrim = function (s) { return s.replace(/\s+$/, ""); };

  /// Indicates if text[0] is a space. if text length is 0, returns false.
  //# str - bool
  str.isSpace = function (text) {
    return text.length === 0 ? false : text.charAt(0) <= ' ';
  };

  /// Indicates if text[0] is a letter or '_' or '$'.
  /// if text length is 0, returns false.
  //# str - bool
  str.isLetter = function (text) {
    if (text.length === 0) { return false; }
    var ch = text.charAt(0);
    return (ch >= "a" && ch <= "z") || (ch >= "A" && ch <= "Z") ||
      ch === "_" || ch === '$';
  };

  /// Indicates if text[0] is a digit. if text length is 0, returns false.
  //# str - bool
  str.isDigit = function (text) {
    if (text.length === 0) { return false; }
    var ch = text.charAt(0);
    return ch >= "0" && ch <= "9";
  };

  /// Indicates if text[0] is a letter, '_' or digit.
  /// if text length is 0, returns false.
  //# str - bool
  str.isLetterOrDigit = function (text) {
    return str.isLetter(text) || str.isDigit(text);
  };

  /// Returns the index of first match of a character of [text] with
  /// whatever character of [match], or -1 if it has not match.
  //# str - str - num
  str.index = function (text, match) {
    var lg = text.length;
    var ix = 0;
    while (ix < lg) {
      if (match.indexOf(text.charAt(ix)) !== -1) { return ix; }
      ++ix;
    }
    return -1;
  };

  /// Returns s1 < s2 ? -1 : s1 > s2 ? 1 : 0;
  //# str - str - num
  str.compare = function (s1, s2) { return s1 < s2 ? -1 : s1 > s2 ? 1 : 0; };

  /// Returns s1 < s2 ? -1 : s1 > s2 ? 1 : 0; in locale
  //# str - str - num
  str.localeCompare = function (s1, s2) {
    s1 = s1.replace(/ /g, " ! ");
    s2 = s2.replace(/ /g, " ! ");
    return s1.localeCompare(s2);
  };

  /**
   * Returns one new string, that is a substring of [s].
   * Result includes the character [begin] and excludes the
   * character [end]. If 'begin < 0' or 'end < 0' they are converted to
   * 's.length+begin' or 's.length+end'.<p>
   * Next rules are applied in turn:
   *   If 'begin < 0' or 'end < 0' they are converted to 's.length+begin' or
   *      's.length+end'.
   *   If 'begin < 0' it is converted to '0'.
   *   If 'end > s.length' it is converted to 's.length'.
   *   If 'end <= begin' then returns a empty string.
   * If prarameter [end] is missing, the return is equals to
   * 'sub(s, 0, begin)'.<p>
   * <b>Parameters:</b>
   *   s      : String for extracting a substring.
   *   begin  : Position of first character, inclusive.
   *   end    : Position of last character, exclusive. It can be missing.
   *   return : A substring of [s]
   */
  //# str - num - ?num - str
  str.sub = function (s, begin, end) {
    var lg = s.length;
    if (end === undefined) { end = lg; }
    if (begin < 0) { begin += lg; }
    if (end < 0) { end += lg; }
    if (begin < 0) { begin = 0; }
    if (end > lg) { end = lg; }

    if (end <= begin) { return ""; }
    return s.substring(begin, end);
  };

  /// Returns 's' repeated 'times' times
  //# str - num - str
  str.repeat = function (s, times) {
    var n;
    var bf = "";
    for (n = 0; n < times; ++n) { bf += s; }
    return bf;
  };

  /// Replaces olds by news in s
  //# str - str - str - str
  str.replace = function (s, olds, news) {
    return It.join(It.from(s.split(olds)), news);
  };

}());
