const ListingDescription: React.FC<{ itemData: any }> = ({ itemData }) => {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Description</h2>
      <p className="text-dark leading-relaxed mb-6">{itemData.description}</p>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-light rounded-lg p-4">
          <div className="text-xs text-secondary mb-1">CONDITION</div>
          <div className="font-semibold">{itemData.condition}</div>
        </div>
        <div className="bg-light rounded-lg p-4">
          <div className="text-xs text-secondary mb-1">PROCESSING</div>
          <div className="font-semibold">{itemData.processingTime}</div>
        </div>
        <div className="bg-light rounded-lg p-4">
          <div className="text-xs text-secondary mb-1">VIEWS</div>
          <div className="font-semibold">{itemData.viewsCount}</div>
        </div>
        <div className="bg-light rounded-lg p-4">
          <div className="text-xs text-secondary mb-1">FAVORITES</div>
          <div className="font-semibold">{itemData.favoritesCount}</div>
        </div>
      </div>

      <div>
        <div className="text-sm font-semibold text-ui mb-3">TAGS</div>
        <div className="flex flex-wrap gap-2">
          {itemData.tags.map((tag: string, i: number) => (
            <span
              key={i}
              className="px-3 py-1 bg-primary text-light rounded-md text-sm"
            >
              #{tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};
export default ListingDescription;
