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

/// Definitions.

#ifndef DM_DEFS_H
  #define DM_DEFS_H

///
#define MALLOC(type) (type *)GC_MALLOC(sizeof(type))

///
#define ATOMIC(type, size) (type *)GC_MALLOC_ATOMIC(size)

///
#define FNX(name, type, o) void name(void *__o) { \
  type *o = (type *)__o;

///
#define FNP(name, type, o) int name(void *__o) { \
  type *o = (type *)__o;

///
#define FNM(name, type, o) void *name(void *__o) { \
  type *o = (type *)__o;

///
#define FNE(name, type, o1, o2) \
  int name(void *__o1, void *__o2) { \
    type *o1 = (type *)__o1; \
    type *o2 = (type *)__o2;

///
#define _FN }
///
#define ERROR_DATA __FILE__, __func__, __LINE__

/**
Uses 'i' as iterator from 'begin' to 'end'
  i    : [int] Iterator variable
  begin: [int] Intial value (inclusive)
  end  : [int] Last value (exclusive)</pre>
*/
#define RANGE(i, begin, end) { \
  int __begin = (begin); \
  int __end = (end); \
  int i; \
  for (i = __begin; i < __end; ++i)

/**
Uses 'i' as iterator from 0 to 'end'
  i    : [int] Iterator variable
  end  : [int] Last value (exclusive)</pre>
*/
#define RANGE0(i, end) { \
  int __end = (end); \
  int i; \
  for (i = 0; i < __end; ++i)

///
#define _RANGE }

/**
Iterates over a 'Arr'. You can access to the 'element' index with _i.
  a      : A Arr *
  type   : Element type without pointer sign (*)
  element: An element of 'a'
For example:
  EACH(a, char, s) {
    printf("[%d] -> %s\n", _i, s);
  } EACH_END
*/
#define EACH(a, type, element) { \
  size_t __size = (a->size); \
  size_t _i; \
  type *element; \
  for (_i = 0; _i < __size; ++_i) { \
    element = a->os[_i];

/**
Iterates over a 'Arr' in reverse order. You can access to the 'element'
index with _i.
  a      : A Arr *
  type   : Element type without pointer sign (*)
  element: An element of 'a'
For example:
  EACHR(a, char, s) {
    printf("[%d] -> %s\n", _i, s);
  } EACH_END
*/
#define EACHR(a, type, element) { \
  size_t _i = a->size; \
  type *element; \
  while (_i) { \
    element = a->os[--_i];

/// Finalizes an EACH or a EACHR
#define _EACH }}

/// Repeat its body 'n' times
#define REPEAT(n) { \
  int __i = (n) + 1; \
  while (--__i) {

/// Finalizes an REPEAT
#define _REPEAT }}

#endif

