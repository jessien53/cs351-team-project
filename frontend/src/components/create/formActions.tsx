import React from "react";
import type { ListingStatus } from "../../types/create.ts";

interface Props {
  onSubmit: (status: ListingStatus) => void;
}

const FormActions: React.FC<Props> = ({ onSubmit }) => {
  return (
    <div className="border-t pt-8 flex gap-4">
      <button
        type="button"
        onClick={() => onSubmit("draft")}
        className="flex-1 border-2 border-gray-300 text-gray-700 py-4 rounded-xl font-semibold hover:bg-gray-50 transition flex items-center justify-center gap-2"
      >
        {/* ... save icon ... */}
        Save as Draft
      </button>
      <button
        type="button"
        onClick={() => onSubmit("active")}
        className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition shadow-lg shadow-blue-500/30"
      >
        Publish Listing
      </button>
    </div>
  );
};

export default FormActions;
