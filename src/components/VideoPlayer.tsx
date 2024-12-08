import { useState, useEffect } from "react";

type VideoPlayerProps = {
  movieId: number;
};

export default function VideoPlayer({ movieId }: VideoPlayerProps) {
  const [videoSource, setVideoSource] = useState<string>(
    `https://vidsrc.cc/v2/embed/movie/${movieId}?autoplay=true`
  );
  const [error, setError] = useState<boolean>(false);

  useEffect(() => {
    if (error) {
      // Fallback to Vidbinge API if the primary source fails
      setVideoSource(`https://vidbinge.com/embed/${movieId}`);
    }
  }, [error, movieId]);