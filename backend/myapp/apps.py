# backend/myapp/apps.py
from django.apps import AppConfig


class MyappConfig(AppConfig):
    default_auto_field = "django.db.models.BigAutoField"
    name = "myapp"

    def ready(self):
        # Import things here to avoid AppRegistryNotReady error
        from .trie_loader import autocomplete_trie
        from .models import Item

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
