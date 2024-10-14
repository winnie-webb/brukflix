"use client";
import { useEffect, useState } from "react";
// import SearchBar from "./components/SearchBar";
import MovieList from "./components/MovieList";

export default function Home() {
  const [moviesAction, setMoviesAction] = useState([]);
  const [moviesComedy, setMoviesComedy] = useState([]);
  const [moviesAnimation, setMoviesAnimation] = useState([]);
  const [moviesAdventure, setMoviesAdventure] = useState([]);
  const [moviesThriller, setMoviesThriller] = useState([]);
  const [moviesWar, setMoviesWar] = useState([]);
  const [moviesHistory, setMoviesHistory] = useState([]);
  const [moviesFamily, setMoviesFamily] = useState([]);

  useEffect(() => {
    const fetchData = async (genre, setMedia) => {
      const response = await fetch(`/api/movies/genre/${genre}`);
      const data = await response.json();
      setMedia(data);
    };
    fetchData("Action", setMoviesAction);
    fetchData("Comedy", setMoviesComedy);
    fetchData("Animation", setMoviesAnimation);
    fetchData("Adventure", setMoviesAdventure);
    fetchData("Thriller", setMoviesThriller);
    fetchData("War", setMoviesWar);
    fetchData("History", setMoviesHistory);
    fetchData("Family", setMoviesFamily);
  }, []);
  return (
    <div>
      <div className="bg-cover bg-[url('/hero-1.png')] bg-center bg-no-repeat w-full h-[80vh]"></div>
      <div className="p-4 md:p-10">
        <MovieList title="Action" movies={moviesAction} />
        <MovieList title="Family-Friendly" movies={moviesFamily} />
        <MovieList title="Animation" movies={moviesAnimation} />
        <MovieList title="Comedy" movies={moviesComedy} />
        <MovieList title="Thriller" movies={moviesThriller} />
        <MovieList title="Adventure" movies={moviesAdventure} />
        <MovieList title="War" movies={moviesWar} />
        <MovieList title="History" movies={moviesHistory} />
      </div>
    </div>
  );
}
