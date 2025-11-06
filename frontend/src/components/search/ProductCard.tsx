import React from "react";
import { useNavigate } from "react-router-dom";

interface ProductCardProps {
  title: string;
  price: string;
  user: string;
  user_id: string;
  time: string;
}

const ProductCard: React.FC<ProductCardProps> = ({
  title,
  price,
  user,
  user_id, // Destructure user_id
  time,
}) => {
  const navigate = useNavigate(); // Get the navigate function

  // Create a handler
  const handleUserClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevents click from bubbling up if card is also clickable
    navigate(`/profile/${user_id}`);
  };

  return (
    <div className="bg-light rounded-xl shadow-sm flex flex-col border border-ui">
      <img
        src="https://placehold.co/800"
        alt={title}
        className="bg-ui rounded-t-lg object-cover h-48 w-full"
      />
      <div className="flex-1 p-4">
        <div className="font-semibold text-dark mb-1">{title}</div>
        <div className="text-lg font-bold text-dark mb-2">{price}</div>

        {/* Make this div clickable */}
        <div
          className="flex items-center text-sm text-dark mt-auto cursor-pointer"
          onClick={handleUserClick}
        >
          <span className="w-6 h-6 bg-ui rounded-full mr-2 inline-block" />
          <span className="hover:underline">{user}</span>{" "}
          {/* Added hover effect */}
          <span className="mx-2">•</span>
          {time}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
