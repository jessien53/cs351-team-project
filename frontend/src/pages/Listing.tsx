import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Header from "../components/layout/Header";
import ProductHeader from "../components/listing/productHeader";
import ImageGallery from "../components/listing/imageGallery";
import Shipping from "../components/listing/shipping";
import Delivery from "../components/listing/delivery";
import Customizable from "../components/listing/customizable";
import Purchase from "../components/listing/purchase";
import SellerCard from "../components/listing/sellerCard";
import ListingDescription from "../components/listing/listingDescription";
import type { Item } from "../types/listing";
import { getListingById } from "../services/listing";

const Listing: React.FC = () => {
  const { itemId } = useParams<{ itemId: string }>();
  const [item, setItem] = useState<Item | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!itemId) {
      setError("No item ID provided.");
      setLoading(false);
      return;
    }

    const fetchListing = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getListingById(itemId);
        setItem(data);
      } catch (err: any) {
        setError(err.message || "Failed to fetch listing.");
      } finally {
        setLoading(false);
      }
    };

    fetchListing();
  }, [itemId]);

  if (loading) {
    return (
      <div className="flex flex-col bg-white min-h-screen">
        <Header />
        <div className="text-center p-12">Loading listing...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col bg-white min-h-screen">
        <Header />
        <div className="text-center p-12 text-accent">{error}</div>
      </div>
    );
  }

  if (!item) {
    return (
      <div className="flex flex-col bg-white min-h-screen">
        <Header />
        <div className="text-center p-12">Listing not found.</div>
      </div>
    );
  }

  const listingPageData = {
    title: item.title,
    price: item.price,
    seller_id: item.seller_name || item.seller_id,
    rating: item.rating_average,
    ratingCount: item.rating_count,
    condition: item.condition || "N/A",
    description: item.description,
    category: item.category_name,
    tags: item.tags,
    quantityAvailable: item.quantity_available,
    totalSales: item.total_sales,
    viewsCount: item.views_count,
    favoritesCount: item.favorites_count,
    processingTime: item.processing_time || "N/A",
    customizable: item.customizable,
    shippingAvailable: item.shipping_available,
    deliveryAvailable: item.delivery_available,
    deliveryFee: item.delivery_fee || 0,
    images: [
      item.thumbnail_url,
    ].filter(Boolean) as string[], // Filter out null/undefined
  };

  return (
    <div className="flex flex-col bg-white min-h-screen">
      <Header />
      <div className="flex flex-col lg:flex-row">
        {/* Left Side - Image Gallery */}
        <ImageGallery images={listingPageData.images} />

        {/* Right Side - Product Details */}
        <div className="lg:w-1/2 bg-white overflow-y-auto">
          <div className="max-w-2xl mx-auto p-8 lg:p-12 space-y-8">
            <ProductHeader itemData={listingPageData} />

            <div className="border-y py-6 space-y-4">
              {listingPageData.shippingAvailable && (
                <Shipping processingTime={listingPageData.processingTime} />
              )}

              {listingPageData.deliveryAvailable && (
                <Delivery deliveryFee={listingPageData.deliveryFee} />
              )}

              {listingPageData.customizable && <Customizable />}
            </div>

            <Purchase itemData={listingPageData} />

            <SellerCard
              seller_id={item.seller_name || "Anonymous"} // Display Name
              user_id={item.seller_id} // Pass the actual UUID here
              avatar_url={item.seller_avatar_url}
              major={item.seller_major || "N/A"}
              rating={item.seller_rating}
              totalSales={item.total_sales}
            />

            <ListingDescription itemData={listingPageData} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Listing;