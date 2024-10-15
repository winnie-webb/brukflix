"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { AiOutlineMenu, AiOutlineUser, AiOutlineClose } from "react-icons/ai";
import SearchBar from "./SearchBar";
import { usePathname } from "next/navigation";

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
  const [menuOpen, setMenuOpen] = useState(false);
  const currentPath = usePathname();

  const toggleMenu = () => {
    setMenuOpen((prev) => !prev);
  };

  const isActiveLink = (link) => {
    console.log(link === currentPath, link);
    return currentPath === link;
  };

  return (
    <nav className="z-50 flex items-center justify-between px-6 xl:px-20 py-4 bg-black text-white">
      {/* Left Section: Logo and Menu Links */}
      <div className="items-center md:space-x-8 flex">
        <Link
          href="/"
          className="text-3xl font-bold cursor-pointer hidden md:flex"
        >
          Brukflix
        </Link>
        <Link
          href="/"
          className="flex text-3xl font-bold cursor-pointer md:hidden"
        >
          B
        </Link>
        <ul className="hidden md:flex space-x-6 text-lg">
          <li>
            <Link
              href="/"
              className={`${
                isActiveLink("/") ? "underline underline-offset-8" : ""
              } hover:underline underline-offset-8`}
            >
              Movies
            </Link>
          </li>
          <li>
            <Link
              href="/series"
              className={`${
                isActiveLink("/series") ? "underline underline-offset-8" : ""
              } hover:underline underline-offset-8`}
            >
              Series
            </Link>
          </li>
        </ul>
      </div>

      <SearchBar />

      {/* Right Section: Profile and Menu */}
      <div className="flex items-center space-x-6">
        <AiOutlineUser className="text-2xl cursor-pointer" />
        <button onClick={toggleMenu} aria-label="Toggle Menu">
          {menuOpen ? (
            <AiOutlineClose className="text-2xl" />
          ) : (
            <AiOutlineMenu className="text-2xl" />
          )}
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="absolute z-50 top-[3.7rem] left-0 w-full bg-black text-white p-4 pl-20">
          <ul className="flex flex-col space-y-4">
            <li>
              <Link
                href="/"
                className={`${
                  isActiveLink("/") ? "underline underline-offset-8" : ""
                } hover:underline underline-offset-8`}
              >
                Movies
              </Link>
            </li>
            <li>
              <Link
                href="/series"
                className={`${
                  isActiveLink("/series") ? "underline underline-offset-8" : ""
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
