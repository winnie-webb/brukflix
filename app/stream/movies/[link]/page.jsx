"use client";
import React, { useEffect, useState } from "react";
import ReactPlayer from "react-player";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { MdError } from "react-icons/md";
import { usePathname } from "next/navigation";

const MoviesStream = () => {
  const path = usePathname();
  const url = `https://ww1.goojara.to/${path.split("/")[3]}`;
  const [loadingInfo, setLoadingInfo] = useState("Getting video data...");

  useEffect(() => {
    const timeout1 = setTimeout(
      () => setLoadingInfo("Rendering video and content"),
      2000
    );
    const timeout2 = setTimeout(
      () => setLoadingInfo("Sorry it's taking so long...😅"),
      4000
    );
    const timeout3 = setTimeout(
      () => setLoadingInfo("Almost there...🙄"),
      6000
    );
    const timeout4 = setTimeout(
      () => setLoadingInfo("One more second...💀"),
      8000
    );
    return () => {
      clearTimeout(timeout1); // Clean up timers on component unmount
      clearTimeout(timeout2);
      clearTimeout(timeout3);
      clearTimeout(timeout4);
    };
  }, []);

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
          body: JSON.stringify({
            url: url ? url : "https://ww1.goojara.to/m9Wv86",
          }),
        });
        if (!response.ok) {
          throw new Error("Failed to fetch stream data");
        }

        const data = await response.json();
        setStreamData(data.streamContent);

        // Check if streamContent contains all necessary fields
        if (
          !data.streamContent ||
          !data.streamContent.title ||
          !data.streamContent.desc ||
          !data.streamContent.posterLink ||
          !data.streamContent.videoURL
        ) {
          // If fields are missing, refresh the page
          window.location.reload();
        }
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchStreamData();
  }, [url]);

  if (loading) {
    return (
      <div className="flex gap-2 items-center justify-center min-h-screen bg-black">
        <AiOutlineLoading3Quarters className="animate-spin text-white text-6xl" />
        <p className="text-gray-300 text-xl font-semibold">{loadingInfo}</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black">
        <div className="text-center">
          <MdError className="text-red-600 text-6xl mx-auto mb-4" />
          <p className="text-red-500 text-xl font-semibold">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-black min-h-screen text-white">
      {!streamData && (
        <p className="text-white text-3xl h-[100vh] flex items-center justify-center">
          Please check your internet connection and refresh...
        </p>
      )}
      <div
        className="relative w-full h-[80vh] bg-cover bg-center"
        style={{ backgroundImage: `url(${streamData.posterLink})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 to-black/100"></div>
        <div className="absolute bottom-0 left-0 p-8">
          <h1 className="text-4xl md:text-5xl font-bold">{streamData.title}</h1>
          <p className="text-lg md:text-xl max-w-2xl mt-4 text-gray-300">
            {streamData.desc}
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto p-6 mt-8">
        <ReactPlayer
          url={streamData.videoURL}
          controls
          width="100%"
          height="100%"
          className="react-player"
          config={{
            file: {
              attributes: {
                autoPlay: true,
              },
            },
          }}
        />
      </div>
    </div>
  );
};

export default MoviesStream;
