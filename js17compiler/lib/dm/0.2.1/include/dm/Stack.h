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
 * along with 'dm'. If not, see <http://www.gnu.org/licenses/>.
 */

/// Stack container

#ifndef DM_STACK_H
  #define DM_STACK_H

#include "dm/It.h"


///
#define Stack struct stack_Stack

Stack;

///
Stack *stack_new (void);

///
int stack_empty (Stack *this);

///
void stack_push (Stack *this, void *o);

/// If "this" is not empty, throws an error
void *stack_pop (Stack *this);

/// If "this" is not empty, throws an error
void *stack_peek (Stack *this);

/// Returs an iterator from top to bottom
It *stack_to_it (Stack *this);

/// 'it' goes from bottom to top
Stack *stack_from_it (It *it);

#endif






