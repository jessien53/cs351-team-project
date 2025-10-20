import React from "react";

const Header: React.FC = () => (
  <header className="flex items-center justify-between px-8 py-4 bg-white shadow-sm">
    <div className="flex items-center gap-3">
      <button className="p-2 rounded hover:bg-gray-100 flex items-center bg-gray-200">
        <span className="material-icons">apps</span>
      </button>
      <span className="text-xl font-bold text-gray-800">CampusMarket</span>
    </div>
    <div className="flex-1 mx-8 max-w-xl">
      <input
        type="text"
        placeholder="Search"
        className="w-full px-4 py-2 rounded-full border border-gray-300 bg-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-400"
      />
    </div>
    <div className="flex items-center gap-4">
      <button className="p-2 rounded-full hover:bg-gray-100 flex items-center">
        <span className="material-icons">favorite_border</span>
      </button>
      <button className="p-2 rounded-full hover:bg-gray-100 flex items-center">
        <span className="material-icons">chat_bubble_outline</span>
      </button>
      <button className="px-4 py-2 bg-blue-500 text-white rounded-full font-semibold hover:bg-blue-600 transition flex items-center">
        + Sell
      </button>
      <button className="p-2 rounded-full hover:bg-gray-100 flex items-center">
        <span className="material-icons">account_circle</span>
      </button>
    </div>
  </header>
);

export default Header;
