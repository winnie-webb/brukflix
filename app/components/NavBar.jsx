"use client";
import React from "react";
import Link from "next/link";

const NavBar = () => {
  const genres = [
    "Action",
    "Comedy",
    "Animation",
    "Adventure",
    "Thriller",
    "War",
    "History",
    "Family",
  ];

  return (
    <nav className="bg-gray-800 p-4 text-white">
      <div className="flex justify-between items-center">
        <h1 className="text-xl">Movie App</h1>
        <div className="flex space-x-4">
          {genres.map((genre) => (
            <Link key={genre} href={`/genre/${genre}`}>
              <span className="hover:underline">{genre}</span>
            </Link>
          ))}
          <Link href="/search">
            <span className="hover:underline">Search</span>
          </Link>
          <Link href="/year">
            <span className="hover:underline">Movies by Year</span>
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
