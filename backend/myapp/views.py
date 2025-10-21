# from django.shortcuts import render
from django.http import JsonResponse
from django.db.models import Q
from .trie_loader import autocomplete_trie
from .models import Item


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

    # Start with all active items
    items = Item.objects.filter(is_active=True)

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
                "user": "Anonymous",  # You'll want to add seller info from your user model
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
