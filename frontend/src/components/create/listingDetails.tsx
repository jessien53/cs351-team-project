import React from "react";
import type { ListingFormData } from "../../types/create.ts";

interface Props {
  formData: ListingFormData;
  onFormChange: (field: keyof ListingFormData, value: string | boolean) => void;
  categories: string[];
  conditions: string[];
}

const ListingDetails: React.FC<Props> = ({
  formData,
  onFormChange,
  categories,
  conditions,
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
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition"
            maxLength={200}
          />
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
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition appearance-none bg-white"
              >
                <option value="">Select...</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
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
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition appearance-none bg-white"
              >
                <option value="">Select...</option>
                {conditions.map((cond) => (
                  <option key={cond} value={cond}>
                    {cond}
                  </option>
                ))}
              </select>
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
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition resize-none"
          />
        </div>
      </div>
    </div>
  );
};

export default ListingDetails;
