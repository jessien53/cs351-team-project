# from django.shortcuts import render
from django.http import JsonResponse, Http404
from django.db.models import Q
from .trie_loader import autocomplete_trie
from .models import Item, Profile, Category
from .storage import upload_image_to_supabase
import json
from django.views.decorators.http import require_http_methods
from django.views.decorators.csrf import csrf_exempt
from django.utils import timezone
import uuid
from time import localtime
from datetime import datetime, timedelta
from .pQueue_loader import pq
from .disjointSet_loader import ds
from collections import defaultdict

def get_relative_time(dt):
    """
    Convert a datetime to a human-readable relative time string.
    E.g., '2hrs ago', '3 days ago', '1 week ago', etc.
    """
    if dt is None:
        return "Unknown"

    # Make dt timezone-aware if it isn't already
    if timezone.is_naive(dt):
        dt = timezone.make_aware(dt)

    now = timezone.now()
    diff = now - dt

    seconds = diff.total_seconds()

    if seconds < 60:
        return "Just now"
    elif seconds < 3600:  # Less than 1 hour
        mins = int(seconds / 60)
        return f"{mins}min{'s' if mins != 1 else ''} ago"
    elif seconds < 86400:  # Less than 1 day
        hours = int(seconds / 3600)
        return f"{hours}hr{'s' if hours != 1 else ''} ago"
    elif seconds < 604800:  # Less than 1 week
        days = int(seconds / 86400)
        return f"{days} day{'s' if days != 1 else ''} ago"
    elif seconds < 2592000:  # Less than 30 days
        weeks = int(seconds / 604800)
        return f"{weeks} week{'s' if weeks != 1 else ''} ago"
    elif seconds < 31536000:  # Less than 1 year
        months = int(seconds / 2592000)
        return f"{months} month{'s' if months != 1 else ''} ago"
    else:
        years = int(seconds / 31536000)
        return f"{years} year{'s' if years != 1 else ''} ago"


def autocomplete_view(request):
    # Get the 'q' parameter from the URL (e.g., /api/autocomplete/?q=comp)
    query = request.GET.get("q", "")

    if query:
        suggestions = autocomplete_trie.get_suggestions(query)
        # limit the number of suggestions
        suggestions = suggestions[:10]
    else:
        suggestions = []

    return JsonResponse({"suggestions": suggestions})


def profile_view(request, id):
    """
    Handle fetching a single user profile.
    GET /api/profile/<id>/
    """
    try:
        # Get the profile by its UUID
        profile = Profile.objects.get(user_id=id)

        # Format the data for the frontend
        profile_data = {
            "user_id": profile.user_id,
            "full_name": profile.full_name,
            "avatar_url": profile.avatar_url,
            "major": profile.major,
            "is_verified": profile.is_verified,
            "bio": profile.bio,
            "items_sold": profile.items_sold,
            "avg_response_time": profile.avg_response_time,
            "followers_count": profile.followers_count,
            "rating_average": float(profile.rating_average),  # Convert Decimal
            "rating_count": profile.rating_count,
            "services": profile.services or [],  # Handle null
            "created_at": profile.created_at,
        }

        return JsonResponse(profile_data)

    except Profile.DoesNotExist:
        raise Http404("Profile not found")
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)


def listing_view(request, item_id):
    """
    Handle fetching a single item by its ID.
    GET /api/item/<uuid:item_id>/
    """
    try:
        # Use select_related to join the seller profile in one query
        item = Item.objects.select_related("seller_id").get(item_id=item_id)

        # Get category name
        category_name = "General"
        try:
            category = Category.objects.get(category_id=item.category_id)
            category_name = category.name
        except Category.DoesNotExist:
            pass

        # Get seller data
        seller_data = {}
        if item.seller_id:
            seller_data = {
                "seller_id": str(item.seller_id.user_id),
                "seller_name": item.seller_id.full_name,
                "seller_major": item.seller_id.major,
                "seller_rating": float(item.seller_id.rating_average),
                "seller_sales": item.seller_id.items_sold,
                "seller_avatar_url": item.seller_id.avatar_url,
                "seller_is_verified": item.seller_id.is_verified,
            }

        # Format the item data for the frontend
        item_data = {
            "item_id": str(item.item_id),
            "title": item.title,
            "description": item.description,
            "category_id": str(item.category_id),
            "price": float(item.price),  # Convert Decimal to float
            "quantity_available": item.quantity_available,
            "is_digital": item.is_digital,
            "condition": item.condition,
            "tags": item.tags or [],
            "processing_time": item.processing_time,
            "customizable": item.customizable,
            "thumbnail_url": item.thumbnail_url,
            "video_url": item.video_url,
            "delivery_available": item.delivery_available,
            "delivery_fee": (
                float(item.delivery_fee) if item.delivery_fee is not None else None
            ),
            "shipping_available": item.shipping_available,
            "total_sales": item.total_sales,
            "views_count": item.views_count,
            "favorites_count": item.favorites_count,
            "rating_average": float(item.rating_average),
            "rating_count": item.rating_count,
            "status": item.status,
            "created_at": item.created_at,
            # Add seller data
            **seller_data,
        }

        return JsonResponse(item_data)

    except Item.DoesNotExist:
        return JsonResponse({"error": "Item not found"}, status=404)
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)


# def search_view(request):
#     """
#     Handle product search with filtering and sorting.
#     GET /api/search/?q=<query>&tags=<tag1,tag2>&sort=<sort_option>&page=<page>&per_page=<per_page>
#     Returns: {"results": [...], "total": int, "page": int, "per_page": int}
#     """
    
#     query = request.GET.get("q", "").strip()
#     tags = request.GET.get("tags", "").strip()
#     sort = request.GET.get("sort", "relevance")
#     page = int(request.GET.get("page", 1))
#     per_page = int(request.GET.get("per_page", 12))

#     items = Item.objects.filter(is_active=True).select_related("seller_id")

#     # Filter by search query (search in title)
#     if query:
#         items = items.filter(title__icontains=query)

#     # Filter by tags/category
#     if tags:
#         tag_list = [tag.strip() for tag in tags.split(",") if tag.strip()]
#         if tag_list:
#             # Find category UUIDs that match the tag names
#             category_ids = list(
#                 Category.objects.filter(name__in=tag_list).values_list(
#                     "category_id", flat=True
#                 )
#             )

#             tag_query = Q()
#             for tag in tag_list:
#                 # Search in text tags
#                 tag_query |= Q(tags__icontains=tag)

#             # Also search for matching category or subcategory UUIDs
#             if category_ids:
#                 tag_query |= Q(category_id__in=category_ids) | Q(
#                     subcategory_id__in=category_ids
#                 )

#             items = items.filter(tag_query)

#     # Apply sorting
#     if sort == "newest":
#         items = items.order_by("-created_at")
#     elif sort == "price_asc":
#         items = items.order_by("price")
#     elif sort == "price_desc":
#         items = items.order_by("-price")
#     # 'relevance' is default (no special ordering beyond the query match)

#     # Get total count before pagination
#     total = items.count()

#     # Apply pagination
#     start = (page - 1) * per_page
#     end = start + per_page
#     paginated_items = items[start:end]

#     # Format results
#     results = []
#     for item in paginated_items:
#         results.append(
#             {
#                 "id": str(item.item_id),
#                 "title": item.title,
#                 "price": f"${item.price}",
#                 "user": item.seller_id.full_name or "Anonymous",
#                 "user_id": str(item.seller_id.user_id),
#                 "user_avatar": item.seller_id.avatar_url,
#                 "time": get_relative_time(item.created_at),
#                 "image": item.thumbnail_url if hasattr(item, "thumbnail_url") else None,
#             }
#         )

#     return JsonResponse(
#         {
#             "results": results,
#             "total": total,
#             "page": page,
#             "per_page": per_page,
#         },
#         json_dumps_params={"indent": 2},
#     )

#my implementation;
# def search_view(request):
#     query = request.GET.get("q", "").strip()
#     tags = request.GET.get("tags", "").strip()
#     sort = request.GET.get("sort", "relevance")
#     page = int(request.GET.get("page", 1))
#     per_page = int(request.GET.get("per_page", 12))

#     items = Item.objects.filter(is_active=True).select_related("seller_id")
#     I = Item.objects.filter(is_active=True).values('item_id', 'tags')
#     #populate the disjoint set
#     # Map tag -> list of item_ids
#     tag_map = {}
#     for item_ in I:
#         item_id = item_['item_id']
#         tags = item_['tags'] or []
#         for tag in tags:
#             tag_map.setdefault(tag, []).append(item_id)

#     # Union items that share the same tag
#     for item_ids in tag_map.values():
#         if not item_ids:
#             continue
#         root = item_ids[0]
#         for other in item_ids[1:]:
#             ds.union(root, other)

#     if query:
#         # Step 1: find items whose title matches the query
#         matched_items = list(items.filter(title__icontains=query))
#         matched_ids = [item.item_id for item in matched_items]

#         # Step 2: use DisjointSet to find all related item_ids
#         related_ids = set()
#         root_map = {}
#         for node in ds.parent:
#             root = ds.find(node)
#             root_map.setdefault(root, set()).add(node)

#         # Then collect related_ids
#         related_ids = set()
#         for item_id in matched_ids:
#             root = ds.find(item_id)
#             # Include all items with the same root in DS
#             related_ids.update(root_map.get(root, {item_id}))
            

#         # Step 3: filter the main queryset to include only matched + related items
#         items = items.filter(item_id__in=related_ids)

#     # Filter by tags/category if provided
#     if tags:
#         tag_list = [tag.strip() for tag in tags.split(",") if tag.strip()]
#         if tag_list:
#             category_ids = list(
#                 Category.objects.filter(name__in=tag_list).values_list("category_id", flat=True)
#             )

#             tag_query = Q()
#             for tag in tag_list:
#                 tag_query |= Q(tags__icontains=tag)
#             if category_ids:
#                 tag_query |= Q(category_id__in=category_ids) | Q(subcategory_id__in=category_ids)

#             items = items.filter(tag_query)

#     # Apply sorting
#     if sort == "newest":
#         items = items.order_by("-created_at")
#     elif sort == "price_asc":
#         items = items.order_by("price")
#     elif sort == "price_desc":
#         items = items.order_by("-price")

#     total = items.count()

#     # Pagination
#     start = (page - 1) * per_page
#     end = start + per_page
#     paginated_items = items[start:end]

#     results = []
#     for item in paginated_items:
#         results.append(
#             {
#                 "id": str(item.item_id),
#                 "title": item.title,
#                 "price": f"${item.price}",
#                 "user": item.seller_id.full_name or "Anonymous",
#                 "user_id": str(item.seller_id.user_id),
#                 "user_avatar": item.seller_id.avatar_url,
#                 "time": get_relative_time(item.created_at),
#                 "image": item.thumbnail_url if hasattr(item, "thumbnail_url") else None,
#             }
#         )

#     return JsonResponse(
#         {
#             "results": results,
#             "total": total,
#             "page": page,
#             "per_page": per_page,
#         },
#         json_dumps_params={"indent": 2},
#     )

def search_view(request):
    # -----------------------------
    # 1️⃣ Extract query params
    # -----------------------------
    query = request.GET.get("q", "").strip()
    tags_param = request.GET.get("tags", [])
    sort = request.GET.get("sort", "relevance")
    page = int(request.GET.get("page", 1))
    per_page = int(request.GET.get("per_page", 12))

    # -----------------------------
    # 2️⃣ Base queryset
    # -----------------------------
    items_qs = Item.objects.filter(is_active=True).select_related("seller_id")

    # -----------------------------
    # 3️⃣ Filter items by query using pre-populated DSU
    # -----------------------------
    if query:
        matched_items = list(items_qs.filter(title__icontains=query))
        matched_ids = [item.item_id for item in matched_items]

        related_ids = set()
        for item_id in matched_ids:
            try:
                root = ds.find(item_id)
                # Add all members of this root
                group_members = [node for node in ds.parent if ds.find(node) == root]
                related_ids.update(group_members)
            except KeyError:
                # Item not in DSU (no tags), include individually
                related_ids.add(item_id)

        # Filter main queryset
        items_qs = items_qs.filter(item_id__in=related_ids)

    # -----------------------------
    # 4️⃣ Optional: filter by tags_param
    # -----------------------------
    if tags_param:
        if isinstance(tags_param, str):
            tag_list = [t.strip() for t in tags_param.split(",") if t.strip()]
        elif isinstance(tags_param, list):
            tag_list = [t.strip() for t in tags_param if t.strip()]
        else:
            tag_list = []

        if tag_list:
            tag_query = Q()
            for tag in tag_list:
                tag_query |= Q(tags__icontains=tag)
            items_qs = items_qs.filter(tag_query)

    # -----------------------------
    # 5️⃣ Sorting
    # -----------------------------
    if sort == "newest":
        items_qs = items_qs.order_by("-created_at")
    elif sort == "price_asc":
        items_qs = items_qs.order_by("price")
    elif sort == "price_desc":
        items_qs = items_qs.order_by("-price")

    # -----------------------------
    # 6️⃣ Pagination
    # -----------------------------
    total = items_qs.count()
    start = (page - 1) * per_page
    end = start + per_page
    paginated_items = items_qs[start:end]

    # -----------------------------
    # 7️⃣ Format results
    # -----------------------------
    results = []
    for item in paginated_items:
        results.append(
            {
                "id": str(item.item_id),
                "title": item.title,
                "price": f"${item.price}",
                "user": item.seller_id.full_name or "Anonymous",
                "user_id": str(item.seller_id.user_id),
                "user_avatar": item.seller_id.avatar_url,
                "time": get_relative_time(item.created_at),
                "image": getattr(item, "thumbnail_url", None),
            }
        )

    return JsonResponse(
        {
            "results": results,
            "total": total,
            "page": page,
            "per_page": per_page,
        },
        json_dumps_params={"indent": 2},
    )


@csrf_exempt
@require_http_methods(["POST"])
def create_listing_view(request):
    """
    Handle creating a new listing with image uploads.
    POST /api/listings/create/
    Accepts: multipart/form-data
    """
    try:
        # Get form data (text fields)
        seller_id = request.POST.get("seller_id")
        if not seller_id:
            return JsonResponse({"error": "seller_id is required"}, status=400)

        try:
            seller_profile = Profile.objects.get(user_id=seller_id)
        except Profile.DoesNotExist:
            return JsonResponse({"error": "Seller profile not found"}, status=404)

        # Basic validation for required fields
        required_fields = [
            "title",
            "description",
            "price",
            "quantity_available",
            "category_id",
        ]
        for field in required_fields:
            if not request.POST.get(field):
                return JsonResponse({"error": f"{field} is required"}, status=400)

        # Handle image uploads
        uploaded_image_urls = []
        thumbnail_url = None

        # Get all uploaded files (images)
        images = request.FILES.getlist("images")

        if not images:
            return JsonResponse({"error": "At least one image is required"}, status=400)

        # Upload each image to Supabase
        for idx, image_file in enumerate(images):
            try:
                public_url = upload_image_to_supabase(image_file, folder="listings")
                uploaded_image_urls.append(public_url)

                # First image becomes the thumbnail
                if idx == 0:
                    thumbnail_url = public_url

            except Exception as e:
                return JsonResponse(
                    {"error": f"Failed to upload image {idx + 1}: {str(e)}"}, status=500
                )

        # Parse tags
        tags = request.POST.get("tags", "")
        if tags:
            try:
                tags = (
                    json.loads(tags)
                    if tags.startswith("[")
                    else [tag.strip() for tag in tags.split(",")]
                )
            except json.JSONDecodeError:
                # If it's just a plain string, make it a list
                tags = [tags] if tags else []

        # Ensure it's a list
        if not isinstance(tags, list):
            tags = []

        # Create a new Item instance
        new_item = Item(
            seller_id=seller_profile,
            title=request.POST.get("title"),
            description=request.POST.get("description"),
            price=request.POST.get("price"),
            quantity_available=request.POST.get("quantity_available"),
            category_id=uuid.UUID(request.POST.get("category_id")),
            thumbnail_url=thumbnail_url,
            # Optional fields
            subcategory_id=(
                uuid.UUID(request.POST.get("subcategory_id"))
                if request.POST.get("subcategory_id")
                else None
            ),
            is_digital=request.POST.get("is_digital", "false").lower() == "true",
            condition=(
                request.POST.get("condition", "").lower()
                if request.POST.get("condition")
                else None
            ),
            tags=tags,
            processing_time=request.POST.get("processing_time"),
            customizable=request.POST.get("customizable", "false").lower() == "true",
            video_url=request.POST.get("video_url"),
            delivery_available=request.POST.get("delivery_available", "false").lower()
            == "true",
            delivery_radius=request.POST.get("delivery_radius") or None,
            delivery_fee=request.POST.get("delivery_fee") or None,
            shipping_available=request.POST.get("shipping_available", "false").lower()
            == "true",
            status=request.POST.get("status", "active"),
            created_at=timezone.now(),
            updated_at=timezone.now(),
            published_at=(
                timezone.now()
                if request.POST.get("status", "active") == "active"
                else None
            ),
        )
        new_item.save()

        return JsonResponse(
            {
                "message": "Listing created successfully",
                "item_id": str(new_item.item_id),
                "thumbnail_url": thumbnail_url,
                "image_urls": uploaded_image_urls,
            },
            status=201,
        )

    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)


def profile_listings_view(request, seller_id):
    """
    GET /api/profile/<seller_id>/listings/
    Fetch all active items for a specific seller.
    """
    try:
        # Filter items by the seller's UUID
        items = (
            Item.objects.filter(seller_id=seller_id, is_active=True)
            .select_related("seller_id")
            .order_by("-created_at")
        )

        results = []
        for item in items:
            results.append(
                {
                    "id": str(item.item_id),
                    "title": item.title,
                    "price": f"${item.price}",
                    "user": item.seller_id.full_name or "Anonymous",
                    "user_id": str(item.seller_id.user_id),
                    "time": "1hr ago",  # TODO: calculate from created_at
                    "image": item.thumbnail_url,
                }
            )

        return JsonResponse({"results": results})
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)

##implementing the second DB;
def all_items_view(request):
    try:
        items = Item.objects.filter(is_active=True).select_related("seller_id")
        item_list = []
        for item in items:
            seller_data = {}
            if item.seller_id:
                seller_data = {
                    "seller_id": str(item.seller_id.user_id),
                    "seller_name": item.seller_id.full_name,
                    "seller_rating": float(item.seller_id.rating_average),
                    "seller_sales": item.seller_id.items_sold,
                }

            item_list.append({
                "item_id": str(item.item_id),
                "title": item.title,
                "price": float(item.price),
                "total_sales": item.total_sales,
                "rating_average": float(item.rating_average),
                "thumbnail_url": item.thumbnail_url,
                **seller_data,
            })
        return JsonResponse({"items": item_list})
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)
    

def top_products(request):
    

    #fetch products from DB
    products = list(Item.objects.filter(is_active=True).values(
        'item_id', 'title', 'total_sales', 'rating_average', 'thumbnail_url'
    ))

    # Compute priority score
    for p in products:
        p['priority'] = p['total_sales'] + int(p['rating_average'] * 20)
        pq.enqueue(p)

    # Return top 10 products
    top_items = [pq.dequeue() for _ in range(min(10, pq.size()))]

    return JsonResponse({"top_items": top_items})


@csrf_exempt
def populate(request):
    # Optional: restrict method for safety
    if request.method != "POST":
        return JsonResponse({"error": "POST method required"}, status=405)

    try:
        # Step 1: group items by tags
        # Step 1: fetch all items
        products = Item.objects.all()

        # Step 2: make each item a set
        for item in products:
            ds.make_set(item.item_id)

        # Step 3: build tag map
        tag_map = defaultdict(list)
        for item in products:
            tags = item.tags or []
            for tag in tags:
                tag_map[tag].append(item.item_id)

        # Step 4: union items that share tags
        for item_ids in tag_map.values():
            if len(item_ids) <= 1:
                continue
            first_item = item_ids[0]
            for other_item in item_ids[1:]:
                ds.union(first_item, other_item)
        
        return JsonResponse({"status": "success"})
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)
