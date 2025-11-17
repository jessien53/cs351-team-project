import React from "react";
import type { ListingStatus } from "../../types/create.ts";

interface Props {
  onSubmit: (status: ListingStatus) => void;
  isSubmitting?: boolean;
}

const FormActions: React.FC<Props> = ({ onSubmit, isSubmitting = false }) => {
  return (
    <div className="border-t pt-8 flex gap-4">
      <button
        type="button"
        onClick={() => onSubmit("draft")}
        disabled={isSubmitting}
        className="flex-1 border-2 border-gray-300 text-gray-700 py-4 rounded-xl font-semibold hover:bg-gray-50 transition flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {/* ... save icon ... */}
        Save as Draft
      </button>
      <button
        type="button"
        onClick={() => onSubmit("active")}
        disabled={isSubmitting}
        className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition shadow-lg shadow-blue-500/30 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Publish Listing
      </button>
    </div>
  );
};

export default FormActions;
