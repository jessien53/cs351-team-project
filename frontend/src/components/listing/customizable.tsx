import { Tag } from "lucide-react";

const Customizable: React.FC = () => {
  return (
    <div className="flex gap-4">
      <div className="flex-shrink-0 w-10 h-10 bg-pink-50 rounded-full flex items-center justify-center">
        <Tag className="w-5 h-5 text-pink-600" />
      </div>
      <div>
        <div className="font-semibold mb-1">Customizable</div>
        <div className="text-sm text-gray-600">Make it uniquely yours</div>
      </div>
    </div>
  );
};

export default Customizable;
