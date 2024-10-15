import React from "react";
import MovieCard from "./MovieCard";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";

const MovieList = ({ movies, title }) => {
  return (
    <>
      <h2 className="text-3xl font-medium p-2">{title}</h2>
      <div className="">
        <Swiper
          navigation
          pagination={{ clickable: true }}
          breakpoints={{
            2500: {
              slidesPerView: 17.5,
              spaceBetween: 10,
            },
            1400: {
              slidesPerView: 9.5,
              spaceBetween: 10,
            },
            1024: {
              slidesPerView: 7.5,
              spaceBetween: 10,
            },
            600: {
              slidesPerView: 4.5,
              spaceBetween: 5,
            },
            480: {
              slidesPerView: 3.5,
              spaceBetween: 5,
            },
            320: {
              slidesPerView: 2.5,
              spaceBetween: 5,
            },
          }}
        >
          {movies.map((movie, index) => (
            <SwiperSlide key={index}>
              <MovieCard
                title={movie.title}
                imageUrl={movie.imageUrl}
                link={movie.link}
              />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </>
  );
};

export default MovieList;
