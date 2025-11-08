import React from "react";
import { Verified } from "lucide-react";
import logo from "../../assets/Logo.png";

interface SellerCardProps {
  seller_id: string;
  rating: number;
  totalSales: number;
  major: string;
}

const SellerCard: React.FC<SellerCardProps> = ({
  seller_id,
  rating,
  totalSales,
  major,
}) => {
  return (
    <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-6">
      <div className="flex items-center gap-4 mb-4">
        {/*temp fake photo*/}
        <img
          src={logo}
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
      <button className="w-full bg-white border border-gray-300 py-3 rounded-lg font-medium hover:bg-gray-50 transition">
        Visit Shop
      </button>
    </div>
  );
};

export default SellerCard;
