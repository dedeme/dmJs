// Copyright 04-Oct-2019 ºDeme
// GNU General Public License - V3 <http://www.gnu.org/licenses/>

import Token from "./Token.js"; // eslint-disable-line
import Reader from "./Reader.js"; // eslint-disable-line
import {Symbol} from "./Symbol.js";

/**
  @param {string} ch
  @return {boolean}
**/
function isBlank (ch) {
  return ch <= " " || ch === ";" || ch === ":" || ch === ",";
}

/**
  @param {string} ch
  @return {boolean}
**/
function isParent (ch) {
  return ch === "(" || ch === ")" ||
         ch === "{" || ch === "}" ||
         ch === "[" || ch === "]"
  ;
}

/**
  @param {string} ch
  @return {boolean}
**/
function isBlankOrParent (ch) {
  return isBlank(ch) || isParent(ch);
}

/**
  @param {string} hexdigits
  @return {string}
**/
function toUnicode (hexdigits) {
  return String.fromCodePoint(parseInt(hexdigits, 16));
}

/**
  @param {string} ch
  @return {boolean}
**/
function isHex (ch) {
  return (ch >= "0" && ch <= "9") ||
    (ch >= "a" && ch <= "f") ||
    (ch >= "A" && ch <= "F");
}

/**
  @param {string} tx
  @return {string}
**/
function bigMsg (tx) {
  tx = tx.trim();
  let ix = tx.indexOf("\n");
  const left = ix === -1 ? tx : tx.substring(0, ix);
  ix = tx.lastIndexOf("\n");
  const right = tx.substring(ix + 1);
  return left === right
    ? left
    : left + "\n...\n" + right
  ;
}

/** Reading process. */
export default class TkReader {
  /**
    @param {!Reader} reader
    @return {Token} Returns next Token or null.
  */
  static next (reader) {
    if (reader.isFile && reader.nline === 1 && reader.prgIx === 0) {
      const prg = reader.prg;
      if (prg.startsWith("#!")) {
        let ix = prg.indexOf("\n");
        if (ix === -1) ix = prg.length - 1;
        reader.nline = 2;
        reader.prgIx = ix + 1;
      }
    }
    if (reader.nextTk !== null) {
      const r = reader.nextTk;
      reader.nextTk = null;
      return r;
    }

    let nline = reader.nline;
    let prgIx = reader.prgIx;
    const prg = reader.prg;

    let ch = prg.charAt(prgIx);
    while (ch !== "") {
      if (isBlank(ch)) {
        if (ch === "\n") ++nline;
        ch = prg.charAt(++prgIx);
        continue;
      }

      if (ch === "/" && prg.charAt(prgIx + 1) === "/") {
        const ix = prg.indexOf("\n", prgIx);
        if (ix === -1) prgIx = prg.length;
        else {
          ++nline;
          prgIx = ix + 1;
        }
        ch = prg.charAt(prgIx);
        continue;
      }

      if (ch === "/" && prg.charAt(prgIx + 1) === "*") {
        reader.nline = nline;
        prgIx += 2;
        ch = prg.charAt(prgIx);
        while (
          ch !== "" && (ch !== "*" || prg.charAt(prgIx + 1) !== "/")
        ) {
          if (ch === "\n") ++nline;
          ch = prg.charAt(++prgIx);
        }
        if (ch !== "") {
          prgIx += 2;
        } else {
          reader.fail("Unclosed commentary");
        }
        ch = prg.charAt(prgIx);
        continue;
      }

      break;
    }
    reader.nline = nline;

    const prgIxD = prgIx;
    if (ch !== "") {
      // Minus sign ------------------------------------------------------------
      if (ch === "-") {
        ch = prg.charAt(++prgIx);
        if (isBlank(ch)) {
          reader.prgIx = prgIx;
          return Token.mkSymbolPos(Symbol.mk("-"), reader.source, nline);
        }
      }

      // Number ----------------------------------------------------------------
      if (ch >= "0" && ch <= "9") {
        ch = prg.charAt(++prgIx);
        while (!isBlank(ch)) ch = prg.charAt(++prgIx);
        const n = prg.substring(prgIxD, prgIx);
        if (isNaN(n))
          reader.fail("Bad number '" + n + "'");
        const nn = Number(n);

        reader.prgIx = prgIx;
        const ix = n.indexOf(".");
        return (ix === -1)
          ? Token.mkIntPos(nn, reader.source, nline)
          : Token.mkFloatPos(nn, reader.source, nline)
        ;
      }

      // String ----------------------------------------------------------------
      if (ch === "\"") {
        ch = prg.charAt(++prgIx);
        let bf = "";
        while (ch >= " " && ch !== "\"") {
          if (ch === "\\") {
            ch = prg.charAt(++prgIx);
            switch (ch) {
            case "\"":
            case "\\":
            case "/":
              bf += ch;
              break;
            case "b":
              bf += "\b";
              break;
            case "f":
              bf += "\f";
              break;
            case "n":
              bf += "\n";
              break;
            case "r":
              bf += "\r";
              break;
            case "t":
              bf += "\t";
              break;
            case "u": {
              ch = prg.charAt(++prgIx);
              const start = prgIx;
              let c = 5;
              while (--c) {
                if (!isHex(ch))
                  reader.fail(
                    "Bad hexadecimal unicode in\n'" +
                    prg.substring(start - 2, start + 4) +
                    "'"
                  );
                ch = prg.charAt(++prgIx);
              }
              bf += toUnicode(prg.substring(start, start + 4));
              break;
            }
            default:
              reader.fail(
                "Bad escape sequence in\n'" +
                prg.substring(prgIxD, prgIx) +
                "'"
              );
            }
          } else {
            bf += ch;
          }
          ch = prg.charAt(++prgIx);
        }
        if (ch !== "\"") {
          reader.fail(
            "String does not end with \" in\n'" +
            prg.substring(prgIxD, prgIx) +
            "'"
          );
        }

        reader.prgIx = prgIx + 1;
        return Token.mkStringPos(bf, reader.source, nline);
      }

      // String multiline ------------------------------------------------------
      if (ch === "`") {
        ch = prg.charAt(++prgIx);
        let start = prgIx;
        const startLine = nline;
        while (ch !== "" && !isBlank(ch)) ch = prg.charAt(++prgIx);
        if (ch === "") reader.fail("String multiline not closed");
        const id = prg.substring(start, prgIx) + "`";
        const idLen = id.length;

        while (ch !== "" && isBlank(ch))
          if (ch === "\n") break;
          else ch = prg.charAt(++prgIx);

        if (ch === "") reader.fail("String multiline not closed");
        if (ch !== "\n")
          reader.fail("String multiline open must be at end of line");
        ch = prg.charAt(++prgIx);
        ++nline;
        start = prgIx;
        while (ch !== "" && isBlank(ch)) ch = prg.charAt(++prgIx);
        if (ch === "") reader.fail("String multiline not closed");
        const blanks = prgIx - start;

        let bf = "";
        while (ch !== "" && prg.substring(prgIx, prgIx + idLen) !== id) {
          if(ch === "\n") {
            bf += ch;
            ++nline;
            ch = prg.charAt(++prgIx);
            for (let i = 0; i < blanks; ++i) {
              if (ch !== "" && ch !== "\n" && isBlank(ch))
                ch = prg.charAt(++prgIx);
              else break;
            }
          } else {
            bf += ch;
            ch = prg.charAt(++prgIx);
          }
        }
        if (ch === "") reader.fail("String multiline not closed");

        reader.nline = nline;
        reader.prgIx = prgIx + idLen;
        return Token.mkStringPos(bf, reader.source, startLine);
      }

      // List ------------------------------------------------------------------
      if (ch === "(" || ch === "[" || ch === "{") {
        const sign = ch;
        let sum0 = sign === "(" ? 1 : 0;
        let sum1 = sign === "[" ? 1 : 0;
        let sum2 = sign === "{" ? 1 : 0;
        const lstart = prgIx + 1;
        const nlineStart = nline;

        while (sum0 + sum1 + sum2 && (ch = prg.charAt(++prgIx)) !== "") {
          switch (ch) {
          case "(":
            ++sum0;
            break;
          case "[":
            ++sum1;
            break;
          case "{":
            ++sum2;
            break;
          case ")":
            --sum0;
            break;
          case "]":
            --sum1;
            break;
          case "}":
            --sum2;
            break;
          }

          if (ch === "\"") {
            const start = prgIx;
            ch = prg.charAt(++prgIx);
            while (ch >= " " && ch !== "\"") {
              if (ch === "\\")
                ch = prg.charAt(++prgIx);
              ch = prg.charAt(++prgIx);
            }
            if (ch !== "\"")
              reader.fail(
                "Quotes unclosed in\n" + bigMsg(prg.substring(start, prgIx))
              );
            continue;
          }

          if (ch === "/") {
            const start = prgIx;
            ch = prg.charAt(++prgIx);
            if (ch === "/") {
              let ix = prg.indexOf("\n", prgIx + 1);
              if (ix === -1) ix = prg.length - 1;
              prgIx = ix;
              continue;
            }
            if (ch === "*") {
              ch = prg.charAt(++prgIx);
              while (ch !== "") {
                if (ch === "*" && prg.charAt(prgIx + 1) === "/") break;
                ch = prg.charAt(++prgIx);
              }
              if (ch === "")
                reader.fail(
                  "'/*' unclosed in\n" + bigMsg(prg.substring(start))
                );
              ++prgIx;
              continue;
            }
          }

          if (ch === "`") {
            const start = prgIx;
            const ix = prg.indexOf("\n", prgIx + 1);
            if (ix !== -1) {
              const close = prg.substring(prgIx + 1, ix) + ch;
              const ix2 = prg.indexOf(close, ix + 1);
              if (ix2 !== -1) {
                prgIx = ix2 + close.length;
                continue;
              }
            }
            reader.fail(
              "'`' unclosed or not at end of line in\n" +
              bigMsg(prg.substring(start))
            );
          }

          let e = " ";
          if (sum0 < 0) e = "(";
          if (sum1 < 0) e = "[";
          if (sum2 < 0) e = "{";
          if (e !== " ")
            reader.fail(
              "Extra '" + e + "' in\n" +
              bigMsg(prg.substring(prgIxD, prgIx + 1))
            );

          e = " ";
          if (sign === "(" && sum0 === 0 && sum1 > 0) e = "[";
          if (sign === "(" && sum0 === 0 && sum2 > 0) e = "{";
          if (sign === "[" && sum1 === 0 && sum0 > 0) e = "(";
          if (sign === "[" && sum1 === 0 && sum2 > 0) e = "{";
          if (sign === "{" && sum2 === 0 && sum0 > 0) e = "(";
          if (sign === "{" && sum2 === 0 && sum1 > 0) e = "[";
          if (e !== " ")
            reader.fail(
              "Internal '" + e + "' open when '" + sign +
              "' was closed in\n" + bigMsg(prg.substring(prgIxD, prgIx + 1))
            );
        }
        if (ch === "")
          reader.fail(
            "'" + sign + "' without close in\n" +
            bigMsg(prg.substring(prgIxD, prgIx))
          );

        const subr = Reader.fromReader(
          reader, prg.substring(lstart, prgIx), nline
        );
        const tk = subr.process();

        reader.nline = subr.nline;
        reader.prgIx = prgIx + 1;
        return Token.mkListPos(tk.listValue, reader.source, nlineStart);
      }

      // Closed parentheses ----------------------------------------------------
      if (ch === ")" || ch === "}" || ch === "]")
        reader.fail("'" + ch + "' not open");

      // Symbol ----------------------------------------------------------------
      while (!isBlankOrParent(ch)) ch = prg.charAt(++prgIx);
      reader.prgIx = prgIx;
      return Token.mkSymbolPos(
        Symbol.mk(prg.substring(prgIxD, prgIx)), reader.source, nline
      );
    }

    return null;
  }
}
