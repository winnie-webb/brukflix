"use client";
import MovieList from "./components/MovieList";
import SkeletonLoader from "./components/SkeletonLoader";
import useFetchGenres from "./custom-hooks/useFetchGenres";
export default function Home() {
  const { movies, loading, error, genres } = useFetchGenres("movies");
  if (error) {
    return <div>Error: {error}</div>; // Error handling
  }

  return (
    <div>
      <div className="bg-cover bg-[url('/hero-1.png')] bg-center bg-no-repeat w-full h-[30vh] md:h-[40vh] xl:h-[75vh] [@media(min-width:2080px)]:h-[40vh] "></div>
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
