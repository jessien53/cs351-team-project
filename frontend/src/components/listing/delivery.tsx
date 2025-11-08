import { MapPin } from "lucide-react";

const Delivery: React.FC<{ deliveryFee: number }> = ({ deliveryFee }) => {
  return (
    <div className="flex gap-4">
      <div className="flex-shrink-0 w-10 h-10 bg-purple-50 rounded-full flex items-center justify-center">
        <MapPin className="w-5 h-5 text-purple-600" />
      </div>
      <div>
        <div className="font-semibold mb-1">Local Delivery</div>
        <div className="text-sm text-gray-600">
          Available for ${deliveryFee}
        </div>
      </div>
    </div>
  );
};

export default Delivery;
