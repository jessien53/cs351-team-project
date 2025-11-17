import React from "react";
import { Verified } from "lucide-react";
import logo from "../../assets/Logo.png";
import { useNavigate } from "react-router-dom";

interface SellerCardProps {
  seller_id: string;
  rating: number;
  totalSales: number;
  avatar_url?: string | null;
  major: string;
  user_id: string;
}

const SellerCard: React.FC<SellerCardProps> = ({
  seller_id,
  user_id,
  rating,
  avatar_url,
  totalSales,
  major,
}) => {
  const navigate = useNavigate();
  
  return (
    <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-6">
      <div className="flex items-center gap-4 mb-4">
        <img
          src={avatar_url || logo}
          className="w-16 h-16 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full"
        />

        <div className="flex flex-col gap 2">
          <div className="font-bold text-lg">{seller_id}</div>
          <div className="flex gap-2 items-center">
            <Verified />
            <div className="text-sm text-gray-600">Verified Student</div>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-4 text-center mb-4">
        <div>
          <div className="font-bold text-xl">{rating}</div>
          <div className="text-xs text-gray-600">Rating</div>
        </div>
        <div>
          <div className="font-bold text-xl">{totalSales}</div>
          <div className="text-xs text-gray-600">Sales</div>
        </div>
        <div>
          <div className="font-bold text-xl">{major}</div>
          <div className="text-xs text-gray-600">Major</div>
        </div>
      </div>
      <button onClick={() => navigate(`/profile/${user_id}`)} // Navigate to profile on click
        className="w-full bg-white border border-gray-300 py-3 rounded-lg font-medium hover:bg-gray-50 transition cursor-pointer"
        >
        Visit Shop
      </button>
    </div>
  );
};

export default SellerCard;
