import { Truck } from "lucide-react";

const Shipping = ({ processingTime }: { processingTime: string }) => {
  return (
    <div className="flex gap-4">
      <div className="flex-shrink-0 w-10 h-10 bg-secondary/10 rounded-full flex items-center justify-center">
        <Truck className="w-5 h-5 text-secondary" />
      </div>
      <div>
        <div className="font-semibold mb-1">Fast Shipping</div>
        <div className="text-sm text-gray-600">
          Dispatches within {processingTime}
        </div>
      </div>
    </div>
  );
};

export default Shipping;
