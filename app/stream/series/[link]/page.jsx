"use client";
import React, { useEffect, useState } from "react";
import ReactPlayer from "react-player";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { MdError } from "react-icons/md";
import { usePathname, useSearchParams } from "next/navigation"; // For parsing query params
import Link from "next/link";
import fetchStreamData from "./fetchStreamData";

const SeriesStream = () => {
  const path = usePathname();
  const searchParams = useSearchParams(); // Get query params from the URL

  const url = `https://ww1.goojara.to/${path.split("/")[3]}`;

  // Initialize state for stream data, loading, and errors
  const [streamData, setStreamData] = useState({
    title: "",
    desc: "",
    posterLink: "",
    videoURL: "",
    seriesContent: {
      seasonsLinks: [],
      episodesLinks: [],
    },
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // State for current season and episode
  const [currentSeason, setCurrentSeason] = useState(0);
  const [currentEpisode, setCurrentEpisode] = useState(null);
  const [seasonLoading, setSeasonLoading] = useState(false); // Loading state for season change

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const episodesPerPage = 5;

  // Fetch stream data when the component mounts
  useEffect(() => {
    fetchStreamData(url, setStreamData, setLoading, setError);
  }, [url]);

  // Parse season and episode from URL on load
  useEffect(() => {
    const season = searchParams.get("season");
    const episode = searchParams.get("episode");

    // Ensure season and episode are numbers, adjusting for zero-indexing
    if (season) {
      setCurrentSeason(Number(season) - 1); // season in query is 1-based, so adjust by -1
    }

    if (episode) {
      setCurrentEpisode(Number(episode) - 1); // episode in query is 1-based, so adjust by -1
    }
  }, [searchParams]);

  if (loading) {
    return (
      <div className="flex gap-2 items-center justify-center min-h-screen bg-black">
        <AiOutlineLoading3Quarters className="animate-spin text-white text-6xl" />
        <p className="text-gray-300 text-xl font-semibold">
          Getting video data...
        </p>
      </div>
    );
  }

  if (error || !streamData || (!streamData.title && !streamData.videoURL)) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black">
        <div className="text-center">
          <MdError className="text-red-600 text-6xl mx-auto mb-4" />
          <p className="text-red-500 text-xl font-semibold">
            {error || "No stream data available. Please try again later."}
          </p>
        </div>
      </div>
    );
  }

  const { posterLink, title, desc, videoURL, seriesContent } = streamData;

  // Slice the episodes for the current page
  const episodesToDisplay = seriesContent.episodesLinks.slice(
    (currentPage - 1) * episodesPerPage,
    currentPage * episodesPerPage
  );

  const totalPages = Math.ceil(
    seriesContent.episodesLinks.length / episodesPerPage
  );

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const handleSeasonChange = async (e) => {
    const selectedSeason = Number(e.target.value);
    setCurrentSeason(selectedSeason);
    setCurrentPage(1);
    setSeasonLoading(true); // Enable loading when switching season

    const currentSeasonURL = `${
      streamData.seriesContent.seasonsLinks[selectedSeason].split("?")[0]
    }?s=${selectedSeason + 1}`;

    try {
      const response = await fetch("/api/stream/series/season", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url: currentSeasonURL }),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch stream data for the selected season");
      }

      const data = await response.json();

      // Update streamData with new season episodes
      setStreamData((prevData) => ({
        ...prevData,
        seriesContent: {
          ...prevData.seriesContent,
          episodesLinks: data.episodesLinks,
        },
      }));
    } catch (err) {
      setError(err.message);
    } finally {
      setSeasonLoading(false); // Disable loading after fetch is done
    }
  };

  const handleEpisodeClick = (episodeIndex, episodeLink) => {
    setCurrentEpisode(episodeIndex);
    // Navigate to new URL with season and episode in query params
    window.location.href = `/stream/series${episodeLink}?season=${
      currentSeason + 1
    }&episode=${episodeIndex + 1}`;
  };

  return (
    <div className="bg-black min-h-screen text-white">
      {/* Poster and Title */}
      <div
        className="relative w-full h-[80vh] bg-cover bg-center"
        style={{ backgroundImage: `url(${posterLink})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 to-black/100"></div>
        <div className="absolute bottom-0 left-0 p-8">
          <h1 className="text-4xl md:text-5xl font-bold">{title}</h1>
          <p className="text-lg md:text-xl max-w-2xl mt-4 text-gray-300">
            {desc}
          </p>
        </div>
      </div>

      {/* Series Info */}
      <div className="max-w-5xl mx-auto p-6 mt-8">
        {/* React Player */}
        <div className="mt-8">
          <ReactPlayer
            url={videoURL}
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

        {/* Dropdown for Seasons */}
        <div className="mb-6 mt-3">
          <label htmlFor="season-select" className="text-lg font-semibold">
            Select Season:
          </label>
          <select
            id="season-select"
            className="ml-4 bg-gray-800 text-white p-2 rounded-md"
            onChange={handleSeasonChange}
            value={currentSeason}
          >
            {seriesContent.seasonsLinks.map((_, index) => (
              <option key={index} value={index}>
                Season {index + 1}
              </option>
            ))}
          </select>
        </div>

        {seasonLoading ? (
          <div className="flex gap-2 items-center justify-center">
            <AiOutlineLoading3Quarters className="animate-spin text-white text-4xl" />
            <p className="text-gray-300 text-lg font-semibold">Loading...</p>
          </div>
        ) : (
          <>
            {/* Episode List with Pagination */}
            <h2 className="text-2xl font-semibold mb-4">Episodes</h2>
            <div className="space-y-4">
              {episodesToDisplay.map((episodeLink, index) => {
                const globalEpisodeIndex =
                  (currentPage - 1) * episodesPerPage + index;
                return (
                  <div
                    key={index}
                    onClick={() =>
                      handleEpisodeClick(globalEpisodeIndex, episodeLink)
                    }
                    className={`block cursor-pointer ${
                      currentEpisode === globalEpisodeIndex
                        ? "bg-gray-600"
                        : "bg-gray-800 hover:bg-gray-700"
                    } p-4 rounded-md`}
                  >
                    Episode {globalEpisodeIndex + 1}
                  </div>
                );
              })}
            </div>

            {/* Pagination */}
            <div className="mt-6 flex justify-between">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className={`px-4 py-2 ${
                  currentPage === 1 ? "bg-gray-600" : "bg-gray-800"
                } text-white rounded-md`}
              >
                Previous
              </button>
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={`px-4 py-2 ${
                  currentPage === totalPages ? "bg-gray-600" : "bg-gray-800"
                } text-white rounded-md`}
              >
                Next
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default SeriesStream;
