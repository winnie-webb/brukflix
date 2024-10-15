"use client";
import Link from "next/link";
import { AiFillInstagram } from "react-icons/ai";

export default function Footer() {
  return (
    <footer className="bg-black text-white py-8 px-6 xl:px-20">
      {/* Top Section: Links and Social Media */}
      <div className="flex flex-col md:flex-row justify-between items-center space-y-8 md:space-y-0">
        {/* Navigation Links */}
        <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-8">
          <Link href="/" className="hover:underline">
            Home
          </Link>
          <Link href="/movies" className="hover:underline">
            Movies
          </Link>
          <Link href="/series" className="hover:underline">
            Series
          </Link>
        </div>

        {/* Social Media Icons */}
        <a
          target="_blank"
          href="https://www.instagram.com/iamwinston.brown/"
          className="flex space-x-6 text-3xl"
        >
          <AiFillInstagram className="cursor-pointer hover:text-gray-400" />
        </a>
      </div>

      {/* Divider */}
      <hr className="my-6 border-gray-600" />

      {/* Bottom Section: Copyright */}
      <div className="flex justify-between items-center">
        <p className="text-sm">
          &copy; {new Date().getFullYear()} Brukflix. All Rights Reserved.
          Winston Brown
        </p>
        <a
          target="_blank"
          href="https://www.instagram.com/iamwinston.brown/"
          className="text-sm hover:underline"
        >
          Terms & Conditions
        </a>
      </div>
    </footer>
  );
}
