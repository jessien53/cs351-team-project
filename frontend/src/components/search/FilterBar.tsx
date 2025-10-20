import React from "react";

const FilterBar: React.FC = () => (
  <div className="flex items-center gap-2 px-8 py-4 bg-white border-b border-gray-200">
    <button className="px-4 py-2 bg-gray-200 rounded-full font-medium text-gray-700 hover:bg-gray-300">Show filters</button>
    {[1,2,3,4,5,6].map((tag) => (
      <button
        key={tag}
        className="px-4 py-2 bg-gray-100 rounded-full font-medium text-gray-600 hover:bg-gray-200"
      >
        {`Tag ${tag}`}
      </button>
    ))}
    <div className="ml-auto">
      <select className="px-3 py-2 rounded-full border border-gray-300 bg-gray-100 text-gray-700 focus:outline-none">
        <option>Most relevant</option>
        <option>Newest</option>
        <option>Price: Low to High</option>
        <option>Price: High to Low</option>
      </select>
    </div>
  </div>
);

export default FilterBar;
