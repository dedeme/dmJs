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

/// Array structure

#ifndef DM_ARR_H
  # define DM_ARR_H

#include <stddef.h>
#include "dm/It.h"

///
typedef struct{
  size_t size;           // R
  void **os;             // R & W (elements. See arr_set && arr_get)
  size_t _max_size;      // -
} Arr;


/// Initializates an array
Arr *arr_new (void);

/**
Initializates an array with an intial size buffer.
  this   : Arr object to create
  buffer : Initial size buffer. Its default is 15.
*/
Arr *arr_new_buf (size_t size_buf);

/// Adds an element
void arr_add (Arr *this, void *element);

/// Adds an array
void arr_add_arr (Arr *this, Arr *another);

/// returns element at position 'index'. Tests limits.
void *arr_get (Arr *this, size_t index);

/// Inserts an element at 'index'
void arr_insert (Arr *this, void *element, size_t index);

/// Inserts an array at 'index'
void arr_insert_arr (Arr *this, Arr *another, size_t index);

/// Removes the elemente at 'index'
void arr_remove (Arr *this, size_t index);

/// Removes elements between 'begin' (inclusive) and 'end' (exclusive).
void arr_remove_range (Arr *this, size_t begin, size_t end);

/// Reverses elements of 'this'
void arr_reverse (Arr *this);

/// Replaces element at 'index' by a new 'element'. Tests limits.
void arr_set (Arr *this, void *element, size_t index);

/// Sorts elements of 'this' according 'f'
///   f: Function which returns 0 (equals), > 0 (greater) or < 0 (less)
void arr_sort (Arr *this, int (*f)(void *, void *));

/// Ascending natural sort of a string array ('this' can include null elements)
void arr_sort_str (Arr *this);

/// Ascending locale sort of a string array ('this' can include null elements)
void arr_sort_locale (Arr *this);

/// Should be used after calling <tt>cryp_random_init()</tt> or
/// <tt>sys_init()</tt>
void arr_shuffle (Arr *this);

///
It *arr_to_it (Arr *this);

///
Arr *arr_from_it (It *it);

#endif
