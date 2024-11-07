'use client'

import { useEffect, useState, useCallback } from 'react'
import { Button } from "@/components/ui/button"
import { Play } from "lucide-react"
import axios from 'axios'
import { useNavigate } from "react-router-dom"

interface Movie {
  backdrop_path: string
  title: string
  overview: string
  id: number
}

export default function Component() {
  const [movies, setMovies] = useState<Movie[]>([])
  const [loading, setLoading] = useState(true)
  const [currentMovieIndex, setCurrentMovieIndex] = useState(0)
  const [imageLoaded, setImageLoaded] = useState(false)
  const [showContent, setShowContent] = useState(false)
  const navigate = useNavigate()
  const [isPaused, setIsPaused] = useState(false)

  useEffect(() => {
    const fetchMovies = async () => {
      const options = {
        method: 'GET',
        url: 'https://api.themoviedb.org/3/movie/popular?language=en-US&page=2',
        headers: {
            accept: "application/json",
            Authorization:
              "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJkZDg2MjI4NzlhZmUxOGY5OTc2NDJmOWYzNzc3N2FjMiIsIm5iZiI6MTczMDY3MjA3MS4zNjUwMzcsInN1YiI6IjY3MjdmNDA0NTU1ZTNlZmM4OWMzMmY5NCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.7ST0b4zGR7UynUdSV5ANEKDjpzrxh9nitsPrz8cqx6w",
          },
      };
  
      try {
        setLoading(true);
        const response = await axios.request<{ results: Movie[] }>(options);
        console.log("Movies fetched:", response.data.results); // Log the movies data
        setMovies(response.data.results);
      } catch (error) {
        console.error("Error fetching movies:", error);
      } finally {
        setLoading(false);
      }
    };
  
    fetchMovies();
  }, []);

  const handleMovieClick = useCallback(
    (movieId: number) => {
      navigate(`/videopage/${movieId}`)
    },
    [navigate]
  )
  

  useEffect(() => {
    if (movies.length > 0 && !isPaused) {
      const interval = setInterval(() => {
        setCurrentMovieIndex((prevIndex) => (prevIndex + 1) % movies.length)
        setImageLoaded(false)
        setShowContent(false)
      }, 3000)

      return () => clearInterval(interval)
    }
  }, [movies, isPaused])

  useEffect(() => {
    if (imageLoaded) {
      const timer = setTimeout(() => {
        setShowContent(true)
      }, 300)
      return () => clearTimeout(timer)
    }
  }, [imageLoaded])

  if (loading || movies.length === 0) {
    return (
      <div className="w-full h-[300px] sm:h-[300px] md:h-[400px] lg:h-[500px] bg-gradient-to-br from-purple-900/10 to-pink-600/5 animate-pulse rounded-2xl sm:rounded-3xl">
        <div className="h-full w-full bg-muted/20 backdrop-blur-xl rounded-2xl sm:rounded-3xl" />
      </div>
    )
  }

  const currentMovie = movies[currentMovieIndex]

  return (
    <div 
      className="relative w-full h-[300px] sm:h-[400px] md:h-[400px] lg:h-[470px] overflow-hidden rounded-2xl sm:rounded-3xl"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="absolute inset-0 transition-opacity duration-1000 ease-in-out">
        <img
          src={`https://image.tmdb.org/t/p/original${currentMovie.backdrop_path}`}
          alt={currentMovie.title}
          className="absolute inset-0 w-full h-full object-cover"
          onLoad={() => setImageLoaded(true)}
        />
        {/* Glossy overlay gradients */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
      </div>
      
      {/* Content */}
      <div className={`relative h-full flex flex-col justify-end p-4 sm:p-6 md:p-8 lg:p-10 transition-opacity duration-500 ease-in-out ${showContent ? 'opacity-100' : 'opacity-0'}`}>
        <div className="max-w-3xl space-y-2 sm:space-y-4 md:space-y-6">
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-white tracking-tight leading-none">
            {currentMovie.title}
          </h1>
          <p className="text-sm sm:text-base md:text-lg lg:text-xl text-white/90 line-clamp-2 sm:line-clamp-3 font-medium leading-relaxed">
            {currentMovie.overview}
          </p>
          <Button
          onClick={() => handleMovieClick(currentMovie.id)}
            size="sm"
            className="h-8 sm:h-10 md:h-12 lg:h-14 px-4 sm:px-6 md:px-8 rounded-full bg-white hover:bg-white/90 text-black font-semibold text-xs sm:text-sm md:text-base lg:text-lg transition-all duration-300 ease-in-out transform hover:scale-105"
          >
            <Play className="mr-2 h-3 w-3 sm:h-4 sm:w-4 md:h-5 md:w-5 fill-black" />
            Watch
          </Button>
        </div>
      </div>
      
      {/* Glass reflection effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />

      {/* Bubble dots */}
      <div className="absolute bottom-2 sm:bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-1 sm:space-x-2">
        {movies.map((_, index) => (
          <div
            key={index}
            className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full transition-all duration-300 ${
              index === currentMovieIndex ? 'bg-white scale-125' : 'bg-white/50'
            }`}
          />
        ))}
      </div>
    </div>
  )
}