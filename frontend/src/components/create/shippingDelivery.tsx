import React from "react";
import type { ListingFormData, ValidationErrors } from "../../types/create.ts";

interface Props {
  formData: ListingFormData;
  onFormChange: (field: keyof ListingFormData, value: string | boolean) => void;
  errors?: ValidationErrors;
}

const ShippingDelivery: React.FC<Props> = ({
  formData,
  onFormChange,
  errors = {},
}) => {
  return (
    <div className="pt-8">
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
            <div>
              <div className="font-bold text-gray-900">Shipping Available</div>
              <div className="text-sm text-gray-600">
                Ship this item to buyers
              </div>
            </div>
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
                className={`w-full px-4 py-3 border-2 rounded-xl focus:border-blue-500 focus:outline-none transition placeholder:text-gray-400 ${
                  errors.processingTime ? "border-red-500" : "border-gray-200"
                }`}
              />
              {errors.processingTime && (
                <div className="text-xs text-red-600 mt-1">
                  {errors.processingTime}
                </div>
              )}
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
            <div>
              <div className="font-bold text-gray-900">Local Delivery</div>
              <div className="text-sm text-gray-600">
                Offer local delivery option
              </div>
            </div>
          </label>

          {formData.deliveryAvailable && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Delivery Radius (miles)
                </label>
                <input
                  type="number"
                  min="0"
                  value={formData.deliveryRadius}
                  onChange={(e) =>
                    onFormChange("deliveryRadius", e.target.value)
                  }
                  placeholder="10"
                  className={`w-full px-4 py-3 border-2 rounded-xl focus:border-blue-500 focus:outline-none transition placeholder:text-gray-400 ${
                    errors.deliveryRadius ? "border-red-500" : "border-gray-200"
                  }`}
                />
                {errors.deliveryRadius && (
                  <div className="text-xs text-red-600 mt-1">
                    {errors.deliveryRadius}
                  </div>
                )}
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
                    min="0"
                    value={formData.deliveryFee}
                    onChange={(e) =>
                      onFormChange("deliveryFee", e.target.value)
                    }
                    placeholder="0.00"
                    className={`w-full pl-8 pr-4 py-3 border-2 rounded-xl focus:border-blue-500 focus:outline-none transition placeholder:text-gray-400 ${
                      errors.deliveryFee ? "border-red-500" : "border-gray-200"
                    }`}
                  />
                </div>
                {errors.deliveryFee && (
                  <div className="text-xs text-red-600 mt-1">
                    {errors.deliveryFee}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ShippingDelivery;
