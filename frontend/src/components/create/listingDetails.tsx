import React from "react";
import type { ListingFormData, ValidationErrors } from "../../types/create.ts";

interface Props {
  formData: ListingFormData;
  onFormChange: (field: keyof ListingFormData, value: string | boolean) => void;
  categories: string[];
  conditions: string[];
  errors?: ValidationErrors;
}

const ListingDetails: React.FC<Props> = ({
  formData,
  onFormChange,
  categories,
  conditions,
  errors = {},
}) => {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Listing Details</h2>
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-semibold text-ui mb-2">
            Title <span className="text-primary">*</span>
          </label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => onFormChange("title", e.target.value)}
            placeholder="e.g. Handcrafted Leather Messenger Bag"
            className={`w-full px-4 py-3 border-2 rounded-xl focus:border-blue-500 focus:outline-none transition placeholder:text-gray-400 ${
              errors.title ? "border-red-500" : "border-gray-200"
            }`}
            maxLength={200}
            required
          />
          {errors.title && (
            <div className="text-xs text-red-600 mt-1">{errors.title}</div>
          )}
          <div className="text-xs text-gray-500 mt-1 text-right">
            {formData.title.length}/200
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-ui mb-2">
              Category <span className="text-primary">*</span>
            </label>
            <div className="relative">
              <select
                value={formData.category}
                onChange={(e) => onFormChange("category", e.target.value)}
                className={`w-full px-4 py-3 border-2 rounded-xl focus:border-blue-500 focus:outline-none transition appearance-none bg-white ${
                  errors.category ? "border-red-500" : "border-gray-200"
                }`}
                required
              >
                <option value="" className="text-gray-400">
                  Select...
                </option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
              {errors.category && (
                <div className="text-xs text-red-600 mt-1">
                  {errors.category}
                </div>
              )}
              {/* ... dropdown arrow SVG ... */}
            </div>
          </div>
          <div>
            <label className="block text-sm font-semibold text-ui mb-2">
              Condition <span className="text-primary">*</span>
            </label>
            <div className="relative">
              <select
                value={formData.condition}
                onChange={(e) => onFormChange("condition", e.target.value)}
                className={`w-full px-4 py-3 border-2 rounded-xl focus:border-blue-500 focus:outline-none transition appearance-none bg-white ${
                  errors.condition ? "border-red-500" : "border-gray-200"
                }`}
                required
              >
                <option value="" className="text-gray-400">
                  Select...
                </option>
                {conditions.map((cond) => (
                  <option key={cond} value={cond}>
                    {cond}
                  </option>
                ))}
              </select>
              {errors.condition && (
                <div className="text-xs text-red-600 mt-1">
                  {errors.condition}
                </div>
              )}
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-ui mb-2">
            Description <span className="text-primary">*</span>
          </label>
          <textarea
            value={formData.description}
            onChange={(e) => onFormChange("description", e.target.value)}
            placeholder="Describe your item in detail..."
            rows={6}
            className={`w-full px-4 py-3 border-2 rounded-xl focus:border-blue-500 focus:outline-none transition resize-none placeholder:text-gray-400 ${
              errors.description ? "border-red-500" : "border-gray-200"
            }`}
            required
            minLength={10}
          />
          {errors.description && (
            <div className="text-xs text-red-600 mt-1">
              {errors.description}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ListingDetails;
