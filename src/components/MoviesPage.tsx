"use client"

import { useEffect, useState, useCallback } from "react"
import axios from "axios"
import { useNavigate, useLocation } from "react-router-dom"
import useEmblaCarousel from "embla-carousel-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"
import Banner from "./Banner"

type Movie = {
  id: number
  title: string
  release_date: string
  poster_path: string
}

export default function MoviesPage() {
  const [movies, setMovies] = useState<Movie[]>([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()
  const location = useLocation()

  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    align: "start",
    slidesToScroll: 1,
  })

  const scrollPrev = useCallback(() => emblaApi && emblaApi.scrollPrev(), [emblaApi])
  const scrollNext = useCallback(() => emblaApi && emblaApi.scrollNext(), [emblaApi])

  const fetchMovies = useCallback(async (page: number) => {
    const options = {
      method: "GET",
      url: `https://api.themoviedb.org/3/movie/popular?language=en-US&page=${page}`,
      headers: {
        accept: "application/json",
        Authorization:
          "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJkZDg2MjI4NzlhZmUxOGY5OTc2NDJmOWYzNzc3N2FjMiIsIm5iZiI6MTczMDY3MjA3MS4zNjUwMzcsInN1YiI6IjY3MjdmNDA0NTU1ZTNlZmM4OWMzMmY5NCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.7ST0b4zGR7UynUdSV5ANEKDjpzrxh9nitsPrz8cqx6w",
      },
    }

    try {
      setLoading(true)
      const response = await axios.request(options)
      setMovies(response.data.results)
    } catch (error) {
      console.error("Error fetching movies:", error)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    const params = new URLSearchParams(location.search)
    const page = parseInt(params.get("page") || "1", 10)
    fetchMovies(page)
  }, [location.search, fetchMovies])

  const handleMovieClick = useCallback(
    (movieId: number) => {
      navigate(`/videopage/${movieId}`)
    },
    [navigate]
  )

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>
  }

  return (
    <div className="w-full px-4 py-4">
      <Banner />
      <div className="max-w-8xl mt-4 mx-auto">
        <h2 className="text-3xl font-bold mb-4 ml-2 text-white">Popular Movies</h2>
        <div className="relative">
          <div className="overflow-hidden" ref={emblaRef}>
            <div className="flex gap-4 md:gap-5 lg:gap-6 pl-4">
              {movies.map((movie) => (
                <div
                  key={movie.id}
                  className="flex-[0_0_80%] min-w-0 sm:flex-[0_0_40%] md:flex-[0_0_40%] lg:flex-[0_0_25%] xl:flex-[0_0_18%]"
                >
                  <Card
                    className="overflow-hidden cursor-pointer group relative bg-transparent border-0"
                    onClick={() => handleMovieClick(movie.id)}
                  >
                    <CardContent className="p-0 relative">
                      <div className="relative rounded-3xl overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent z-10" />
                        <img
                          src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                          alt={movie.title}
                          className="w-full h-[220px] sm:h-[300px] object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                        <div className="absolute bottom-0 left-0 right-0 p-4 z-20">
                          <h2 className="font-semibold text-lg md:text-xl text-white mb-1 drop-shadow-lg line-clamp-1">
                            {movie.title}
                          </h2>
                          <p className="text-sm text-gray-300">{movie.release_date.split("-")[0]}</p>
                        </div>
                      </div>
                      <div className="absolute inset-0 rounded-3xl transition-opacity duration-300 opacity-0 group-hover:opacity-100 bg-black/10 backdrop-blur-sm z-30" />
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>
          </div>
          <Button
            variant="outline"
            size="icon"
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 hidden md:flex bg-white/10 backdrop-blur-md hover:bg-white/20 border-0 rounded-full w-12 h-12"
            onClick={scrollPrev}
          >
            <ChevronLeft className="h-6 w-6 text-white" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 hidden md:flex bg-white/10 backdrop-blur-md hover:bg-white/20 border-0 rounded-full w-12 h-12"
            onClick={scrollNext}
          >
            <ChevronRight className="h-6 w-6 text-white" />
          </Button>
        </div>
      </div>
    </div>
  )
}