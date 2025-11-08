import React from "react";
import Header from "../components/layout/Header";
import ProductHeader from "../components/listing/productHeader";
import ImageGallery from "../components/listing/imageGallery";
import Shipping from "../components/listing/shipping";
import Delivery from "../components/listing/delivery";
import Customizable from "../components/listing/customizable";
import Purchase from "../components/listing/purchase";
import SellerCard from "../components/listing/sellerCard";
import ListingDescription from "../components/listing/listingDescription";

const Listing: React.FC = () => {
  const itemData = {
    title: "Custom Double-Sided Engraved Pet ID Tag",
    price: 10.27,
    seller_id: "AmyEngravedGifts",
    rating: 4.8,
    ratingCount: 127,
    condition: "New",
    description: `Welcome to the world where your pet's identity shines as brightly as their personality! Our Free Engraved Dog Tag isn't just a tag; it's a statement of love, a whisper of care, and a promise of safety for your beloved pet. Handcrafted with precision and passion, this custom metal collar tag is a beautiful blend of functionality and aesthetic charm, perfect for both dogs and cats.
    
    Add your pet's name, your contact details, or a special message on both sides in crisp, clear lettering. Keeping it clean is a breeze—simply polish with a soft cloth to maintain its shine.
    
    It's the thoughtful choice for pet owners who cherish quality and want to keep their pets identified in style. Gift your pet this badge of love and enjoy the peace of mind that comes with it.`,

    category: "Pet Supplies",
    subcategory: "Pet ID Tags",
    tags: ["dogs", "cats", "pets", "personalized", "engraved", "jewelry"],
    quantityAvailable: 5,
    totalSales: 342,
    viewsCount: 1849,
    favoritesCount: 156,
    processingTime: "3-5 business days",
    customizable: true,
    shippingAvailable: true,
    deliveryAvailable: true,
    deliveryFee: 5.99,
    images: [
      "https://i.etsystatic.com/32516685/r/il/3e7fe8/5854275880/il_1588xN.5854275880_hic9.jpg",
      "https://i.etsystatic.com/32516685/r/il/c8e78b/5835506020/il_1588xN.5835506020_hkvy.jpg",
      "https://i.etsystatic.com/32516685/r/il/6254be/6176177250/il_1588xN.6176177250_oi1a.jpg",
      "https://i.etsystatic.com/32516685/r/il/a4496a/5835506102/il_1588xN.5835506102_3tt2.jpg",
    ],
  };

  return (
    <div className="flex flex-col bg-white min-h-screen">
      <Header />
      <div className="flex flex-col lg:flex-row">
        {/* Left Side - Image Gallery */}
        <ImageGallery images={itemData.images} />

        {/* Right Side - Product Details */}
        <div className="lg:w-1/2 bg-white overflow-y-auto">
          <div className="max-w-2xl mx-auto p-8 lg:p-12 space-y-8">
            <ProductHeader itemData={itemData} />

            <div className="border-y py-6 space-y-4">
              {itemData.shippingAvailable && (
                <Shipping processingTime={itemData.processingTime} />
              )}

              {itemData.deliveryAvailable && (
                <Delivery deliveryFee={itemData.deliveryFee} />
              )}

              {itemData.customizable && <Customizable />}
            </div>

            <Purchase itemData={itemData} />

            {/* Todo Grab actual seller data*/}
            <SellerCard
              seller_id={itemData.seller_id}
              totalSales={100}
              major={"Music"}
              rating={4.8}
            />

            <ListingDescription itemData={itemData} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Listing;
