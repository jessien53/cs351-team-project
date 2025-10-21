from django.db import models

# This model maps to your *existing* 'items' table in Supabase
class Item(models.Model):
    # We only need to define the fields our app will use.
    # db_column='title' tells Django the exact column name in Supabase.
    item_id = models.UUIDField(primary_key=True, db_column='item_id')
    title = models.CharField(max_length=255, db_column='title')

    class Meta:
        managed = False  # Tells Django *not* to manage this table's schema
        db_table = 'items' # The exact table name in Supabase

    def __str__(self):
        return self.title