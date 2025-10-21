# from django.shortcuts import render
from django.http import JsonResponse
from .trie_loader import autocomplete_trie # Import our shared Trie instance

def autocomplete_view(request):
    # Get the 'q' parameter from the URL (e.g., /api/autocomplete/?q=comp)
    query = request.GET.get('q', '')

    if query:
        suggestions = autocomplete_trie.get_suggestions(query)
        # Optional: limit the number of suggestions
        suggestions = suggestions[:10] 
    else:
        suggestions = []

    return JsonResponse({'suggestions': suggestions})