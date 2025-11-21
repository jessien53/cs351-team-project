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
    <div className="flex items-center gap-2 px-8 py-4 bg-light border-b border-ui">
      <button className="px-4 py-2 bg-primary rounded-full font-medium text-dark hover:bg-ui hover:text-light">
        Show filters
      </button>

      {ALL_TAGS.map((tag) => (
        <button
          key={tag}
          onClick={() => toggleTag(tag)}
          className={`px-4 py-2 rounded-full font-medium ${
            tags.includes(tag)
              ? "bg-secondary text-accent"
              : "bg-light text-dark"
          } hover:bg-accent hover:text-dark`}
        >
          {tag}
        </button>
      ))}

      <div className="ml-auto">
        <select
          value={sort}
          onChange={(e) => onSortChange(e.target.value as SortOption)}
          className="px-4 py-2 rounded-lg bg-light text-dark border border-gray-300 focus:border-blue-500 focus:outline-none cursor-pointer"
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
