/* eslint-disable @next/next/no-img-element */
"use client";
import React, { useEffect, useState } from "react";

const Genre = () => {
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const genre = window.location.href.split("/")[4];

  useEffect(() => {
    const fetchGenre = async () => {
      const response = await fetch(`/api/movies/genre/${genre}`);
      if (!response.ok) throw new Error(`Failed to fetch ${genre} movies`);
      const data = await response.json();
      setMovies(data);
      setIsLoading(false);
    };
    fetchGenre();
  }, [genre]);

  return (
    <div className="p-4 md:p-20 min-h-[80vh]">
      <h1 className="text-3xl font-bold mb-8">{genre.toUpperCase()}</h1>
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-9 gap-6">
        {isLoading
          ? Array(8)
              .fill(0)
              .map((_, idx) => (
                <div
                  key={idx}
                  className="w-full h-60 bg-gray-300 rounded-lg animate-pulse"
                />
              ))
          : movies.map((movie, index) => {
              return <MovieCard key={index} movie={movie} />;
            })}
      </div>
    </div>
  );
};

const MovieCard = ({ movie }) => {
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const nativeLink = movie.link.split("/")[3];
  const isMovie = nativeLink[0] === "m";

  return (
    <a
      href={`/stream/${isMovie ? "movies" : "series"}/${nativeLink}`}
      className="relative block"
    >
      <img
        className={`w-full h-60 object-cover rounded-xl transition-opacity duration-500 ${
          isImageLoaded ? "opacity-100" : "opacity-0"
        }`}
        src={movie.imageUrl}
        alt={movie.title}
        loading="lazy"
        onLoad={() => setIsImageLoaded(true)}
      />
      {!isImageLoaded && (
        <div className="absolute inset-0 bg-gray-200 animate-pulse rounded-xl" />
      )}
    </a>
  );
};

export default Genre;
