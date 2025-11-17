# from django.shortcuts import render
from django.http import JsonResponse, Http404
from django.db.models import Q
from .trie_loader import autocomplete_trie
from .models import Item, Profile
import json
from django.views.decorators.http import require_http_methods
from django.views.decorators.csrf import csrf_exempt
from django.utils import timezone
import uuid
from time import localtime


def autocomplete_view(request):
    # Get the 'q' parameter from the URL (e.g., /api/autocomplete/?q=comp)
    query = request.GET.get("q", "")

    if query:
        suggestions = autocomplete_trie.get_suggestions(query)
        # Optional: limit the number of suggestions
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
            tag_query = Q()
            for tag in tag_list:
                tag_query |= (
                    Q(tags__icontains=tag)
                    | Q(category_id__iexact=tag)
                    | Q(subcategory_id__iexact=tag)
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
                "time": "1 hr ago",
                "thumbnail_url": item.thumbnail_url,
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
    Handle creating a new listing.
    POST /api/listings/create/
    """
    try:
        data = json.loads(request.body)

        # Get seller profile
        seller_id = data.get("seller_id")
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
            "thumbnail_url",
        ]
        for field in required_fields:
            if field not in data:
                return JsonResponse({"error": f"{field} is required"}, status=400)

        # Create a new Item instance
        # Ensure tags are stored as a list of strings
        tags = data.get("tags", [])
        if isinstance(tags, str):
            # If tags are a single string, try to parse it as JSON
            try:
                tags = json.loads(tags)
            except json.JSONDecodeError:
                # If it's just a plain string, make it a list
                tags = [tags] if tags else []
        
        # Ensure it's a list
        if not isinstance(tags, list):
            tags = []

        new_item = Item(
            seller_id=seller_profile,
            title=data["title"],
            description=data["description"],
            price=data["price"],
            quantity_available=data["quantity_available"],
            category_id=uuid.UUID(data["category_id"]),
            thumbnail_url=data["thumbnail_url"],
            # Optional fields
            subcategory_id=(
                uuid.UUID(data["subcategory_id"])
                if data.get("subcategory_id")
                else None
            ),
            is_digital=data.get("is_digital", False),
            condition=(
                data.get("condition", "").lower() if data.get("condition") else None
            ),
            tags=tags,
            processing_time=data.get("processing_time"),
            customizable=data.get("customizable", False),
            video_url=data.get("video_url"),
            delivery_available=data.get("delivery_available", False),
            delivery_radius=data.get("delivery_radius"),
            delivery_fee=data.get("delivery_fee"),
            shipping_available=data.get("shipping_available", False),
            status=data.get("status", "active"),
            created_at=timezone.now(),
            updated_at=timezone.now(),
            published_at=(
                timezone.now() if data.get("status", "active") == "active" else None
            ),
        )
        new_item.save()

        return JsonResponse(
            {
                "message": "Listing created successfully",
                "item_id": str(new_item.item_id),
            },
            status=201,
        )

    except json.JSONDecodeError:
        return JsonResponse({"error": "Invalid JSON"}, status=400)
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)
