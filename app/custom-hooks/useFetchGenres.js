import { useEffect, useMemo, useState } from "react";

export default function useFetchGenres(mediaType) {
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
          const response = await fetch(`/api/${mediaType}/genre/${genre}`);
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
  return { movies, loading, error, genres };
}
