/*
 * Copyright 13-Aug-2015 ºDeme
 *
 * This file is part of 'dm'
 * 'dm' is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License.
 *
 * 'dm' is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with 'dm'.  If not, see <http://www.gnu.org/licenses/>.
 */

/**
Http client.<br>
For use this file you need set gcc with <tt>-L/usr/lib/i386-linux-gnu
-lcurl</tt> or else option with can be retrieve with curl-config --libs.<br>
<p><b>Infomation about curl</b>:<br>
<a href="http://curl.haxx.se/libcurl/c/libcurl-tutorial.html">Tutorial</a><br>
<a href="http://curl.haxx.se/libcurl/using">Using</a></p>
*/

#ifndef DM_HTTP_H
  # define DM_HTTP_H

/// Returns the ip of a host
char *http_get_ip(char *host);

/**
Split an URL.
  protocol : Returns the protocol (e.g. "http"). If it is missing, 'http' is
             returned.
  host     : Returns the host name (e.g. "www.google.es")
  page     : Returns page. If 'page' is the root one or does not exists an
             empty string is returned.
  url      : Url to split.
*/
void http_url(char **protocol, char **host, char **page, char *url);

/// It is equal to http_read_encoding(url, "UTF-8")
char *http_read(char *url);

/// Reads a http page on port 80.
char *http_read_encoding(char *url, char *encoding);

#endif
