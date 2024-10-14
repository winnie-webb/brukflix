/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import React from "react";

const MovieCard = ({ title, imageUrl, link }) => {
  return (
    <Link href={`/${link.split("/")[3]}`}>
      <div className="">
        <img
          className="w-full h-60 object-cover rounded-xl"
          data-src={imageUrl}
          src="/loading.jpg"
          alt={title}
          loading="lazy"
          onLoad={(e) => {
            console.log(e.target);
            e.target.src = e.target.getAttribute("data-src");
          }}
        />
      </div>
    </Link>
  );
};

export default MovieCard;
