import React from "react";

interface ProductCardProps {
  title: string;
  price: string;
  user: string;
  time: string;
}

const ProductCard: React.FC<ProductCardProps> = ({ title, price, user, time }) => (
  <div className="bg-white rounded-xl shadow-sm p-4 flex flex-col">
    <div className="bg-gray-200 rounded-lg h-32 mb-4" />
    <div className="font-semibold text-gray-800 mb-1">{title}</div>
    <div className="text-lg font-bold text-gray-900 mb-2">{price}</div>
    <div className="flex items-center text-sm text-gray-500 mt-auto">
      <span className="w-6 h-6 bg-gray-300 rounded-full mr-2 inline-block" />
      {user}
      <span className="mx-2">•</span>
      {time}
    </div>
  </div>
);

export default ProductCard;
