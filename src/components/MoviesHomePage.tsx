import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import useEmblaCarousel from "embla-carousel-react";
import Banner from "@/components/BannerMovie";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

// Type definition for a movie
type Movie = {
  id: number;
  title: string;
  release_date: string;
  poster_path: string;
};

export default function MoviesPage() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { page } = useParams(); // Extract the page parameter from the URL

  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    align: "start",
    slidesToScroll: 1,
  });

  const scrollPrev = useCallback(() => emblaApi && emblaApi.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi && emblaApi.scrollNext(), [emblaApi]);

  const fetchMovies = useCallback(async (page: number) => {
    const apiKey = import.meta.env.VITE_TMDB_API_KEY; // Using Vite environment variables
    const options = {
      method: "GET",
      url: `https://api.themoviedb.org/3/movie/popular?language=en-US&page=${page}`,
      headers: {
        accept: "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
    };

    try {
      setLoading(true);
      const response = await axios.request(options);
      setMovies(response.data.results);
    } catch (error) {
      console.error("Error fetching movies:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const currentPage = parseInt(page || "1", 10);
    fetchMovies(currentPage);
  }, [page, fetchMovies]);

  const handleMovieClick = useCallback(
    (movieId: number) => {
      navigate(`/videopage/${movieId}`);
    },
    [navigate]
  );

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  return (
    <div className="w-full px-4 mt-3">
      <Banner />
      <div className="max-w-8xl mt-4 mx-auto">
      <div className="flex items-center justify-between mb-4 ml-2">
          <h2 className="text-3xl font-bold text-white">Popular Movies</h2>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="icon"
              className="md:flex bg-white/10 backdrop-blur-md hover:bg-white/20 border-0 rounded-full w-10 h-10"
              onClick={scrollPrev}
            >
              <ChevronLeft className="h-5 w-5 text-white" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="md:flex bg-white/10 backdrop-blur-md hover:bg-white/20 border-0 rounded-full w-10 h-10"
              onClick={scrollNext}
            >
              <ChevronRight className="h-5 w-5 text-white" />
            </Button>
          </div>
        </div>
        <div className="relative">
          <div className="overflow-hidden" ref={emblaRef}>
            <div className="flex gap-4 md:gap-5 lg:gap-6 pl-4">
              {movies.map((movie) => (
                <div
                  key={movie.id}
                  className="flex-[0_0_50%] min-w-0 sm:flex-[0_0_20%] md:flex-[0_0_30%] lg:flex-[0_0_20%] xl:flex-[0_0_14%]"
                >
                  <Card
                    className="overflow-hidden cursor-pointer group relative bg-transparent border-0"
                    onClick={() => handleMovieClick(movie.id)}
                  >
                    <CardContent className="p-0 relative">
                      <div className="relative rounded-xl overflow-hidden">
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
        </div>
      </div>
      <p className="hidden sm:flex justify-center items-center mt-6 mb-6 text-gray-600">
  This site does not store any files on the server; we only link to the media hosted on 3rd party services.
</p>
    </div>
  );
}