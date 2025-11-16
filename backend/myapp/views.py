# from django.shortcuts import render
from django.http import JsonResponse, Http404
from django.db.models import Q
from .trie_loader import autocomplete_trie
from .models import Item, Profile, Category


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
            "rating_average": float(profile.rating_average), # Convert Decimal
            "rating_count": profile.rating_count,
            "services": profile.services or [], # Handle null
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
            "price": float(item.price), # Convert Decimal to float
            "quantity_available": item.quantity_available,
            "is_digital": item.is_digital,
            "condition": item.condition,
            "tags": item.tags or [],
            "processing_time": item.processing_time,
            "customizable": item.customizable,
            "thumbnail_url": item.thumbnail_url,
            "video_url": item.video_url,
            "delivery_available": item.delivery_available,
            "delivery_fee": float(item.delivery_fee) if item.delivery_fee is not None else None,
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

def search_view(request):
    """
    Handle product search with filtering and sorting.
    GET /api/search/?q=<query>&tags=<tag1,tag2>&sort=<sort_option>&page=<page>&per_page=<per_page>
    Returns: {"results": [...], "total": int, "page": int, "per_page": int}
    """
    query = request.GET.get("q", "").strip()
    tags = request.GET.get("tags", "").strip()
    sort = request.GET.get("sort", "relevance")
    page = int(request.GET.get("page", 1))
    per_page = int(request.GET.get("per_page", 12))

    items = Item.objects.filter(is_active=True).select_related("seller_id")

    # Filter by search query (search in title)
    if query:
        items = items.filter(title__icontains=query)

    # Filter by tags/category
    if tags:
        tag_list = [tag.strip() for tag in tags.split(",") if tag.strip()]
        if tag_list:
            # Find category UUIDs that match the tag names
            category_ids = list(
                Category.objects.filter(name__in=tag_list).values_list(
                    "category_id", flat=True
                )
            )

            tag_query = Q()
            for tag in tag_list:
                # Search in text tags
                tag_query |= Q(tags__icontains=tag)

            # Also search for matching category or subcategory UUIDs
            if category_ids:
                tag_query |= Q(category_id__in=category_ids) | Q(
                    subcategory_id__in=category_ids
                )

            items = items.filter(tag_query)

    # Apply sorting
    if sort == "newest":
        items = items.order_by("-created_at")
    elif sort == "price_asc":
        items = items.order_by("price")
    elif sort == "price_desc":
        items = items.order_by("-price")
    # 'relevance' is default (no special ordering beyond the query match)

    # Get total count before pagination
    total = items.count()

    # Apply pagination
    start = (page - 1) * per_page
    end = start + per_page
    paginated_items = items[start:end]

    # Format results
    results = []
    for item in paginated_items:
        results.append(
            {
                "id": str(item.item_id),
                "title": item.title,
                "price": f"${item.price}",
                "user": item.seller_id.full_name or "Anonymous",
                "user_id": str(item.seller_id.user_id),
                "time": "1hr ago",  # You'll want to calculate this from created_at
                "image": item.thumbnail_url if hasattr(item, "thumbnail_url") else None,
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

def profile_listings_view(request, seller_id):
    """
    GET /api/profile/<seller_id>/listings/
    Fetch all active items for a specific seller.
    """
    try:
        # Filter items by the seller's UUID
        items = Item.objects.filter(seller_id=seller_id, is_active=True).select_related("seller_id").order_by("-created_at")
        
        results = []
        for item in items:
            results.append({
                "id": str(item.item_id),
                "title": item.title,
                "price": f"${item.price}",
                "user": item.seller_id.full_name or "Anonymous",
                "user_id": str(item.seller_id.user_id),
                "time": "1hr ago", # TODO: calculate from created_at
                "image": item.thumbnail_url,
            })
            
        return JsonResponse({"results": results})
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)