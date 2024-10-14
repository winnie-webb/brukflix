/* eslint-disable @next/next/no-img-element */
// components/MovieCard.jsx
import Link from "next/link";
import React from "react";

const MovieCard = ({ title, imageUrl, link }) => {
  console.log(link.split("/"));
  return (
    <Link href={`/${link.split("/")[3]}`}>
      <div className="">
        <img
          className="w-full h-60 object-cover rounded-xl"
          src={imageUrl}
          alt={title}
        />
      </div>
    </Link>
  );
};

export default MovieCard;
