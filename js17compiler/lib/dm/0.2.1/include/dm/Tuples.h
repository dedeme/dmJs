/*
 * Copyright 24-Aug-2015 ºDeme
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
 * along with 'dm'. If not, see <http://www.gnu.org/licenses/>.
 */

/// Several kind of tuples

#ifndef DM_TUPLES_H
  #define DM_TUPLES_H

///
typedef struct {
  void *o1; // R&W
  void *o2; // R&W
} Tp2;

///
Tp2 *tp2_new(void *o1, void *o2);

///
typedef struct {
  void *o1; // R&W
  void *o2; // R&W
  void *o3; // R&W
} Tp3;

///
Tp3 *tp3_new(void *o1, void *o2, void *o3);

///
typedef struct {
  char *key;   // R&W
  void *value; // R&W
} Kv;

///
Kv *kv_new(char *key, void *value);

#endif
