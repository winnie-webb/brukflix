"use client";
import { useState, useEffect, useRef } from "react";
import { AiOutlineSearch } from "react-icons/ai";
import MiniLoader from "./MiniLoader";
import Link from "next/link";

export default function SearchComponent() {
  const [searchQuery, setSearchQuery] = useState("");
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showResults, setShowResults] = useState(false);
  const searchContainerRef = useRef(null);

  // Handle search form submission
  const handleSearch = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setResults([]); // Clear previous results
    setError(null); // Reset error state
    setShowResults(false); // Hide results until new ones arrive

    try {
      const response = await fetch("/api/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ searchTerm: searchQuery }),
      });

      if (!response.ok) throw new Error("Failed to fetch search results");

      const data = await response.json();
      setResults(data);
      setShowResults(true); // Show results when they arrive
    } catch (err) {
      setError(err.message); // Handle any errors
    } finally {
      setIsLoading(false); // Stop loading indicator
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(event.target)
      ) {
        setShowResults(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative w-[60%] m-auto" ref={searchContainerRef}>
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
      {isLoading && (
        <div className="absolute bg-black w-full p-4 rounded-lg z-50">
          <MiniLoader />
        </div>
      )}

      {!isLoading && showResults && (
        <div className="absolute bg-black w-full p-4 rounded-lg z-50">
          {error && <p className="text-red-500">{error}</p>}
          {results.data?.length > 0 ? (
            <ul className="space-y-4">
              {results.data.slice(0, 8).map((result, index) => {
                if (!result) return;
                const isSeries = result.isSeries;
                const link = isSeries
                  ? `/stream/series/${result.link.split("/")[1]}`
                  : `/stream/movies/${result.link.split("/")[3]}`;

                return (
                  <Link href={link} key={index}>
                    <li className="text-[0.8rem] p-2 rounded-lg hover:bg-[#141414] font-bold block">
                      {result.title}
                    </li>
                  </Link>
                );
              })}
            </ul>
          ) : (
            <p>No results found.</p>
          )}
        </div>
      )}
    </div>
  );
}
