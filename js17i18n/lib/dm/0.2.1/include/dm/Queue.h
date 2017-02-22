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

/// Queue container

#ifndef DM_QUEUE_H
  #define DM_QUEUE_H

#include "dm/It.h"

///
#define Queue struct queue_Queue

Queue;

///
Queue *queue_new (void);

///
int queue_empty (Queue *this);

///
void queue_in (Queue *this, void *o);

///
void queue_in_fore (Queue *this, void *o);

/// If "this" is not empty, throws an error
void *queue_out (Queue *this);

/// If "this" is not empty, throws an error
void *queue_out_back (Queue *this);

/// Shows the fore element. If "this" is not empty, throws an error
void *queue_fore (Queue *this);

/// Shows the back element. If "this" is not empty, throws an error
void *queue_back (Queue *this);

/// Iterator from back to fore
It *queue_to_it (Queue *this);

/// Iterator from fore to back
It *queue_to_it_reverse (Queue *this);

/// Adds elements of 'it' with <tt>queue_in()</tt>.
Queue *queue_from_it (It *it);

#endif






