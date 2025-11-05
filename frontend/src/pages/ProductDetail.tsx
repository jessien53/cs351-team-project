import React from "react";

const ProductDetail: React.FC = () => {
  return (
    <div className="min-h-screen bg-light">
      <h1 className="text-4xl font-bold text-primary p-8">
        Campus Marketplace
      </h1>
      <p className="text-lg text-dark p-8">
        Detailed information about the selected product will be displayed here.
      </p>
      <nav className="p-8">
        <ul className="space-y-4">
          <li>
            <a href="/" className="text-primary hover:underline">
              Home
            </a>
          </li>
          <li>
            <a href="/search" className="text-primary hover:underline">
              Search
            </a>
          </li>
          <li>
            <a href="/messages" className="text-primary hover:underline">
              Messages
            </a>
          </li>
          <li>
            <a href="/profile/1" className="text-primary hover:underline">
              Profile
            </a>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default ProductDetail;
