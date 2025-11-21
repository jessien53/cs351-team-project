import React from "react";
import TagManager from "./tagmanager.tsx";
import type { ListingFormData } from "../../types/create.ts";

interface Props {
  customizable: boolean;
  tags: string[];
  onFormChange: (field: keyof ListingFormData, value: string | boolean) => void;
  onTagsChange: (tags: string[]) => void;
}

const AdditionalOptions: React.FC<Props> = ({
  customizable,
  tags,
  onFormChange,
  onTagsChange,
}) => {
  return (
    <div className="pt-8">
      <h3 className="text-xl font-bold mb-6">Additional Options</h3>

      <div className="space-y-4 mb-6">
        <div className="bg-gray-50 rounded-xl p-4">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={customizable}
              onChange={(e) => onFormChange("customizable", e.target.checked)}
              className="w-5 h-5 rounded border-2 border-gray-300 text-blue-600 focus:ring-2 focus:ring-blue-500"
            />
            <div>
              <div className="font-semibold text-gray-900">Customizable</div>
              <div className="text-sm text-gray-600">
                Allow buyers to request customizations
              </div>
            </div>
          </label>
        </div>
      </div>

      <TagManager tags={tags} onTagsChange={onTagsChange} />
    </div>
  );
};

export default AdditionalOptions;
