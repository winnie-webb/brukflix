"use client";
import { usePathname } from "next/navigation";
import React, { useEffect, useState } from "react";
import ReactPlayer from "react-player";

const MoviesStream = () => {
  const path = usePathname();
  const url = `https://ww1.goojara.to/${path.split("/")[3]}`;
  const [streamData, setStreamData] = useState({
    title: "",
    desc: "",
    posterLink: "",
    videoURL: "",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStreamData = async () => {
      try {
        const response = await fetch("/api/stream/movies", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ url }),
        });

        if (!response.ok) {
          throw new Error("Failed to fetch stream data");
        }

        const data = await response.json();
        setStreamData(data.streamContent);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchStreamData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500 border-opacity-75"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-red-500 text-xl font-semibold">{error}</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <ReactPlayer
        url={streamData.videoURL}
        controls
        className="rounded-lg shadow-md"
        width="100%"
        height="auto"
      />
      <div className="flex gap-2 mt-20">
        <img
          src={streamData.posterLink}
          alt={streamData.title}
          className="w-full h-96 object-cover rounded-lg mb-4"
        />
        <div className="my-2">
          <h1 className="text-3xl font-bold mb-2">{streamData.title}</h1>
          <p className="text-gray-700 text-lg mb-4">{streamData.desc}</p>
        </div>
      </div>
    </div>
  );
};

export default MoviesStream;
