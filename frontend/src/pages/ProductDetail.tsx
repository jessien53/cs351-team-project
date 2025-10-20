import React from "react";

const ProductDetail: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <h1 className="text-4xl font-bold text-purple-600 p-8">
        Campus Marketplace
      </h1>
      <p className="text-lg text-gray-700 p-8">
        Detailed information about the selected product will be displayed here.
      </p>
      <nav className="p-8">
        <ul className="space-y-4">
          <li>
            <a href="/" className="text-purple-600 hover:underline">
              Home
            </a>
          </li>
          <li>
            <a href="/search" className="text-purple-600 hover:underline">
              Search
            </a>
          </li>
          <li>
            <a href="/messages" className="text-purple-600 hover:underline">
              Messages
            </a>
          </li>
          <li>
            <a href="/profile/1" className="text-purple-600 hover:underline">
              Profile
            </a>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default ProductDetail;
