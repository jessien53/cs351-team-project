# backend/myapp/apps.py
from django.apps import AppConfig


class MyappConfig(AppConfig):
    default_auto_field = "django.db.models.BigAutoField"
    name = "myapp"

    def ready(self):
        # Import things here to avoid AppRegistryNotReady error
        from .trie_loader import autocomplete_trie
        from .models import Item


        #adding the disjoint import
        from .disjointSet_loader import ds

        print("Populating the autocomplete Trie...")

        # Get all product names from the database
        product_titles = Item.objects.values_list("title", flat=True)

        for title in product_titles:
            # Split titles into individual words
            words_in_title = title.split()
            for word in words_in_title:
                # The insert method handles validation
                autocomplete_trie.insert(word)

        print(f"Trie populated with {autocomplete_trie.wordCount()} words.")


        print("Populating disjoint set based on tags...")
        all_items = Item.objects.filter(is_active=True).values("item_id", "tags")
        tag_map = {}
        for item in all_items:
            item_id = item["item_id"]
            item_tags = item["tags"] or []
            for tag in item_tags:
                tag_map.setdefault(tag, []).append(item_id)

        for item_ids in tag_map.values():
            if not item_ids:
                continue
            root = item_ids[0]
            for other in item_ids[1:]:
                ds.union(root, other)

        print("Disjoint set populated successfully.")


