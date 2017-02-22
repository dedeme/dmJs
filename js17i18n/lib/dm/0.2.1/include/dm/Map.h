/*
 * Copyright 26-Aug-2015 ºDeme
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

/// Map structure

#ifndef DM_MAP_H
# define DM_MAP_H

#include "dm/Arr.h"

/// A Map is an Arr[Kv] and you can apply <tt>arr_xxx</tt> functions to it.
#define Map Arr

/// Initializates a map
Map *map_new(void);

/**
Puts 'value' with key 'key'. If key already exists its value is changed.
  this  : The map
  key   : Entry key. It must not be NULL.
  value : New value
*/
void map_put(Map *this, char *key, void *value);

/**
Returns a reference to value whose key is 'key' or NULL if 'this'
does not contain 'key'.<br>
It can return NULL if the key value es NULL too. In this case is necessary to
call the 'map_has_key' to distinguish each case.
*/
void *map_get(Map *this, char *key);

/// Removes value with key 'key' or does nothing if 'key' does not exists
void map_remove(Map *this, char *key);

/// Returns distint to '0' if 'this' contains key 'key' or '0' otherwise.
int map_has_key(Map *this, char *key);

/// Returns an iterator of Kv's
It *map_to_it (Map *this);

/// Returns an iterator of Kv's sorted by key
It *map_to_it_sort (Map *this);

/// Returns an iterator of Kv's sorted by key in locale
It *map_to_it_sort_locale (Map *this);

#endif
