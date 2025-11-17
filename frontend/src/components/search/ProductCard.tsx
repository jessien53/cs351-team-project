import React from "react";
import { useNavigate } from "react-router-dom";
import logo from "../../assets/logo.png";

interface ProductCardProps {
  id?: string;
  title: string;
  price: string;
  user: string;
  user_id: string;
  avatar_url?: string | null;
  time: string;
  image?: string;
}

const ProductCard: React.FC<ProductCardProps> = ({
  id,
  title,
  price,
  user,
  user_id,
  avatar_url,
  time,
  image,
}) => {
  const navigate = useNavigate();

  const handleUserProfileClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigate(`/profile/${user_id}`);
  };

  const handleUserCardClick = (e: React.MouseEvent) => {
    if (id) {
      navigate(`/listing/${id}`);
    } else {
      console.error("This product card has no ID.");
    }
  };

  return (
    <div
      className="group bg-light rounded-xl shadow-md flex flex-col cursor-pointer"
      onClick={handleUserCardClick}
    >
      <img
        src={image || "https://placehold.co/800"}
        alt={title}
        className="bg-ui rounded-t-lg object-cover h-48 w-full"
      />
      <div className="flex-1 p-4">
        <div className="font-semibold text-dark mb-1">{title}</div>
        <div className="text-lg font-bold text-dark mb-2">{price}</div>
        <div
          className="flex items-center text-sm text-dark mt-auto cursor-pointer"
          onClick={handleUserProfileClick}
        >
          <img
            src={avatar_url || logo}
            className="w-6 h-6 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full mr-2 object-cover"
          />
          <span className="hover:underline">{user}</span>{" "}
          <span className="mx-2">•</span>
          {time}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
