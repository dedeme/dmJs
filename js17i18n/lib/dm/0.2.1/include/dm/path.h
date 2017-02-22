/*
 *Copyright 24-Aug-2015 ºDeme
 *
 *This file is part of 'dm'
 *'dm' is free software: you can redistribute it and/or modify
 *it under the terms of the GNU General Public License as published by
 *the Free Software Foundation, either version 3 of the License.
 *
 *'dm' is distributed in the hope that it will be useful,
 *but WITHOUT ANY WARRANTY; without even the implied warranty of
 *MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *GNU General Public License for more details.
 *
 *You should have received a copy of the GNU General Public License
 *along with 'dm'.  If not, see <http://www.gnu.org/licenses/>.
 */

/// Utilities for managing file paths

#ifndef DM_PATH_H
  #define DM_PATH_H

/// Returns name and extension of path.<br>
/// If path is "" or ends at ("/") it returns "".
char *path_name (char *path);

/**
Returns only extension of path. Extension is
returned with point (e.g., ".", ".txt") <br>
If path does not have extension it returns "".
*/
char *path_extension (char *path);

/// Returns only name of path.<br>
/// If path is "", ends at ("/"), or if file starts with point, it returns "".
char *path_only_name (char *path);

/// Puts the parent path of 'path'.<br>
/// If 'path' is "" or "/" 'target' is an empty string.
char *path_parent (char *path);

/// Concatenation of paths. Variable argumens must finish with NULL.
char *path_cat (char *s, ...);

#endif
