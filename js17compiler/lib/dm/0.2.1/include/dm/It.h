/*
 *Copyright 25-Aug-2015 ºDeme
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
Iterator.<br>
Utilities for managing iterators.<br>
List:<br>
<table>
<tr><td colspan="4"><hr></td></tr>
<tr><td colspan="4"><b>Constructors</b></td></tr>
<tr>
<td width="200" valign="top">
<a href="#hp:it_from">it_from</a><br>
<a href="#hp:it_empty">it_empty</a><br>
</td><td width="200" valign="top">
<a href="#hp:it_range">it_new</a><br>
<a href="#hp:it_unary">it_unary</a><br>
</td>
</tr>
<tr><td colspan="4"><hr></td></tr>
<tr><td colspan="4"><b>Object</b></td></tr>
<tr>
</td><td valign="top">
<a href="#hp:it_has_next">it_has_next</a><br>
</td><td valign="top">
<a href="#hp:it_next">it_next</a><br>
</td><td valign="top">
<a href="#hp:it_peek">it_peek</a><br>
</td>
</tr>
<tr><td colspan="4"><hr></td></tr>
<tr><td colspan="4"><b>Converters</b></td></tr>
<tr>
<td valign="top">
<a href="#hp:it_cat">it_cat</a><br>
<a href="#hp:it_drop">it_drop</a><br>
<a href="#hp:it_dropf">it_dropf</a><br>
<a href="#hp:it_filter">it_filter</a><br>
</td><td valign="top">
<a href="#hp:it_map">it_map</a><br>
<a href="#hp:it_reverse">it_reverse <sup>*</su></a><br>
<a href="#hp:it_sort_locale">it_rsort_locale <sup>*</su></a><br>
<a href="#hp:it_sort_str">it_rsort_str <sup>*</su></a><br>
</td><td valign="top">
<a href="#hp:it_sort">it_sort <sup>*</su></a><br>
<a href="#hp:it_sort_locale">it_sort_locale <sup>*</su></a><br>
<a href="#hp:it_sort_str">it_sort_str <sup>*</su></a><br>
</td><td valign="top">
<a href="#hp:it_take">it_take</a><br>
<a href="#hp:it_takef">it_takef</a><br>
<a href="#hp:it_to_peek">it_to_peek</a><br>
</td>
</tr>
<tr><td colspan="4"><hr></td></tr>
<tr><td colspan="4"><b>Consumers</b></td></tr>
<tr>
<td valign="top">
<a href="#hp:it_find">it_find</a><br>
<a href="#hp:it_contains">it_contains</a><br>
<a href="#hp:it_contains_str">it_contains_str</a><br>
<a href="#hp:it_count">it_count</a><br>
</td><td valign="top">
<a href="#hp:it_each">it_each</a><br>
<a href="#hp:it_each_ix">it_each_ix</a><br>
<a href="#hp:it_eq">it_eq</a><br>
</td><td valign="top">
<a href="#hp:it_eq_str">it_eq_str</a><br>
<a href="#hp:it_index">it_index</a><br>
<a href="#hp:it_index">it_index_str</a><br>
</td><td valign="top">
<a href="#hp:it_last_index">it_last_index</a><br>
<a href="#hp:it_last_index">it_last_index_str</a><br>
<a href="#hp:it_to">it_to</a><br>
</td>
</tr>
<tr><td colspan="4"><hr></td></tr>
</table>
<p><sup>*</sup> Note: <i>These converters are not lazy, since all of them
construct an intermediate array.</i></p>
*/

#ifndef DM_IT_H
  #define DM_IT_H

#include <stddef.h>

///
#define it_from arr_to_it

///
#define it_to arr_from_it

///
typedef struct {
  void *o;                   // -
  int (*has_next)(void *o);  // -
  void *(*next)(void *o);    // -
} It;

///
#define ItPeek It

///
It *it_new(
  void *o,
  int (*has_next)(void *o),
  void *(*next)(void *o)
);

///
It *it_empty(void);

///
It *it_unary(void *e);

///
ItPeek *it_to_peek(It *this);

///
int it_has_next (It *this);

///
void *it_next (It *this);

/// Only must be used with Iterators type ItPeek. This iterators are returned
/// by <tt>it_to_peek()</tt> and <tt>it_dropf()</tt>
void *it_peek (ItPeek *this);

///
It *it_cat (It *this, It *another);

///
It *it_take (It *this, size_t n);

///
It *it_takef (It *this, int (*predicate)(void *e));

///
It *it_drop (It *this, size_t n);

///
ItPeek *it_dropf (It *this, int (*predicate)(void *e));

///
It *it_filter (It *this, int (*predicate)(void *e));

///
It *it_map (It *this, void *(*converter)(void *e));

///
It *it_map2 (It *this, void *(*conv1)(void *e), void *(*conv2)(void *e));

///
It *it_zip (It *it1, It *it2);

///
It *it_zip3 (It *it1, It *it2, It *it3);

///
It *it_reverse (It *this);

///
It *it_sort (It *this, int (*comparator)(void *e1, void *e2));

///
It *it_sort_str (It *this);

///
It *it_rsort_str (It *this);

///
It *it_sort_locale (It *this);

///
It *it_rsort_locale (It *this);

///
void it_each (It *this, void (*f)(void *e));

///
void it_each_ix (It *this, void (*f)(void *e, size_t ix));

///
size_t it_count (It *this);

///
int it_eq (It *it1, It *it2, int (*feq)(void *e1, void *e2));

///
int it_eq_str (It *it1, It *it2);

///
int it_index (It *this, int (*predicate)(void *e));

///
int it_contains (It *this, int (*predicate)(void *e));

///
int it_last_index (It *this, int (*predicate)(void *e));

///
int it_index_str (It *this, char *s);

///
int it_contains_str (It *this, char *s);

///
int it_last_index_str (It *this, char *s);

/// Returns firs element which satisfies 'predicate' or NULL.
void *it_find (It *this, int (*predicate)(void *e));

#endif


