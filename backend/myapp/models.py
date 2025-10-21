from django.db import models
from django.contrib.postgres.fields import ArrayField
import uuid


class Item(models.Model):
    item_id = models.UUIDField(
        primary_key=True, db_column="item_id", default=uuid.uuid4, editable=False
    )
    seller_id = models.UUIDField(db_column="seller_id")
    title = models.CharField(max_length=200)
    description = models.TextField()
    category_id = models.UUIDField(db_column="category_id")
    subcategory_id = models.UUIDField(null=True, blank=True)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    quantity_available = models.PositiveIntegerField(default=1)
    is_digital = models.BooleanField(default=False)

    CONDITION_CHOICES = [
        ("new", "New"),
        ("like_new", "Like New"),
        ("good", "Good"),
        ("fair", "Fair"),
        ("poor", "Poor"),
    ]
    condition = models.CharField(
        max_length=20, choices=CONDITION_CHOICES, null=True, blank=True
    )

    tags = ArrayField(models.CharField(max_length=100), null=True, blank=True)

    processing_time = models.CharField(max_length=50, null=True, blank=True)
    customizable = models.BooleanField(default=False)
    thumbnail_url = models.URLField(max_length=500)
    video_url = models.URLField(max_length=500, null=True, blank=True)

    delivery_available = models.BooleanField(default=False)
    delivery_radius = models.PositiveIntegerField(null=True, blank=True)
    delivery_fee = models.DecimalField(
        max_digits=10, decimal_places=2, null=True, blank=True
    )
    shipping_available = models.BooleanField(default=False)

    total_sales = models.PositiveIntegerField(default=0)
    views_count = models.PositiveIntegerField(default=0)
    favorites_count = models.PositiveIntegerField(default=0)
    rating_average = models.DecimalField(max_digits=3, decimal_places=2, default=0.0)
    rating_count = models.PositiveIntegerField(default=0)
    featured = models.BooleanField(default=False)

    STATUS_CHOICES = [
        ("active", "Active"),
        ("sold_out", "Sold Out"),
        ("draft", "Draft"),
        ("archived", "Archived"),
        ("paused", "Paused"),
    ]
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="active")
    is_active = models.BooleanField(default=True)
    auto_renew = models.BooleanField(default=False)

    expiry_date = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=False, null=True, blank=True)
    updated_at = models.DateTimeField(auto_now=False, null=True, blank=True)
    published_at = models.DateTimeField(null=True, blank=True)
    last_renewed_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        managed = False  # Don't let Django manage Supabase schema
        db_table = "items"

    def __str__(self):
        return self.title


class Category(models.Model):
    category_id = models.UUIDField(
        primary_key=True, db_column="category_id", default=uuid.uuid4, editable=False
    )
    name = models.CharField(max_length=100, unique=True)
    slug = models.SlugField(max_length=100, unique=True)
    icon = models.CharField(max_length=50, null=True, blank=True)
    parent_category = models.ForeignKey(
        "self",
        null=True,
        blank=True,
        on_delete=models.SET_NULL,
        db_column="parent_category_id",
        related_name="subcategories",
    )
    display_order = models.IntegerField(default=0)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        managed = False  # Supabase manages this table
        db_table = "categories"

    def __str__(self):
        return self.name
