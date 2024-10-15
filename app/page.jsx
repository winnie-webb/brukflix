"use client";
import { useEffect, useMemo, useState } from "react";
import MovieList from "./components/MovieList";
import SkeletonLoader from "./components/SkeletonLoader";

export default function Home() {
  const genres = useMemo(
    () => [
      "Action",
      "Comedy",
      "Animation",
      "Adventure",
      "Thriller",
      "War",
      "History",
      "Family",
    ],
    []
  );

  const [movies, setMovies] = useState({});
  const [loading, setLoading] = useState(true); // Add loading state
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAllGenres = async () => {
      try {
        const promises = genres.map(async (genre) => {
          const response = await fetch(`/api/movies/genre/${genre}`);
          if (!response.ok) throw new Error(`Failed to fetch ${genre} movies`);
          const data = await response.json();
          return { genre, data };
        });

        const results = await Promise.all(promises);
        const moviesByGenre = {};
        results.forEach(({ genre, data }) => {
          moviesByGenre[genre] = data;
        });

        setMovies(moviesByGenre);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchAllGenres();
  }, [genres]);

  if (error) {
    return <div>Error: {error}</div>; // Error handling
  }

  return (
    <div>
      <div className="bg-cover bg-[url('/hero-1.png')] bg-center bg-no-repeat w-full h-[30vh] md:h-[40vh] xl:h-[75vh] "></div>
      <div className="p-4 md:p-10">
        {genres.map((genre) => (
          <div key={genre} className="mb-8">
            {loading ? (
              <SkeletonLoader title={genre} />
            ) : (
              <MovieList title={genre} movies={movies[genre] || []} />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
