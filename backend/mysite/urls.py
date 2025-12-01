"""
URL configuration for mysite project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""

from django.contrib import admin
from django.urls import path
from myapp.views import (
    autocomplete_view,
    search_view,
    profile_view,
    listing_view,
    profile_listings_view,
    create_listing_view,
    top_products,
    populate
)

urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/autocomplete/", autocomplete_view, name="autocomplete"),
    path("api/search/", search_view, name="search"),
    path("api/profile/<uuid:id>/", profile_view, name="profile"),
    path("api/item/<uuid:item_id>/", listing_view, name="listing"),
    path(
        "api/profile/<uuid:seller_id>/listings/",
        profile_listings_view,
        name="profile_listings",
    ),
    path("api/listings/create/", create_listing_view, name="create_listing"),
    path('api/top-products/', top_products, name='top-products'),
    path("api/populate-disjoint-set/", populate, name="populate_disjoint_set"),
]
