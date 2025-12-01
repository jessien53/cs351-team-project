import React from "react";
import type { SortOption } from "../../types/search";
import CustomSelect from "../create/CustomSelect";

interface FilterBarProps {
  tags: string[];
  sort: SortOption;
  onTagsChange: (tags: string[]) => void;
  onSortChange: (s: SortOption) => void;
}

const ALL_TAGS = ["Books", "Electronics", "Furniture", "Clothing", "Misc"];

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: "relevance", label: "Most relevant" },
  { value: "newest", label: "Newest" },
  { value: "price_asc", label: "Price: Low to High" },
  { value: "price_desc", label: "Price: High to Low" },
];

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
        <CustomSelect
          value={
            SORT_OPTIONS.find((opt) => opt.value === sort)?.label ||
            "Most relevant"
          }
          onChange={(label) => {
            const option = SORT_OPTIONS.find((opt) => opt.label === label);
            if (option) onSortChange(option.value);
          }}
          options={SORT_OPTIONS.map((opt) => opt.label)}
        />
      </div>
    </div>
  );
};

export default FilterBar;
