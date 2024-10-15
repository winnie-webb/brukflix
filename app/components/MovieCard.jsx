/* eslint-disable @next/next/no-img-element */
"use client";
import Link from "next/link";
import React, { useState } from "react";
import MovieCardSkeleton from "./MovieCardSkeleton";

const MovieCard = ({ title, imageUrl, link }) => {
  const [isImageLoaded, setIsImageLoaded] = useState(false);

  return (
    <Link href={`/${link.split("/")[3]}`}>
      <div className="relative">
        <img
          className={`w-full h-60 object-cover rounded-xl transition-opacity duration-500 ${
            isImageLoaded ? "opacity-100" : "opacity-0"
          }`}
          src={imageUrl}
          alt={title}
          loading="lazy"
          onLoad={() => setIsImageLoaded(true)}
        />
        {!isImageLoaded && (
          <div className="absolute inset-0">
            <MovieCardSkeleton />
          </div>
        )}
      </div>
    </Link>
  );
};

export default MovieCard;
