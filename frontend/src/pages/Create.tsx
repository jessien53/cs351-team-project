import { useState } from "react";
import ListingForm from "../components/create/listingForm";
import Header from "../components/layout/Header.tsx";
import { useAuth } from "../context/AuthContext"; // Import useAuth
import { createItem } from "../services/item";
import type {
  ImageObject,
  ListingFormData,
  ListingStatus,
} from "../types/create.ts";

// Categories and mapping from Supabase
const categories = [
  "Services",
  "Books",
  "Misc",
  "Electronics",
  "Furniture",
  "Clothing",
];

const categoryIdMapping: { [key: string]: string } = {
  Services: "2b0fdab6-444f-4b3b-93cc-4872acebb900",
  Books: "53588808-4211-401e-9037-8fe4b6c71c2c",
  Misc: "8ecf2146-9798-4990-9b10-8ae702f7ea93",
  Electronics: "aa9a81b0-009f-4990-816b-c9add3e2cbc1",
  Furniture: "b9ec7bed-ea59-478a-a50f-ef53c324df78",
  Clothing: "cd2f6b13-e5da-41c5-96cc-ffd673900156",
};
const conditions = ["New", "Like New", "Good", "Fair", "Poor"];

// Example listing for testing
const exampleListing: ListingFormData = {
  title: "Christmas Tree Topper 3D Printed",
  price: "20.20",
  description:
    "Materials: PLA\n\nSustainable features: upcycled. It is a beautiful 3D printed Christmas tree topper made from sustainable materials.\n\nDimensions:\nWidth: 120 millimeters\nHeight: 180 millimeters\nDepth: 140 millimeters",
  category: "Mis",
  subcategory: "Decorations",
  condition: "New",
  quantity: "5",
  isDigital: false,
  tags: ["3d-printed", "christmas", "sustainable", "home-decor"],
  processingTime: "3-5 business days",
  customizable: true,
  deliveryAvailable: true,
  deliveryRadius: "10",
  deliveryFee: "5",
  shippingAvailable: true,
  status: "draft",
  images: [],
  video_url: "",
};

const Create = () => {
  const { currentUser } = useAuth(); // Get user from auth context
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<ListingFormData>({
    title: "",
    price: "",
    description: "",
    category: "",
    subcategory: "",
    condition: "",
    quantity: "1",
    isDigital: false,
    tags: [],
    processingTime: "",
    customizable: false,
    deliveryAvailable: false,
    deliveryRadius: "",
    deliveryFee: "",
    shippingAvailable: false,
    status: "draft",
    images: [],
    video_url: "",
  });

  // Generic handler for most form inputs
  const handleInputChange = (
    field: keyof ListingFormData,
    value: string | number | boolean | ImageObject[] | undefined
  ) => {
    setFormData((prev: ListingFormData) => ({ ...prev, [field]: value }));
  };

  // Specific handler for updating tags
  const handleTagsChange = (newTags: string[]) => {
    setFormData((prev: ListingFormData) => ({ ...prev, tags: newTags }));
  };

  // Handler for the final submission
  const handleSubmit = async (status: ListingStatus) => {
    if (!currentUser) {
      console.error("You must be logged in to create a listing.");
      // Optionally, show a message to the user
      return;
    }

    setIsSubmitting(true);

    const finalData = {
      ...formData,
      status,
      seller_id: currentUser.id,
      category_id: categoryIdMapping[formData.category] || null, // Map category name to ID
      price: parseFloat(formData.price) || 0,
      quantity_available: parseInt(formData.quantity, 10) || 1,
      condition: formData.condition.toLowerCase().replace(/\s+/g, "_"),
      tags: Array.isArray(formData.tags) ? formData.tags : [],
      // Use placeholder - images will be uploaded separately
      thumbnail_url: "https://via.placeholder.com/150",
    };

    // Remove frontend-only fields before sending
    const { category, subcategory, quantity, images, ...payload } = finalData;

    console.log("Submitting Listing:", payload);

    try {
      const result = await createItem(payload);
      console.log("Listing created successfully:", result);
      // TODO: Redirect to the new listing page or show a success message
    } catch (error) {
      console.error("Error creating listing:", error);
      // TODO: Show an error message to the user
    } finally {
      setIsSubmitting(false);
    }
  };

  // Auto-fill example and submit
  const handleLoadExample = async () => {
    setFormData(exampleListing);
    // Auto-submit after a short delay to ensure state updates
    setTimeout(() => {
      handleSubmit("active");
    }, 100);
  };

  return (
    <div>
      <Header />
      <div className="p-4 mb-4">
        <button
          onClick={handleLoadExample}
          disabled={isSubmitting}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-400"
        >
          {isSubmitting ? "Submitting Example..." : "Load & Submit Example"}
        </button>
      </div>
      <ListingForm
        formData={formData}
        onFormChange={handleInputChange}
        onTagsChange={handleTagsChange}
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
        categories={categories}
        conditions={conditions}
      />
    </div>
  );
};

export default Create;
