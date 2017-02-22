/*
 *Copyright 26-Aug-2015 ºDeme
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

/**
Utilities for managing globals values.<br>
A way to initializes system is:
  sys_new("app_name");
  sys_locale("es_ES.utf8");
  sys_random();
If application is a 'web application' you can sustitute
<tt>sys_new("app_name")</tt> by <tt>sys_new_cgi("app_name")</tt>
*/

#ifndef DM_SYS_H
# define DM_SYS_H

#include <stddef.h>
#include "dm/Arr.h"

/// Struct with system data
typedef struct {
  char *home;  // R
} Sys;

/**
Initializates a normal program.<br>
It do next operations:
  * Creates user directory in ".dmCApp/" + 'path'. Its path is in Sys.home.
*/
Sys *sys_new (char *path);

/**
Initializates a cgi program.<br>
It do next operations:
  * Register user directory in "[cgi_directory]/" + 'path'. This directory
    should be created by hand with www-data permisions if it is need.
*/
Sys *sys_new_cgi (char *path);

/// Set LC_ALL, for example: <tt>sys_locale("es_ES.utf8")</tt>
void sys_locale (char *language);

/// Call to <tt>cryp_random_init()</tt>
void sys_random (void);

/// Returns 1 if f1 and f2 are equals inside the gap +- 'gap'
int sys_float_eq (float f1, float f2, float gap);

/**
Executes 'command', redirecting stderr to stdout, and returns its standard
out (excluding the trailing '\n' of each line). If command fails, function
returns NULL.
*/
Arr *sys_cmd(char *command);


#endif
