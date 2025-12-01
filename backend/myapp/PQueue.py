# app/services/union_find.py
from .models import Item
from django.db import transaction
from typing import List, Dict, Optional

class PriorityQueue:
    def __init__(self):
        self.heap: List[Dict] = []

    def swap(self, i: int, j: int):
        self.heap[i], self.heap[j] = self.heap[j], self.heap[i]

    def bubble_up(self, index: int):
        parent = (index - 1) // 2
        while index > 0 and self.heap[index]['priority'] > self.heap[parent]['priority']:
            self.swap(index, parent)
            index = parent
            parent = (index - 1) // 2

    def bubble_down(self, index: int):
        length = len(self.heap)
        left = 2 * index + 1
        right = 2 * index + 2
        largest = index

        if left < length and self.heap[left]['priority'] > self.heap[largest]['priority']:
            largest = left
        if right < length and self.heap[right]['priority'] > self.heap[largest]['priority']:
            largest = right
        if largest != index:
            self.swap(index, largest)
            self.bubble_down(largest)
            
    def enqueue(self, item: Dict):
        """Add item to the queue. Item must have 'priority' key."""
        self.heap.append(item)
        self.bubble_up(len(self.heap) - 1)

    def dequeue(self) -> Optional[Dict]:
        """Remove and return    the highest-priority item."""
        if not self.heap:
            return None
        max_item = self.heap[0]
        end = self.heap.pop()
        if self.heap:
            self.heap[0] = end
            self.bubble_down(0)
        return max_item

    def peek(self) -> Optional[Dict]:
        """Return the highest-priority item without removing it"""
        return self.heap[0] if self.heap else None

    def to_list(self) -> List[Dict]:
        """Return a sorted list without modifying the heap"""
        return sorted(self.heap, key=lambda x: x['priority'], reverse=True)

    def size(self) -> int:
        return len(self.heap)
