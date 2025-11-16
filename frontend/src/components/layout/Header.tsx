import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { getAutocompleteSuggestions } from "../../services/autocomplete";
import { useAuth } from "../../context/AuthContext";
import logo from "../../assets/Logo.png";

const Header: React.FC = () => {
  const [q, setQ] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  const { currentUser } = useAuth(); // Access current user from context

  const handleProfileClick = () => {
    if (currentUser) {
      // If we are "logged in", go to our profile
      navigate(`/profile/${currentUser.id}`);
    } else {
      // In the future, this would go to the login page
      // navigate("/login");
      console.log("No user logged in");
    }
  };

  const handleLogoClick = () => {
    navigate("/");
  };

  // Debounced autocomplete fetch
  useEffect(() => {
    const timer = setTimeout(async () => {
      if (q.trim().length > 0) {
        setIsLoading(true);
        const results = await getAutocompleteSuggestions(q);
        setSuggestions(results);
        setShowSuggestions(results.length > 0);
        setIsLoading(false);
      } else {
        setSuggestions([]);
        setShowSuggestions(false);
      }
    }, 300)

    return () => clearTimeout(timer);
  }, [q]);

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearch = (searchQuery: string) => {
    const params = new URLSearchParams();
    if (searchQuery.trim()) params.set("q", searchQuery.trim());
    navigate(`/search?${params.toString()}`);
    setShowSuggestions(false);
  };

  const onKeyDown: React.KeyboardEventHandler<HTMLInputElement> = (e) => {
    if (e.key === "Enter") {
      if (selectedIndex >= 0 && selectedIndex < suggestions.length) {
        // User selected a suggestion with arrow keys
        const selected = suggestions[selectedIndex];
        setQ(selected);
        handleSearch(selected);
      } else {
        // User pressed enter without selecting a suggestion
        handleSearch(q);
      }
      setSelectedIndex(-1);
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) =>
        prev < suggestions.length - 1 ? prev + 1 : prev
      );
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : -1));
    } else if (e.key === "Escape") {
      setShowSuggestions(false);
      setSelectedIndex(-1);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setQ(suggestion);
    handleSearch(suggestion);
    setSelectedIndex(-1);
  };

  return (
    <header className="flex items-center justify-between px-8 py-4 bg-primary shadow-sm">
      <div
        className="flex items-center gap-3 cursor-pointer" // Added cursor-pointer
        onClick={handleLogoClick} // Added onClick
      >
        <div className="pointer-events-none bg-accent p-1 rounded hover:bg-gray-100 flex items-center">
          <img src={logo} alt="CampusMarket Logo" width={40} height={40} />
        </div>
        <span className="text-xl font-bold text-accent">CampusMarket</span>
      </div>
      <div className="flex-1 mx-8 max-w-xl relative">
        <input
          ref={inputRef}
          value={q}
          onChange={(e) => {
            setQ(e.target.value);
            setSelectedIndex(-1);
          }}
          onKeyDown={onKeyDown}
          onFocus={() => {
            if (suggestions.length > 0) setShowSuggestions(true);
          }}
          type="text"
          placeholder="Search"
          className="w-full px-4 py-2 rounded-full bg-white focus:outline-none focus:ring-2 focus:ring-accent text-dark"
        />

        {/* Autocomplete Dropdown */}
        {showSuggestions && (
          <div
            ref={suggestionsRef}
            className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-lg border border-gray-200 max-h-80 overflow-y-auto z-50"
          >
            {isLoading ? (
              <div className="px-4 py-3 text-gray-500 text-sm">
                Loading suggestions...
              </div>
            ) : (
              suggestions.map((suggestion, index) => (
                <div
                  key={index}
                  onClick={() => handleSuggestionClick(suggestion)}
                  className={`px-4 py-3 cursor-pointer transition-colors ${
                    index === selectedIndex
                      ? "bg-accent text-secondary"
                      : "hover:bg-gray-50"
                  }`}
                  onMouseEnter={() => setSelectedIndex(index)}
                >
                  <div className="flex items-center gap-2">
                    <span className="material-icons text-gray-400 text-sm">
                      search
                    </span>
                    <span className="text-sm text-gray-800">{suggestion}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
      <div className="flex items-center gap-4">
        <button className="p-2 rounded-full hover:bg-accent flex items-center">
          <span className="material-icons text-secondary">favorite_border</span>
        </button>
        {/* Chat Button - Currently Disabled
        <button className="p-2 rounded-full hover:bg-accent flex items-center">
          <span className="material-icons text-secondary ">
            chat_bubble_outline
          </span>
        </button> */}
        <button className="px-4 py-2 bg-secondary text-accent rounded-full font-semibold hover:bg-accent hover:text-secondary transition flex items-center">
          + Sell
        </button>
        <button
          onClick={handleProfileClick}
          className="p-2 rounded-full hover:bg-accent flex items-center"
        >
          <span className="material-icons text-secondary">account_circle</span>
        </button>
      </div>
    </header>
  );
};

export default Header;
