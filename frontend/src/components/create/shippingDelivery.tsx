import React from "react";
import type { ListingFormData } from "../../types/create.ts";

interface Props {
  formData: ListingFormData;
  onFormChange: (field: keyof ListingFormData, value: string | boolean) => void;
}

const ShippingDelivery: React.FC<Props> = ({ formData, onFormChange }) => {
  return (
    <div className="border-t pt-8">
      <h3 className="text-xl font-bold mb-6">Shipping & Delivery</h3>
      <div className="space-y-4">
        {/* Shipping Available */}
        <div className="bg-gray-50 rounded-xl p-4">
          <label className="flex items-start gap-3 cursor-pointer mb-4">
            <input
              type="checkbox"
              checked={formData.shippingAvailable}
              onChange={(e) =>
                onFormChange("shippingAvailable", e.target.checked)
              }
              className="w-5 h-5 rounded border-2 border-gray-300 text-blue-600 focus:ring-2 focus:ring-blue-500 mt-0.5"
            />
            {/* ... label text ... */}
          </label>

          {formData.shippingAvailable && (
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Processing Time
              </label>
              <input
                type="text"
                value={formData.processingTime}
                onChange={(e) => onFormChange("processingTime", e.target.value)}
                placeholder="e.g. 3-5 business days"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition"
              />
            </div>
          )}
        </div>

        {/* Local Delivery */}
        <div className="bg-gray-50 rounded-xl p-4">
          <label className="flex items-start gap-3 cursor-pointer mb-4">
            <input
              type="checkbox"
              checked={formData.deliveryAvailable}
              onChange={(e) =>
                onFormChange("deliveryAvailable", e.target.checked)
              }
              className="w-5 h-5 rounded border-2 border-gray-300 text-blue-600 focus:ring-2 focus:ring-blue-500 mt-0.5"
            />
            {/* ... label text ... */}
          </label>

          {formData.deliveryAvailable && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Delivery Radius (miles)
                </label>
                <input
                  type="number"
                  value={formData.deliveryRadius}
                  onChange={(e) =>
                    onFormChange("deliveryRadius", e.target.value)
                  }
                  placeholder="10"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Delivery Fee
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 font-semibold">
                    $
                  </span>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.deliveryFee}
                    onChange={(e) =>
                      onFormChange("deliveryFee", e.target.value)
                    }
                    placeholder="0.00"
                    className="w-full pl-8 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition"
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ShippingDelivery;
