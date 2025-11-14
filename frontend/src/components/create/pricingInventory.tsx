import React from "react";
import type { ListingFormData } from "../../types/create.ts";

interface Props {
  formData: ListingFormData;
  onFormChange: (field: keyof ListingFormData, value: string | boolean) => void;
}

const PricingInventory: React.FC<Props> = ({ formData, onFormChange }) => {
  return (
    <div className="border-t pt-8">
      <h3 className="text-xl font-bold mb-6">Pricing & Inventory</h3>
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Price <span className="text-primary">*</span>
          </label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 font-semibold">
              $
            </span>
            <input
              type="number"
              step="0.01"
              value={formData.price}
              onChange={(e) => onFormChange("price", e.target.value)}
              placeholder="0.00"
              className="w-full pl-8 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition"
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Quantity Available
          </label>
          <input
            type="number"
            min="1"
            value={formData.quantity}
            onChange={(e) => onFormChange("quantity", e.target.value)}
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition"
          />
        </div>
      </div>

      <div className="bg-gray-50 rounded-xl p-4">
        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={formData.isDigital}
            onChange={(e) => onFormChange("isDigital", e.target.checked)}
            className="w-5 h-5 rounded border-2 border-gray-300 text-blue-600 focus:ring-2 focus:ring-blue-500"
          />
          <div>
            <div className="font-semibold text-gray-900">Digital Product</div>
            <div className="text-sm text-gray-600">
              This is a downloadable item
            </div>
          </div>
        </label>
      </div>
    </div>
  );
};

export default PricingInventory;
