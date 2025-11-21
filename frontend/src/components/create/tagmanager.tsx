import React, { useState } from "react";

interface Props {
  tags: string[];
  onTagsChange: (tags: string[]) => void;
}

const TagManager: React.FC<Props> = ({ tags, onTagsChange }) => {
  const [tagInput, setTagInput] = useState("");

  const addTag = () => {
    if (
      tagInput.trim() &&
      tags.length < 10 &&
      !tags.includes(tagInput.trim())
    ) {
      onTagsChange([...tags, tagInput.trim()]);
      setTagInput("");
    }
  };

  const removeTag = (index: number) => {
    onTagsChange(tags.filter((_, i) => i !== index));
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addTag();
    }
  };

  return (
    <div>
      <label className="block text-sm font-semibold text-gray-700 mb-2">
        Tags
      </label>
      <div className="flex gap-2 mb-3">
        <input
          type="text"
          value={tagInput}
          onChange={(e) => setTagInput(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Add a tag..."
          maxLength={30}
          className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition placeholder:text-gray-400"
        />
        <button
          type="button"
          onClick={addTag}
          className="px-6 py-3 bg-gray-900 text-white rounded-xl font-semibold hover:bg-gray-800 transition"
        >
          Add
        </button>
      </div>
      <div className="flex flex-wrap gap-2">
        {tags.map((tag, i) => (
          <span
            key={i}
            className="px-3 py-1 bg-gray-900 text-white rounded-lg text-sm flex items-center gap-2"
          >
            #{tag}
            <button
              type="button"
              onClick={() => removeTag(i)}
              className="hover:text-red-400"
            >
              {/* ... X icon ... */}
            </button>
          </span>
        ))}
      </div>
      <div className="text-xs text-gray-500 mt-2">{tags.length}/10 tags</div>
    </div>
  );
};

export default TagManager;
