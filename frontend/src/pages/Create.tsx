import React, { useState } from "react";
import ImageUploader from "../components/create/ImageUploader";
import ListingForm from "../components/create/listingForm";
import type {
  ImageObject,
  ListingFormData,
  ListingStatus,
} from "../types/create.ts";
import Delivery from "../components/listing/delivery.tsx";
import { addListing } from "../services/addListing.ts";

// Static data can live here or be imported from a constants file
const categories = [
  "Electronics",
  "Fashion",
  "Home & Living",
  "Art & Collectibles",
  "Jewelry",
  "Bags & Accessories",
  "Toys & Games",
  "Books & Media",
];
const conditions = ["New", "Like New", "Good", "Fair", "Poor"];

const Create = () => {
  const [formData, setFormData] = useState<ListingFormData>({
    title: "",
    price: "",
    description: "",
    category: "",
    subcategory: "",
    condition: "",
    quantity: "1",
    isDigital: false,
    tags: [] as string[],
    processingTime: "",
    customizable: false,
    deliveryAvailable: false,
    deliveryRadius: "",
    deliveryFee: "",
    shippingAvailable: false,
    status: "draft",
  });

  const [images, setImages] = useState<ImageObject[]>([]);

  // Generic handler for most form inputs
  const handleInputChange = (
    field: keyof ListingFormData,
    value: string | boolean
  ) => {
    setFormData((prev: ListingFormData) => ({ ...prev, [field]: value }));
  };

  // Specific handler for updating tags
  const handleTagsChange = (newTags: string[]) => {
    setFormData((prev: ListingFormData) => ({ ...prev, tags: newTags }));
  };

  // Handler for the final submission
  const handleSubmit = async (status: ListingStatus) => {
    
    // TODO: Add your submission logic here (e.g., API call)
    try {
      const finalData = { ...formData, status };
      const res = await addListing(finalData);
      console.log("Submitting Listing:", res);
      console.log("With Images:", images);
    }
    catch(err:any){
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-white">
      {/* Left Side */}
      <ImageUploader images={images} setImages={setImages} />

      {/* Right Side */}
      <ListingForm
        formData={formData}
        onFormChange={handleInputChange}
        onTagsChange={handleTagsChange}
        onSubmit={handleSubmit}
        categories={categories}
        conditions={conditions}
      />
    </div>
  );
};

export default Create;
