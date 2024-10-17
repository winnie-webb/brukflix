"use client";
import React, { useEffect, useState } from "react";
import ReactPlayer from "react-player";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { MdError } from "react-icons/md";
import { usePathname } from "next/navigation";
import Link from "next/link";
import fetchStreamData from "./fetchStreamData";

const SeriesStream = () => {
  const path = usePathname();
  const url = `https://ww1.goojara.to/${path.split("/")[3]}`;
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
  const [currentSeason, setCurrentSeason] = useState(0); // Index of selected season
  const [currentPage, setCurrentPage] = useState(1); // For episode pagination
  const episodesPerPage = 5; // Limit episodes per page
  useEffect(() => {
    fetchStreamData(url, setStreamData, setLoading, setError);
  }, [url]);

  // Render loading state
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

  // Handle case when there's an error or empty streamData
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
    setCurrentPage(1); // Reset pagination to page 1 when changing seasons

    const currentSeasonURL = `${
      streamData.seriesContent.seasonsLinks[selectedSeason].split("?")[0]
    }?s=${selectedSeason + 1}`;

    try {
      // Fetch data for the selected season
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
          episodesLinks: data.episodesLinks, // Update episodes for the selected season
        },
      }));
    } catch (err) {
      setError(err.message);
    }
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

        {/* Episode List with Pagination */}
        <h2 className="text-2xl font-semibold mb-4">Episodes</h2>
        <div className="space-y-4">
          {episodesToDisplay.map((episodeLink, index) => (
            <Link
              href={`/stream/series${episodeLink}`} // Make sure to use the correct episode link
              key={index}
              className="block"
            >
              <div className="bg-gray-800 hover:bg-gray-700 p-4 rounded-md">
                Episode {(currentPage - 1) * episodesPerPage + index + 1}{" "}
                {/* Adjust episode number */}
              </div>
            </Link>
          ))}
        </div>

        {/* Pagination Controls */}
        <div className="flex justify-between items-center mt-6">
          <button
            className="bg-gray-800 text-white p-2 rounded-md"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            Previous
          </button>
          <span className="text-gray-400">
            Page {currentPage} of {totalPages}
          </span>
          <button
            className="bg-gray-800 text-white p-2 rounded-md"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default SeriesStream;
