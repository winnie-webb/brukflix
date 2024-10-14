"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation"; // For navigation
import Link from "next/link"; // For active links
import {
  AiOutlineMenu,
  AiOutlineSearch,
  AiOutlineUser,
  AiOutlineClose,
} from "react-icons/ai";

const genres = [
  "Action",
  "Adventure",
  "Animation",
  "Biography",
  "Comedy",
  "Crime",
  "Documentary",
  "Drama",
  "Family",
  "Fantasy",
  "Film-Noir",
  "Game-Show",
  "History",
  "Horror",
  "Musical",
  "Mystery",
  "News",
  "Reality",
  "TV",
  "Romance",
  "Sci-Fi",
  "Sport",
  "Talk-Show",
  "Thriller",
  "War",
  "Western",
  "Adult",
]; // Genres list

export default function Navbar() {
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false); // Mobile menu state
  const [searchQuery, setSearchQuery] = useState(""); // Search state
  const [activeLink, setActiveLink] = useState(""); // Active link state

  // Set active link based on the current route
  useEffect(() => {
    setActiveLink(window.location.pathname);
  }, []);

  // Handle search submission
  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${searchQuery}`);
    }
  };

  return (
    <nav className="z-50 flex items-center justify-around px-6 py-4 bg-black text-white">
      {/* Left Section: Logo and Menu Links */}
      <div className="flex items-center space-x-8">
        <Link href="/" className="text-3xl font-bold cursor-pointer">
          Brukflix
        </Link>
        <ul className="hidden md:flex space-x-6 text-lg">
          <li>
            <Link
              href="/"
              className={`${
                activeLink === "/" ? "underline" : ""
              } hover:underline underline-offset-8`}
            >
              Movies
            </Link>
          </li>
          <li>
            <Link
              href="/series"
              className={`${
                activeLink === "/series" ? "underline" : ""
              } hover:underline underline-offset-8`}
            >
              Series
            </Link>
          </li>
        </ul>
      </div>

      {/* Middle Section: Search */}
      <div className="hidden md:block">
        <form onSubmit={handleSearch} className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="rounded-full bg-gray-800 text-white px-4 py-2 w-64"
            placeholder="Search"
          />
          <button
            type="submit"
            className="absolute top-2 right-3 text-xl text-gray-400"
          >
            <AiOutlineSearch />
          </button>
        </form>
      </div>

      {/* Right Section: Profile and Menu */}
      <div className="flex items-center space-x-6">
        <AiOutlineSearch className="md:hidden text-2xl cursor-pointer" />
        <AiOutlineUser className="text-2xl cursor-pointer" />
        <button onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? (
            <AiOutlineClose className="text-2xl" />
          ) : (
            <AiOutlineMenu className="text-2xl" />
          )}
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="absolute z-50 top-16 left-0 w-full bg-black text-white p-4 pl-20 ">
          <ul className="flex flex-col space-y-4">
            <li>
              <Link
                href="/"
                className={` ${
                  activeLink === "/" ? "underline" : ""
                } hover:underline underline-offset-8`}
              >
                Movies
              </Link>
            </li>
            <li>
              <Link
                href="/series"
                className={`${
                  activeLink === "/series" ? "underline" : ""
                } hover:underline underline-offset-8`}
              >
                Series
              </Link>
            </li>
            <div className="flex flex-col">
              <h3 className="font-bold text-xl">Genres</h3>
              {genres.map((genre, index) => (
                <Link
                  key={index}
                  href={`/genres/${genre.toLowerCase()}`}
                  className="hover:underline flex items-center p-2 py-3 rounded-lg hover:bg-[#141414] underline-offset-8 ml-2"
                >
                  {genre}
                </Link>
              ))}
            </div>
          </ul>
        </div>
      )}
    </nav>
  );
}
