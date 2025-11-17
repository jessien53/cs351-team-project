import React from "react";
import ListingDetails from "./listingDetails";
import PricingInventory from "./pricingInventory";
import ShippingDelivery from "./shippingDelivery";
import AdditionalOptions from "./additionalOptions";
import ImageUploader from "./ImageUploader";
import FormActions from "./formActions";
import type {
  ListingFormData,
  ListingStatus,
  ImageObject,
} from "../../types/create";

interface Props {
  formData: ListingFormData;
  onFormChange: (
    field: keyof ListingFormData,
    value: string | boolean | number | ImageObject[]
  ) => void;
  onTagsChange: (tags: string[]) => void;
  onSubmit: (status: ListingStatus) => void;
  isSubmitting?: boolean;
  categories?: string[];
  conditions?: string[];
}

const ListingForm: React.FC<Props> = ({
  formData,
  onFormChange,
  onTagsChange,
  onSubmit,
  isSubmitting = false,
  categories = [],
  conditions = [],
}) => {
  const setImages = (value: React.SetStateAction<ImageObject[]>) => {
    if (typeof value === "function") {
      onFormChange("images", value(formData.images || []));
    } else {
      onFormChange("images", value);
    }
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-background">
      <ImageUploader
        images={formData.images || []}
        setImages={setImages}
        videoUrl={formData.video_url || ""}
        onVideoUrlChange={(url: string) => onFormChange("video_url", url)}
      />

      <div className="lg:w-1/2 overflow-y-auto">
        <div className="max-w-2xl mx-auto p-8 lg:p-12">
          <div className="space-y-8">
            <ListingDetails
              formData={formData}
              onFormChange={onFormChange}
              categories={categories}
              conditions={conditions}
            />
            <PricingInventory formData={formData} onFormChange={onFormChange} />
            <ShippingDelivery formData={formData} onFormChange={onFormChange} />
            <AdditionalOptions
              customizable={formData.customizable}
              onFormChange={onFormChange}
              tags={formData.tags}
              onTagsChange={onTagsChange}
            />
          </div>

          <div className="mt-12">
            <FormActions onSubmit={onSubmit} isSubmitting={isSubmitting} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ListingForm;
