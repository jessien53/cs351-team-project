import React, { useCallback, useEffect, useMemo, useState } from "react";
import Header from "../components/layout/Header";
import FilterBar from "../components/search/FilterBar";
import ProductCard from "../components/search/ProductCard";
import type { Product, SortOption } from "../types/search";
import { searchProducts } from "../services/search";
import { useLocation } from "react-router-dom";
//import {populateDisjointSet} from "../services/Populatedisjoint";

function useDebounced<T>(value: T, delay = 300) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return debounced;
}

const Search: React.FC = () => {
  const location = useLocation();
  const initialQ = new URLSearchParams(location.search).get("q") || "";
  const [query, setQuery] = useState(initialQ);
  const [tags, setTags] = useState<string[]>([]);
  const [sort, setSort] = useState<SortOption>("relevance");
  const [results, setResults] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [perPage, setPerPage] = useState(12);

  const debouncedQuery = useDebounced(query, 350);

  const fetchResults = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await searchProducts({ query: debouncedQuery, tags, sort, page });
      //console.log(res.results)
      // const res2 = await populateDisjointSet();
      // console.log(res2.message);
      setResults(res.results || []);
      setTotal(res.total);
      setPerPage(res.per_page);
    } catch (err: any) {
      setError(err?.message || "Failed to fetch results");
    } finally {
      setLoading(false);
    }
  }, [debouncedQuery, tags, sort, page]);

  useEffect(() => {
    // Only fetch when search is meaningful or filters change
    fetchResults();
  }, [fetchResults]);

  // keep query in sync if the URL changes (user used header search)
  useEffect(() => {
    const qFromUrl = new URLSearchParams(location.search).get("q") || "";
    if (qFromUrl !== query) {
      setQuery(qFromUrl);
      setPage(1); // Reset to first page on new search
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.search]);

  const productNodes = useMemo(() => {
    if (loading) {
      return Array.from({ length: 8 }).map((_, i) => (
        <div
          key={i}
          className="bg-light rounded-xl shadow-sm animate-pulse h-64 border border-ui"
        />
      ));
    }
    if (results.length === 0) {
      return (
        <div className="text-center text-dark py-12">No results found.</div>
      );
    }
    return results.map((p, i) => (
      <ProductCard
        key={p.id ?? i}
        id={p.id}
        title={p.title}
        price={p.price}
        user={p.user}
        user_id={p.user_id}
        avatar_url={p.user_avatar}
        time={p.time}
        image={p.image}
      />
    ));
  }, [loading, results]);

  return (
    <div className="min-h-screen bg-light">
      <Header />
      <FilterBar
        tags={tags}
        sort={sort}
        onTagsChange={setTags}
        onSortChange={setSort}
      />
      <main className="px-8 py-6">
        {error && <div className="mb-4 text-accent">{error}</div>}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {productNodes}
        </div>
        {!loading && results.length > 0 && (
          <div className="flex justify-center items-center gap-4 mt-8">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-4 py-2 bg-accent text-light rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-opacity-90 transition-all"
            >
              Previous
            </button>
            <span className="text-dark">
              Page {page} of {Math.ceil(total / perPage)}
            </span>
            <button
              onClick={() => setPage((p) => p + 1)}
              disabled={page >= Math.ceil(total / perPage)}
              className="px-4 py-2 bg-accent text-light rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-opacity-90 transition-all"
            >
              Next
            </button>
          </div>
        )}
      </main>
    </div>
  );
};

export default Search;
