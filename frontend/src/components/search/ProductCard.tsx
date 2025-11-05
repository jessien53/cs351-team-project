import React from "react";

interface ProductCardProps {
  title: string;
  price: string;
  user: string;
  time: string;
}

const ProductCard: React.FC<ProductCardProps> = ({
  title,
  price,
  user,
  time,
}) => (
  <div className="bg-light rounded-xl shadow-sm flex flex-col border border-ui">
    <img
      src="https://placehold.co/800"
      alt={title}
      className="bg-ui rounded-t-lg object-cover h-48 w-full"
    />
    <div className="flex-1 p-4">
      <div className="font-semibold text-dark mb-1">{title}</div>
      <div className="text-lg font-bold text-dark mb-2">{price}</div>
      <div className="flex items-center text-sm text-dark mt-auto">
        <span className="w-6 h-6 bg-ui rounded-full mr-2 inline-block" />
        {user}
        <span className="mx-2">•</span>
        {time}
      </div>
    </div>
  </div>
);

export default ProductCard;
