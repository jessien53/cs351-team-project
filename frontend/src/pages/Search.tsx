import React from "react";
import Header from "../components/layout/Header";
import FilterBar from "../components/search/FilterBar";
import ProductCard from "../components/search/ProductCard";

const mockProducts = Array.from({ length: 12 }).map((_, i) => ({
  title: i % 2 === 0 ? "Intro to AI Vol.4" : "Textbook",
  price: "$40",
  user: "Emily A.",
  time: "2hrs ago",
}));

const Search: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <FilterBar />
      <main className="px-8 py-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {mockProducts.map((product, i) => (
            <ProductCard
              key={i}
              title={product.title}
              price={product.price}
              user={product.user}
              time={product.time}
            />
          ))}
        </div>
      </main>
    </div>
  );
};

export default Search;
