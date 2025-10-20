import React from "react";
import type { SortOption } from "../../types/search";

interface FilterBarProps {
  tags: string[];
  sort: SortOption;
  onTagsChange: (tags: string[]) => void;
  onSortChange: (s: SortOption) => void;
}

const ALL_TAGS = ["Books", "Electronics", "Furniture", "Clothing", "Misc"];

const FilterBar: React.FC<Partial<FilterBarProps>> = ({
  tags = [],
  sort = "relevance",
  onTagsChange = () => {},
  onSortChange = () => {},
}) => {
  const toggleTag = (t: string) => {
    const next = tags.includes(t) ? tags.filter((x) => x !== t) : [...tags, t];
    onTagsChange(next);
  };

  return (
    <div className="flex items-center gap-2 px-8 py-4 bg-white border-b border-gray-200">
      <button className="px-4 py-2 bg-gray-200 rounded-full font-medium text-gray-700 hover:bg-gray-300">
        Show filters
      </button>

      {ALL_TAGS.map((tag) => (
        <button
          key={tag}
          onClick={() => toggleTag(tag)}
          className={`px-4 py-2 rounded-full font-medium ${
            tags.includes(tag)
              ? "bg-purple-100 text-purple-700"
              : "bg-gray-100 text-gray-600"
          } hover:bg-gray-200`}
        >
          {tag}
        </button>
      ))}

      <div className="ml-auto">
        <select
          value={sort}
          onChange={(e) => onSortChange(e.target.value as SortOption)}
          className="px-3 py-2 rounded-full border border-gray-300 bg-gray-100 text-gray-700 focus:outline-none"
        >
          <option value="relevance">Most relevant</option>
          <option value="newest">Newest</option>
          <option value="price_asc">Price: Low to High</option>
          <option value="price_desc">Price: High to Low</option>
        </select>
      </div>
    </div>
  );
};

export default FilterBar;
