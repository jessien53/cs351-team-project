import React from "react";
import type { ListingFormData, ListingStatus } from "../../types/create.ts";
import ListingDetails from "./listingDetails.tsx";
import PricingInventory from "./pricingInventory.tsx";
import ShippingDelivery from "./shippingDelivery.tsx";
import AdditionalOptions from "./additionalOptions.tsx";
import FormActions from "./formActions.tsx";

interface Props {
  formData: ListingFormData;
  onFormChange: (field: keyof ListingFormData, value: string | boolean) => void;
  onTagsChange: (tags: string[]) => void;
  onSubmit: (status: ListingStatus) => void;
  categories: string[];
  conditions: string[];
}

const ListingForm: React.FC<Props> = ({
  formData,
  onFormChange,
  onTagsChange,
  onSubmit,
  categories,
  conditions,
}) => {
  return (
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

          {!formData.isDigital && (
            <ShippingDelivery formData={formData} onFormChange={onFormChange} />
          )}

          <AdditionalOptions
            customizable={formData.customizable}
            tags={formData.tags}
            onFormChange={onFormChange}
            onTagsChange={onTagsChange}
          />

          <FormActions onSubmit={onSubmit} />
        </div>
      </div>
    </div>
  );
};

export default ListingForm;
