import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ListingForm from "../components/create/listingForm";
import Header from "../components/layout/Header.tsx";
import { useAuth } from "../context/AuthContext"; // Import useAuth
import { createItem } from "../services/item";
import type {
  ImageObject,
  ListingFormData,
  ListingStatus,
} from "../types/create.ts";
import Delivery from "../components/listing/delivery.tsx";
import { addListing } from "../services/addListing.ts";

// Helper function to create ImageObject from asset path
const createImageFromAsset = async (
  assetPath: string
): Promise<ImageObject> => {
  const response = await fetch(assetPath);
  const blob = await response.blob();
  const file = new File([blob], assetPath.split("/").pop() || "image.png", {
    type: blob.type,
  });

  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      resolve({
        id: Date.now() + Math.random(),
        url: URL.createObjectURL(file),
        file,
        dataURL: reader.result as string,
      });
    };
    reader.readAsDataURL(file);
  });
};

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

const Create = () => {
  const { currentUser } = useAuth(); // Get user from auth context
  const navigate = useNavigate();
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

  // Example listing data
  const exampleListing: ListingFormData = {
    title: "Christmas Tree Topper 3D Printed",
    price: "20.20",
    description:
      "Materials: PLA\n\nSustainable features: upcycled. It is a beautiful 3D printed Christmas tree topper made from sustainable materials.\n\nDimensions:\nWidth: 120 millimeters\nHeight: 180 millimeters\nDepth: 140 millimeters",
    category: "Misc",
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

  const exampleListing2: ListingFormData = {
    title: "Felt Pie Cat Toy - New Style | Exclusively on Etsy",
    price: "12.99",
    description:
      "Materials: Felt, Catnip, Polyester filling\n\nThis adorable felt pie cat toy is handcrafted with love! Made from premium quality felt and filled with organic catnip, it's perfect for keeping your feline friend entertained for hours.\n\nFeatures:\n- Handmade felt construction\n- Organic catnip filling\n- Realistic pie design with lattice top\n- Safe and durable for cats of all sizes\n- Machine washable\n\nDimensions:\nDiameter: 4 inches\nHeight: 1.5 inches",
    category: "Misc",
    subcategory: "Pet Toys",
    condition: "New",
    quantity: "15",
    isDigital: false,
    tags: ["cat-toy", "handmade", "felt", "catnip", "pet-supplies"],
    processingTime: "1-2 business days",
    customizable: false,
    deliveryAvailable: true,
    deliveryRadius: "5",
    deliveryFee: "3",
    shippingAvailable: true,
    status: "draft",
    images: [],
    video_url: "",
  };

  const exampleListing3: ListingFormData = {
    title: "Embroidered Christmas Stocking, Knitted Family Stocking",
    price: "34.50",
    description:
      "Materials: Acrylic yarn, Cotton thread\n\nCreate a cherished family tradition with this beautiful hand-knitted Christmas stocking featuring custom embroidery. Each stocking is lovingly crafted and can be personalized with a name of your choice.\n\nFeatures:\n- Hand-knitted with premium acrylic yarn\n- Custom name embroidery included\n- Classic cable knit pattern\n- Reinforced hanging loop\n- Available in multiple colors\n- Lined interior for durability\n\nDimensions:\nLength: 18 inches\nWidth: 8 inches\n\nPlease provide the name for embroidery (up to 10 characters) in the personalization section at checkout.",
    category: "Misc",
    subcategory: "Holiday Decor",
    condition: "New",
    quantity: "8",
    isDigital: false,
    tags: ["christmas", "stocking", "personalized", "knitted", "holiday-decor"],
    processingTime: "5-7 business days",
    customizable: true,
    deliveryAvailable: false,
    deliveryRadius: "",
    deliveryFee: "",
    shippingAvailable: true,
    status: "draft",
    images: [],
    video_url: "",
  };

  const exampleListing4: ListingFormData = {
    title: "Custom Dark Brown Genuine Leather Watch Case",
    price: "89.99",
    description:
      "Materials: Genuine leather, Velvet lining, Metal hardware\n\nProtect and display your watch collection with this elegant handcrafted leather watch case. Made from premium full-grain leather with a soft velvet interior, this case combines functionality with timeless style.\n\nFeatures:\n- Premium dark brown genuine leather exterior\n- Soft velvet lining to protect watch faces\n- Holds 6 watches securely\n- Individual watch pillows included\n- Lockable clasp with key\n- Custom engraving available on top lid\n\nDimensions:\nLength: 10 inches\nWidth: 7 inches\nHeight: 3.5 inches\n\nEach case is handcrafted to order and can be personalized with initials or a short message.",
    category: "Misc",
    subcategory: "Storage & Organization",
    condition: "New",
    quantity: "3",
    isDigital: false,
    tags: ["leather", "watch-case", "handmade", "luxury", "personalized"],
    processingTime: "7-10 business days",
    customizable: true,
    deliveryAvailable: true,
    deliveryRadius: "15",
    deliveryFee: "8",
    shippingAvailable: true,
    status: "draft",
    images: [],
    video_url: "",
  };

  const exampleListing5: ListingFormData = {
    title: "Peridot Leaf Climber Labret: 18G/16G Helix Earring Stud",
    price: "45.00",
    description:
      "Materials: 14k Gold, Peridot gemstone\n\nElevate your ear styling with this delicate peridot leaf climber earring. Featuring a genuine peridot stone set in 14k gold, this versatile piece can be worn as a helix earring, cartilage stud, or traditional ear climber.\n\nFeatures:\n- Genuine peridot gemstone (3mm)\n- 14k solid gold (not plated)\n- Available in 18G or 16G gauge\n- Threadless push-pin backing\n- Hypoallergenic and nickel-free\n- Delicate leaf design\n- Sold individually\n\nSpecifications:\n- Gauge: 18G (1.0mm) or 16G (1.2mm)\n- Post length: 6mm or 8mm (please specify)\n- Gemstone: Natural peridot\n\nPerfect for helix, cartilage, tragus, or traditional lobe piercings. Please select your preferred gauge and post length at checkout.",
    category: "Clothing",
    subcategory: "Jewelry",
    condition: "New",
    quantity: "12",
    isDigital: false,
    tags: ["earring", "gold", "peridot", "helix", "piercing", "jewelry"],
    processingTime: "2-3 business days",
    customizable: false,
    deliveryAvailable: false,
    deliveryRadius: "",
    deliveryFee: "",
    shippingAvailable: true,
    status: "draft",
    images: [],
    video_url: "",
  };

  // Expose fillExample functions to browser console
  useEffect(() => {
    (window as any).fillExample = () => {
      setFormData(exampleListing);
      console.log("✅ Form filled with example 1 data!");
    };
    (window as any).fillExample2 = async () => {
      const catToyImage = await createImageFromAsset("/src/assets/cat_toy.png");
      setFormData({ ...exampleListing2, images: [catToyImage] });
      console.log("✅ Form filled with example 2 data!");
    };
    (window as any).fillExample3 = async () => {
      const kidsBookImage = await createImageFromAsset(
        "/src/assets/kids_book.png"
      );
      setFormData({ ...exampleListing3, images: [kidsBookImage] });
      console.log("✅ Form filled with example 3 data!");
    };
    (window as any).fillExample4 = async () => {
      const watchCaseImage = await createImageFromAsset(
        "/src/assets/watch case.png"
      );
      setFormData({ ...exampleListing4, images: [watchCaseImage] });
      console.log("✅ Form filled with example 4 data!");
    };
    (window as any).fillExample5 = async () => {
      const labretImage = await createImageFromAsset("/src/assets/labret.png");
      setFormData({ ...exampleListing5, images: [labretImage] });
      console.log("✅ Form filled with example 5 data!");
    };

    return () => {
      delete (window as any).fillExample;
      delete (window as any).fillExample2;
      delete (window as any).fillExample3;
      delete (window as any).fillExample4;
      delete (window as any).fillExample5;
    };
  }, []);

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
    };

    // Remove frontend-only fields before sending
    const { category, subcategory, quantity, images, ...payload } = finalData;

    // Extract actual File objects from ImageObject array
    const imageFiles =
      images
        ?.map((img) => img.file)
        .filter((file): file is File => file !== undefined) || [];

    console.log("Submitting Listing:", payload);
    console.log("Uploading images:", imageFiles.length);

    try {
      const result = await createItem(payload, imageFiles);
      console.log("Listing created successfully:", result);
      // Navigate to the newly created listing page
      if (result && result.item_id) {
        navigate(`/listing/${result.item_id}`);
      }
    } catch (error) {
      console.error("Error creating listing:", error);
      // TODO: Show an error message to the user
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <Header />
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
