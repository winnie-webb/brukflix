"use client";
import { useState } from "react";
import { AiOutlineSearch } from "react-icons/ai";

export default function SearchComponent() {
  const [searchQuery, setSearchQuery] = useState(""); // Search input state
  const [results, setResults] = useState([]); // Store search results
  const [isLoading, setIsLoading] = useState(false); // Loading state
  const [error, setError] = useState(null); // Error state

  // Handle search form submission
  const handleSearch = async (e) => {
    e.preventDefault();
    setIsLoading(true); // Start loading state

    try {
      const response = await fetch("/api/search", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ searchTerm: searchQuery.trim() }),
      });

      if (!response.ok) throw new Error("Failed to fetch search results");

      const data = await response.json(); // Parse response data
      setResults(data); // Set results
    } catch (err) {
      setError(err.message); // Set error
    } finally {
      setIsLoading(false); // Stop loading state
    }
  };

  return (
    <div className="relative w-[60%] m-auto ">
      {/* Search Form */}
      <form onSubmit={handleSearch} className="relative flex items-center">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search..."
          className="w-full rounded-full px-4 py-2 text-black"
        />
        <button
          type="submit"
          className="absolute top-2 right-3 text-xl text-gray-400"
        >
          <AiOutlineSearch />
        </button>
      </form>

      {/* Search Results */}
      <div className=" absolute bg-black w-full p-4 rounded-lg">
        {isLoading && <p>Searching...</p>} {/* Loading Indicator */}
        {error && <p className="text-red-500">{error}</p>} {/* Error Message */}
        {/* Display Results */}
        {results.titles.length > 0 ? (
          <ul className="space-y-4 ">
            {results.titles.slice(0, 8).map((title, index) => (
              <span key={index} className=" text-sm font-bold block">
                {title}
              </span>
            ))}
          </ul>
        ) : (
          !isLoading && <p>No results found.</p>
        )}
      </div>
    </div>
  );
}
