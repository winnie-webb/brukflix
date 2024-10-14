"use client";
import { useEffect, useState } from "react";
// import SearchBar from "./components/SearchBar";
import MovieList from "./components/MovieList";

export default function Home() {
  const [movies, setMovies] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch("/api/movies/genre/Action");
      const data = await response.json();
      setMovies(data);
    };
    fetchData();
  }, []);
  return (
    <div>
      <div className="bg-cover bg-[url('/hero-1.png')] bg-center bg-no-repeat w-full h-[60vh]"></div>
      <MovieList movies={movies} />
    </div>
  );
}
