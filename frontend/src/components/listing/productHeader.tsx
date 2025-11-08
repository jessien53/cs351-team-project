import { Star } from "lucide-react";

const ProductHeader: React.FC<{ itemData: any }> = ({ itemData }) => (
  <div>
    <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
      <span>{itemData.category}</span>
      <span>›</span>
      <span>{itemData.subcategory}</span>
    </div>
    <h1 className="text-4xl lg:text-5xl font-bold text-dark mb-4 leading-tight">
      {itemData.title}
    </h1>

    <div className="flex items-center gap-6 mb-6">
      <div className="flex items-center gap-2">
        <div className="flex">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className={`w-5 h-5 ${
                i < Math.floor(itemData.rating)
                  ? "fill-primary text-primary"
                  : "text-gray-300"
              }`}
            />
          ))}
        </div>
        <span className="text-sm font-medium text-dark">{itemData.rating}</span>
        <span className="text-sm text-gray-500">
          ({itemData.ratingCount} reviews)
        </span>
      </div>
      <div className="text-sm text-gray-500">{itemData.totalSales} sold</div>
    </div>

    <div className="text-5xl font-bold text-dark mb-2">${itemData.price}</div>
    <div className="text-sm text-secondary font-medium">
      {itemData.quantityAvailable > 0
        ? `✓ ${itemData.quantityAvailable} available`
        : "Out of Stock"}
    </div>
  </div>
);

export default ProductHeader;
