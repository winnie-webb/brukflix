import React from "react";

const SkeletonLoader = () => {
  // Set the number of skeletons to show based on screen size
  const smallScreenSkeletons = 2; // For small screens (mobile)
  const mediumScreenSkeletons = 5; // For medium screens (tablet)
  const largeScreenSkeletons = 9; // For large screens (desktop)

  return (
    <div className="animate-pulse">
      <div className="h-6 bg-gray-300 rounded w-48 mb-4"></div>

      {/* Skeletons for small screens */}
      <div className="flex space-x-4 sm:hidden">
        {Array.from({ length: smallScreenSkeletons }).map((_, index) => (
          <div key={index} className="w-40 h-60 bg-gray-300 rounded-lg"></div>
        ))}
      </div>

      {/* Skeletons for medium screens */}
      <div className="hidden sm:flex space-x-4 lg:hidden">
        {Array.from({ length: mediumScreenSkeletons }).map((_, index) => (
          <div key={index} className="w-40 h-60 bg-gray-300 rounded-lg"></div>
        ))}
      </div>

      {/* Skeletons for large screens */}
      <div className="hidden lg:flex space-x-4">
        {Array.from({ length: largeScreenSkeletons }).map((_, index) => (
          <div key={index} className="w-40 h-60 bg-gray-300 rounded-lg"></div>
        ))}
      </div>
    </div>
  );
};

export default SkeletonLoader;
