import { MessageCircle } from "lucide-react";

const Purchase: React.FC<{ itemData: any }> = ({ itemData }) => {
  return itemData.quantityAvailable > 0 ? (
    <div className="space-y-3">
      <button className="w-full bg-primary text-dark py-4 rounded-xl font-semibold transition shadow-lg hover:bg-primary/90">
        Add to Cart
      </button>
      <button className="w-full bg-secondary text-white py-4 rounded-xl font-semibold hover:bg-secondary/90 transition">
        Buy Now
      </button>
    </div>
  ) : (
    <div className="space-y-3">
      <button className="w-full bg-primary text-dark py-4 rounded-xl font-semibold transition shadow-lg hover:bg-primary/90">
        Out of Stock
      </button>
    </div>
  );
};

export default Purchase;
