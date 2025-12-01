from typing import Dict, Optional
import uuid
from django.utils import timezone
from .models import DisjointSet as DisjointSetModel  # your Django model

class DisjointSet:
    def __init__(self):
        # maps item_id to its parent item_id
        self.parent: Dict[uuid.UUID, uuid.UUID] = {}
        # keeps track of size of each set for union by size
        self.size: Dict[uuid.UUID, int] = {}

    def make_set(self, item_id: uuid.UUID):
        """Create a new set with a single item."""
        if item_id not in self.parent:
            self.parent[item_id] = item_id
            self.size[item_id] = 1

    def find(self, item_id: uuid.UUID) -> uuid.UUID:
        """Find the root of the set containing the item."""
        if self.parent[item_id] != item_id:
            # path compression for efficiency
            self.parent[item_id] = self.find(self.parent[item_id])
        return self.parent[item_id]

    def union(self, item_a: uuid.UUID, item_b: uuid.UUID):
        """Union the sets containing item_a and item_b."""
        root_a = self.find(item_a)
        root_b = self.find(item_b)

        if root_a == root_b:
            return  # already in the same set

        # union by size: attach smaller set under larger set
        if self.size[root_a] < self.size[root_b]:
            root_a, root_b = root_b, root_a

        self.parent[root_b] = root_a
        self.size[root_a] += self.size[root_b]

        # Optional: update the database
        self.update_db(root_a, root_b)

    def update_db(self, root_a: uuid.UUID, root_b: uuid.UUID):
        """Update the disjoint_sets table after a union."""
        now = timezone.now()
        # Make root_a the parent of root_b
        DisjointSetModel.objects.filter(node=root_b).update(parent=root_a, updated_at=now)

    def populate_from_db(self):
        """Load the disjoint sets from the database into memory."""
        all_sets = DisjointSetModel.objects.all()
        for ds in all_sets:
            self.parent[ds.node] = ds.parent
            self.size[ds.node] = ds.size

    def save_new_node(self, item_id: uuid.UUID):
        """Add a new item to the database as a separate set."""
        if item_id not in self.parent:
            self.make_set(item_id)
            DisjointSetModel.objects.create(node=item_id, parent=item_id, size=1)
