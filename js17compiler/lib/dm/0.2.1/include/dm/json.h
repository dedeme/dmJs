/*
 * Copyright 27-Aug-2015 ºDeme
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
Utilities for managing json strings.
*/

#ifndef DM_JSON_H
# define DM_JSON_H

#include "dm/Tuples.h"
#include "dm/Map.h"

/// Returns 1 if json is "null" or 0 in another case.
int json_rnull (char *json);
/// Returns NULL (with *r=1 if json is "true" and *r=0 if json is "false"), or
/// an error message.
char *json_rbool (int *rs, char *json);
/// Returns NULL (with *r = number), or an error message.
char *json_rnumber (double *rs, char *json);
/// Returns struct tp2(err:char*|NULL, rs:char *|NULL). Both elements
/// of tp2 are not NULL.
Tp2 *json_rstring (char *json);
/// Returns struct tp2(err:char*|NULL, rs:Arr[char *] *|NULL).
/// Both elements of tp2 are not NULL.
Tp2 *json_rarray (char *json);
/// Returns struct tp(err:char*|NULL, rs:Map[char*, char*] *|NULL).
/// Both elements of tp are not NULL.
Tp2 *json_robject (char *json);
///
char *json_wnull(void);
/// Writes 'false' if n is 0 and 'true' in another case.
char *json_wbool(int n);
///
char *json_wint(int n);
///
char *json_wuint(unsigned n);
/// Scale is forced between [0 - 9] inclusive
char *json_wdouble(double n, int scale);
///
char *json_wstring(char *s);
///
char *json_warray(Arr *a);
///
char *json_wobject(Map *m);
/// Creates a map to add json objects
Map *jsonw_new(void);
/// Converts this to its json value.
char *jsonw_write(Map *this);
///
void jsonw_null(Map *this, char *key);
/// Adds 'false' if n is 0 and 'true' in another case.
void jsonw_bool(Map *this, char *key, int n);
///
void jsonw_int(Map *this, char *key, int n);
///
void jsonw_uint(Map *this, char *key, unsigned n);
///
void jsonw_double(Map *this, char *key, double n, int scale);
/// Admits null values of 's'
void jsonw_string(Map *this, char *key, char *s);
/// Admits null values of 'a'
void jsonw_array(Map *this, char *key, Arr *a);
/// Admits null values of 'm'
void jsonw_object(Map *this, char *key, Map *m);

/// Returns 1 if 'key' exists or 0 in the other case.
int jsonr_exists(Map *this, char *key);
/// 1 if value is true or 0 if it is false. Errors o not existent key make
/// "crashes".
int jsonr_bool(Map *this, char *key);
/// Errors or not existent key make "crashes".
double jsonr_number(Map *this, char *key);
/// Can return a NULL value. Errors or not existent key make "crashes".
char *jsonr_string(Map *this, char *key);
/// Can return a NULL value. Errors or not existent key make "crashes".
Arr *jsonr_array(Map *this, char *key);
/// Can return a NULL value. Errors or not existent key make "crashes".
Map *jsonr_object(Map *this, char *key);

#endif

