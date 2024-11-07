'use client'

import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Play, User2, Image as ImageIcon } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface TvShow {
  id: number
  name: string
  first_air_date: string
  episode_run_time: number[]
  overview: string
  backdrop_path: string
  seasons: Season[]
}

interface Season {
  season_number: number
  name: string
  episode_count: number
}

interface Episode {
  episode_number: number
  name: string
}

interface CastMember {
  id: number
  name: string
  character: string
  profile_path: string | null
}

interface SimilarShow {
  id: number
  name: string
  poster_path: string | null
}

interface ImageData {
  backdrops: { file_path: string }[]
  posters: { file_path: string }[]
}

export default function Component() {
  const { movieId } = useParams<{ movieId: string }>()
  const navigate = useNavigate()
  const [tvShow, setTvShow] = useState<TvShow | null>(null)
  const [cast, setCast] = useState<CastMember[]>([])
  const [similar, setSimilar] = useState<SimilarShow[]>([])
  const [images, setImages] = useState<ImageData>({ backdrops: [], posters: [] })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showVideo, setShowVideo] = useState(false)
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [selectedSeason, setSelectedSeason] = useState<number>(1)
  const [selectedEpisode, setSelectedEpisode] = useState<number>(1)
  const [episodes, setEpisodes] = useState<Episode[]>([])

  useEffect(() => {
    const fetchTvData = async () => {
      try {
        const options = {
          method: 'GET',
          headers: {
            accept: 'application/json',
            Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJkZDg2MjI4NzlhZmUxOGY5OTc2NDJmOWYzNzc3N2FjMiIsIm5iZiI6MTczMDY3MjA3MS4zNjUwMzcsInN1YiI6IjY3MjdmNDA0NTU1ZTNlZmM4OWMzMmY5NCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.7ST0b4zGR7UynUdSV5ANEKDjpzrxh9nitsPrz8cqx6w'
          }
        }

        const [tvRes, castRes, similarRes, imagesRes] = await Promise.all([
          fetch(`https://api.themoviedb.org/3/tv/${movieId}?language=en-US`, options).then(res => res.json()),
          fetch(`https://api.themoviedb.org/3/tv/${movieId}/credits?language=en-US`, options).then(res => res.json()),
          fetch(`https://api.themoviedb.org/3/tv/${movieId}/similar?language=en-US`, options).then(res => res.json()),
          fetch(`https://api.themoviedb.org/3/tv/${movieId}/images`, options).then(res => res.json())
        ])

        setTvShow(tvRes)
        setCast(castRes.cast.slice(0, 7))
        setSimilar(similarRes.results.slice(0, 6))
        setImages({
          backdrops: imagesRes.backdrops.slice(0, 8),
          posters: imagesRes.posters.slice(0, 4)
        })
        setLoading(false)
      } catch (err) {
        console.error(err)
        setError('Failed to fetch TV show data')
        setLoading(false)
      }
    }

    fetchTvData()
    setShowVideo(false)
    setSelectedImage(null)
  }, [movieId])

  useEffect(() => {
    const fetchEpisodes = async () => {
      if (!tvShow) return
      try {
        const options = {
          method: 'GET',
          headers: {
            accept: 'application/json',
            Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJkZDg2MjI4NzlhZmUxOGY5OTc2NDJmOWYzNzc3N2FjMiIsIm5iZiI6MTczMDY3MjA3MS4zNjUwMzcsInN1YiI6IjY3MjdmNDA0NTU1ZTNlZmM4OWMzMmY5NCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.7ST0b4zGR7UynUdSV5ANEKDjpzrxh9nitsPrz8cqx6w'
          }
        }
        const res = await fetch(`https://api.themoviedb.org/3/tv/${movieId}/season/${selectedSeason}?language=en-US`, options)
        const data = await res.json()
        setEpisodes(data.episodes)
      } catch (err) {
        console.error(err)
        setError('Failed to fetch episodes')
      }
    }

    fetchEpisodes()
  }, [movieId, selectedSeason, tvShow, showVideo])

  const handleSimilarMovieClick = (similarMovieId: number) => {
    navigate(`/tv-videopage/${similarMovieId}`)
    window.scrollTo(0, 0)
  }

  const handleEpisodeChange = () => {
    if (showVideo) {
      setShowVideo(false)
      setTimeout(() => setShowVideo(true), 100)
    }
  }

  if (loading) return (
    <div className="flex justify-center items-center min-h-screen bg-gray-900">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-pink-500"></div>
    </div>
  )

  if (error) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <div className="bg-red-900 text-red-100 p-4 rounded-lg">
        Error: {error}
      </div>
    </div>
  )

  if (!tvShow) return null

  return (
    <div className="min-h-screen bg-gray-900">
      {selectedImage && (
        <div
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
        >
          <img
            src={`https://image.tmdb.org/t/p/original${selectedImage}`}
            alt="Gallery"
            className="max-w-full max-h-[90vh] object-contain"
          />
        </div>
      )}

      <div className="relative min-h-screen md:h-screen">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url(https://image.tmdb.org/t/p/original${tvShow.backdrop_path})`
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-gray-900 via-gray-900/70 to-transparent">
            <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/30 to-transparent" />
          </div>
        </div>

        <div className="relative h-full max-w-7xl mx-auto px-4 sm:px-6 py-12 flex flex-col justify-center">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-4">{tvShow.name}</h1>
          <div className="flex flex-wrap items-center gap-4 mb-8">
            <span className="text-pink-500 font-medium">{tvShow.first_air_date.split('-')[0]}</span>
            <span className="text-gray-400 hidden sm:inline">•</span>
            <span className="text-gray-400">{tvShow.episode_run_time[0]} min</span>
            <span className="text-gray-400 hidden sm:inline">•</span>
            <div className="flex items-center gap-2">
              <span className="bg-pink-500 text-white px-2 py-0.5 rounded text-sm">HD</span>
            </div>
          </div>

          <p className="text-gray-300 max-w-2xl mb-8 text-sm sm:text-base">{tvShow.overview}</p>

          <div className="flex flex-col sm:flex-row gap-4 mb-8">
            <Select onValueChange={(value) => { setSelectedSeason(Number(value)); handleEpisodeChange(); }}>
              <SelectTrigger className="w-full sm:w-[180px] bg-black">
                <SelectValue placeholder="Season 1" />
              </SelectTrigger>
              <SelectContent>
                {tvShow.seasons.map((season) => (
                  <SelectItem key={season.season_number} value={season.season_number.toString()}>
                    {season.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select onValueChange={(value) => { setSelectedEpisode(Number(value)); handleEpisodeChange(); }}>
              <SelectTrigger className="w-full sm:w-[180px] bg-black">
                <SelectValue placeholder="Episode 1" />
              </SelectTrigger>
              <SelectContent>
                {episodes.map((episode) => (
                  <SelectItem key={episode.episode_number} value={episode.episode_number.toString()}>
                    Episode {episode.episode_number}: {episode.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {showVideo ? (
            <div className="aspect-video w-full max-w-7xl mx-auto bg-black rounded-xl overflow-hidden shadow-2xl">
              <iframe
                src={`https://vidsrc.cc/v2/embed/tv/${movieId}/${selectedSeason}/${selectedEpisode}/?autoplay=true`}
                className="aspect-video w-full h-full rounded-lg relative"
                width="1280"
                height="720"
                title="Video player"
                frameBorder="0"
                allowFullScreen
                sandbox="allow-same-origin allow-scripts allow-presentation"
              ></iframe>
            </div>
          ) : (
            <Button
              onClick={() => setShowVideo(true)}
              className="flex items-center gap-2 bg-pink-500 hover:bg-pink-600 text-white px-8 py-3 rounded-full w-fit transition-colors"
            >
              <Play className="h-5 w-5" />
              <span>Watch Now</span>
            </Button>
          )}
        </div>
      </div>

      {/* Cast Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <h2 className="text-xl sm:text-2xl font-bold text-white mb-6">Cast</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-4">
          {cast.map((actor) => (
            <div key={actor.id} className="space-y-2">
              {actor.profile_path ? (
                <img
                  src={`https://image.tmdb.org/t/p/w185${actor.profile_path}`}
                  alt={actor.name}
                  className="w-full h-40 object-cover rounded-lg"
                />
              ) : (
                <div className="w-full h-40 bg-gray-800 rounded-lg flex items-center justify-center">
                  <User2 className="h-8 w-8 text-gray-600" />
                </div>
              )}
              <p className="text-white text-sm font-medium">{actor.name}</p>
              <p className="text-gray-400 text-xs sm:text-sm">{actor.character}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Gallery Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <h2 className="text-xl sm:text-2xl font-bold text-white mb-6">Gallery</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {images.backdrops.map((image, index) => (
            <button
              key={index}
              onClick={() => setSelectedImage(image.file_path)}
              className="relative group aspect-video bg-gray-800 rounded-lg overflow-hidden"
            >
              <img
                src={`https://image.tmdb.org/t/p/w780${image.file_path}`}
                alt={`Scene ${index + 1}`}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-colors flex items-center justify-center">
                <ImageIcon className="text-white/0 group-hover:text-white/100 transition-colors h-8 w-8" />
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Similar Shows */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <h2 className="text-xl sm:text-2xl font-bold text-white mb-6">Similar shows</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {similar.map((show) => (
            <button
              key={show.id}
              onClick={() => handleSimilarMovieClick(show.id)}
              className="space-y-2 text-left group"
            >
              <div className="relative overflow-hidden rounded-lg">
                <img
                  src={`https://image.tmdb.org/t/p/w342${show.poster_path}`}
                  alt={show.name}
                  className="w-full h-48 sm:h-64 object-cover transform group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-colors flex items-center justify-center">
                  <Play className="text-white/0 group-hover:text-white/100 transition-colors h-8 w-8" />
                </div>
              </div>
              <p className="text-white text-sm font-medium truncate">{show.name}</p>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}