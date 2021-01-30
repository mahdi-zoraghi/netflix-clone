import { useState, useEffect, useContext } from "react"
import { Splide, SplideSlide } from "@splidejs/react-splide"
import YouTube from "react-youtube"

import darkModeContext from "./context/darkModeContext"

import axios from "./axios"

import "@splidejs/splide/dist/css/themes/splide-default.min.css"

import "./Row.css"

const baseUrl = "https://image.tmdb.org/t/p/original/"

function Row({ title, fetchUrl, isLargeRow }) {
  const [movies, setMovies] = useState([])
  const [trailerUrl, setTrailerUrl] = useState("")
  const [trailerNotfont, setTrailerNotfont] = useState(false)

  const { darkMode: isDarkMode } = useContext(darkModeContext)

  useEffect(() => {
    const fetchData = async () => {
      const request = await axios.get(fetchUrl)
      setMovies(request.data.results)
    }
    fetchData()
  }, [fetchUrl])

  const opts = {
    height: "390",
    width: "100%",
    playerVars: {
      autoplay: 1,
    },
  }
  const handleClick = movie => {
    if (trailerUrl) {
      setTrailerUrl("")
    }
    if (trailerNotfont) {
      setTrailerNotfont(false)
    } else {
      const apiKey = "544e43e44f9e7cd3bb822c8188a5c499"
      const endpoint = `https://api.themoviedb.org/3/movie/${movie.id}/videos?api_key=${apiKey}`

      fetch(endpoint)
        .then(res => res.json())
        .then(({ results }) => {
          if (results && results[0]) {
            setTrailerUrl(results[0].key)
          } else {
            setTimeout(() => {
              setTrailerNotfont(true)
              setTrailerUrl("")
            }, 500)
          }
        })
        .catch(err => {
          setTrailerNotfont(true)
          setTrailerUrl("")
        })
    }
  }

  return (
    <div className="row" style={{ color: isDarkMode ? "white" : "black" }}>
      <h2>{title}</h2>

      <div className="row__posters">
        <Splide
          options={{
            rewind: true,
            gap: "1rem",
            perPage: 5,
            pagination: false,
            type: "loop",
            padding: {
              right: "5rem",
              left: "5rem",
            },
          }}
        >
          {movies.map(movie =>
            movie.poster_path && movie.backdrop_path !== null ? (
              <SplideSlide key={movie.id}>
                <img
                  key={movie.id}
                  onClick={() => handleClick(movie)}
                  className={`row__poster ${isLargeRow && "row__posterLarge"}`}
                  src={`${baseUrl}${
                    isLargeRow ? movie.poster_path : movie.backdrop_path
                  }`}
                  alt={movie.name}
                />
              </SplideSlide>
            ) : null
          )}
        </Splide>
      </div>

      {/* <div className="row__posters">
        {movies.map(movie =>
          movie.poster_path && movie.backdrop_path !== null ? (
            <img
              key={movie.id}
              onClick={() => handleClick(movie)}
              className={`row__poster ${isLargeRow && "row__posterLarge"}`}
              src={`${baseUrl}${
                isLargeRow ? movie.poster_path : movie.backdrop_path
              }`}
              alt={movie.name}
            />
          ) : null
        )}
      </div> */}
      {trailerNotfont && (
        <h1 style={{ textAlign: "center" }}>Trailer Not Found</h1>
      )}
      {trailerUrl && <YouTube videoId={trailerUrl} opts={opts} />}
    </div>
  )
}

export default Row
