//- dm/dm.js
//- dm/b41.js
/*
 * Copyright 18-Feb-2017 ºDeme
 * GNU General Public License - V3 <http://www.gnu.org/licenses/>
 */
/*global window, XMLHttpRequest, ActiveXObject, ActiveXObject, dm */

(() => {
  const b41 = dm.b41;

  dm.ajax = {};
  const ajax = dm.ajax;

  /// Sends a client request to a server in 'url'.
  ///   url : The target url.
  ///   rq  : An object to send. It will be serialized with JSON and
  ///         compressed with b41.compress
  ///   f   : Function to receive the server response. Its Dynamic object has
  ///         been decompressed with b41.decompress and restored with JSON
  //# str - ? - func(?) -
  ajax.send = (url, rq, f) => {
    const getRequest = callback => {
      let r;
      try {
        r = new XMLHttpRequest();
      } catch (e1) {
        try {
          r = new ActiveXObject("Msxml2.XMLHTTP");
        } catch (e2) {
          try {
            r = new ActiveXObject("Microsoft.XMLHTTP");
          } catch (e3) {
            return null;
          }
        }
      }

      r.onreadystatechange = () => {
        if (r.readyState === 4) {
          try {
            callback(JSON.parse(b41.decompress(r.responseText)));
          } catch (e) {
            window.console.log(e);
            window.console.log(r.responseText);
            window.console.log(b41.decompress(r.responseText));
          }
        }
      };
      return r;
    };

    let request = getRequest(f);
    request.open("POST", url, true);
    request.setRequestHeader(
      "Content-Type",
      "application/x-www-form-urlencoded;charset=UTF-8"
    );
    request.send(b41.compress(JSON.stringify(rq)));
  };

  /// Sends a client request to its server.
  ///   rq  : An object to send. It will be serialized with JSON and
  ///         codified with encodeURIComponent
  ///   f   : Function to receive the server response. Its Dynamic object is
  ///         decdified with decodeURIComponent and restored with JSON
  //# ? - func(?) -
  ajax.autosend = (rq, f) => {
    ajax.send("", rq, f);
  };

})();


