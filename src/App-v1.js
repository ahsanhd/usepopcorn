import { useEffect, useState } from "react";
import StarRate from "./StarRate";

const tempMovieData = [
  {
    imdbID: "tt1375666",
    Title: "Inception",
    Year: "2010",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_SX300.jpg",
  },
  {
    imdbID: "tt0133093",
    Title: "The Matrix",
    Year: "1999",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BNzQzOTk3OTAtNDQ0Zi00ZTVkLWI0MTEtMDllZjNkYzNjNTc4L2ltYWdlXkEyXkFqcGdeQXVyNjU0OTQ0OTY@._V1_SX300.jpg",
  },
  {
    imdbID: "tt6751668",
    Title: "Parasite",
    Year: "2019",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BYWZjMjk3ZTItODQ2ZC00NTY5LWE0ZDYtZTI3MjcwN2Q5NTVkXkEyXkFqcGdeQXVyODk4OTc3MTY@._V1_SX300.jpg",
  },
];

const tempWatchedData = [
  {
    imdbID: "tt1375666",
    Title: "Inception",
    Year: "2010",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_SX300.jpg",
    runtime: 148,
    imdbRating: 8.8,
    userRating: 10,
  },
  {
    imdbID: "tt0088763",
    Title: "Back to the Future",
    Year: "1985",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BZmU0M2Y1OGUtZjIxNi00ZjBkLTg1MjgtOWIyNThiZWIwYjRiXkEyXkFqcGdeQXVyMTQxNzMzNDI@._V1_SX300.jpg",
    runtime: 116,
    imdbRating: 8.5,
    userRating: 9,
  },
];

//  KEY ==  9d776b80
const KEY = "9d776b80";

const average = (arr) =>
  arr.reduce((acc, cur, i, arr) => acc + cur / arr.length, 0);

export default function App() {
  const [query, setQuery] = useState("office");
  const [movies, setMovies] = useState([]);
  const [watched, setWatched] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedID, setSelectedID] = useState(null);
  const [error, setError] = useState("");

  // useEffect(function () {
  //   console.log("A");
  // }, []);

  // useEffect(() => {
  //   console.log("B");
  // });

  function handleWatchedMovie(movies) {
    setWatched((movie) => [...movie, movies]);
  }

  function handleSelectedId(id) {
    setSelectedID((prev) => (prev === id ? null : id));
  }

  function handleBack() {
    setSelectedID(null);
  }
  function handleDeleteWatchedMovie(id) {
    setWatched((watched) => watched.filter((movie) => movie.imdbID !== id));
  }
  useEffect(
    function () {
      const controller = new AbortController();
      async function fetchMovies() {
        try {
          setIsLoading(true);
          setError("");
          const res = await fetch(
            `https://www.omdbapi.com/?apikey=${KEY}&s=${query}`,
            { signal: controller.signal }
          );

          if (!res.ok)
            throw new Error(
              "There was some error boi in fetching your shitty movie"
            );

          const data = await res.json();
          console.log(data);
          if (data.Response === "False")
            throw new Error("Sorry Apki Tati Movie Nahi Milee Movie Not Found");

          setMovies(data.Search);
          setError("");
        } catch (err) {
          console.error(err);
          if (err.name !== "AbortError") setError(err.message);
        } finally {
          setIsLoading(false);
        }
      }
      if (query.length < 3) {
        setMovies([]);
        setError("");
        return;
      }
      handleBack();
      fetchMovies();
      return function () {
        controller.abort();
      };
    },
    [query]
  );

  // useEffect(function () {
  //   fetch(`https://www.omdbapi.com/?apikey=${KEY}&s=American Beauty`)
  //     .then((res) => res.json())
  //     .then((data) => setMovies(data.Search));
  // }, []);

  return (
    <>
      <NavBar>
        <Search query={query} setQuery={setQuery} />
        <NumResult movies={movies} />
      </NavBar>

      <Main>
        <Box>
          {isLoading && <Loader />}
          {!isLoading && !error && (
            <MoviesList movies={movies} onSelectedId={handleSelectedId} />
          )}
          {error && <ErrorMessage message={error} />}
        </Box>
        <Box>
          {selectedID ? (
            <MovieDetails
              selectedID={selectedID}
              onSelectedId={handleSelectedId}
              onBack={handleBack}
              onWatchedMovie={handleWatchedMovie}
              watched={watched}
            />
          ) : (
            <>
              <WatchedSummary watched={watched} />
              <WatchedList
                watched={watched}
                onWatchedMovie={handleWatchedMovie}
                onDeleteWatchedMovie={handleDeleteWatchedMovie}
              />
            </>
          )}
        </Box>
      </Main>
    </>
  );
}

function NavBar({ children }) {
  return (
    <nav className="nav-bar">
      <Logo /> {children}
    </nav>
  );
}
function ErrorMessage({ message }) {
  return (
    <p className="error">
      <span>🚫</span> {message}
    </p>
  );
}
function Loader() {
  return <p className="loader">Sabar Kr War...</p>;
}

function Logo() {
  return (
    <div className="logo">
      <span role="img">🍿</span>
      <h1>usePopcorn</h1>
    </div>
  );
}

function Search({ query, setQuery }) {
  return (
    <input
      className="search"
      type="text"
      placeholder="Search movies..."
      value={query}
      onChange={(e) => setQuery(e.target.value)}
    />
  );
}

function NumResult({ movies }) {
  return (
    <p className="num-results">
      Found <strong>{movies.length}</strong> results
    </p>
  );
}

function Main({ children }) {
  return <main className="main">{children}</main>;
}

function Box({ children }) {
  const [isOpen, setIsOpen1] = useState(true);
  return (
    <div className="box">
      <button
        className="btn-toggle"
        onClick={() => setIsOpen1((open) => !open)}
      >
        {isOpen ? "–" : "+"}
      </button>
      {isOpen && children}
    </div>
  );
}

function MoviesList({ movies, onSelectedId }) {
  return (
    <ul className="list list-movies">
      {movies?.map((movie) => (
        <List movie={movie} key={movie.imdbID} onSelectedId={onSelectedId} />
      ))}
    </ul>
  );
}

function List({ movie, onSelectedId }) {
  return (
    <li onClick={() => onSelectedId(movie.imdbID)}>
      <img src={movie.Poster} alt={`${movie.Title} poster`} />
      <h3>{movie.Title}</h3>
      <div>
        <p>
          <span>🗓</span>
          <span>{movie.Year}</span>
        </p>
      </div>
    </li>
  );
}

/* function WatchedBox() {
  
  const [isOpen2, setIsOpen2] = useState(true);

  return (
    <div className="box">
      <WatchedSummary watched={watched} />
      <button
        className="btn-toggle"
        onClick={() => setIsOpen2((open) => !open)}
      >
        {isOpen2 ? "–" : "+"}
      </button>
      {isOpen2 && (
        <>
          <WatchedList watched={watched} />
        </>
      )}
    </div>
  );
}
*/

function MovieDetails({
  selectedID,
  onSelectedId,
  onBack,
  onWatchedMovie,
  watched,
}) {
  const [movie, setMovie] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [userRating, setUserRating] = useState("");
  const {
    Title: title,
    Year: year,
    Poster: poster,
    Runtime: runtime,
    imdbRating,
    Plot: plot,
    Released: released,
    Genre: genre,
    Actors: actors,
    Director: director,
  } = movie;
  const isWatched = watched.map((movie) => movie.imdbID).includes(selectedID);
  const watchedUserRating = watched.find(
    (movie) => movie.imdbID === selectedID
  )?.userRating;
  function handleAdd() {
    const newWatchedMovie = {
      imdbID: selectedID,
      year,
      runtime: Number(runtime.split(" ").at(0)),
      imdbRating: +imdbRating,
      poster,
      userRating,
    };
    onWatchedMovie(newWatchedMovie);
    onBack();
  }
  useEffect(
    function () {
      async function fetchMovieDetails() {
        setIsLoading(true);
        const res = await fetch(
          `https://www.omdbapi.com/?apikey=${KEY}&i=${selectedID}`
        );
        const data = await res.json();
        console.log(data);
        setMovie(data);
        setIsLoading(false);
      }
      fetchMovieDetails();
    },
    [selectedID]
  );

  useEffect(
    function () {
      if (!title) return;
      document.title = `Movie | ${title}`;
      return function () {
        document.title = "usePopCorn";
      };
    },
    [title]
  );

  useEffect(
    function () {
      const callback = (e) => {
        if (e.code === "Escape") onBack();
      };
      document.addEventListener("keydown", callback);
      return function () {
        document.removeEventListener("keydown", callback);
      };
    },
    [onBack]
  );
  return (
    <div className="details">
      {isLoading ? (
        <Loader />
      ) : (
        <>
          <header>
            <button className="btn-back" onClick={onBack}>
              &larr;
            </button>
            <img src={poster} alt={`Poster of ${title} `} />
            <div className="details-overview">
              <h2>{title}</h2>
              <p>
                {released} &bull; {runtime}
              </p>
              <p>{genre}</p>
              <p>
                <span>⭐️</span> {imdbRating} imdbID Rating
              </p>
            </div>
          </header>
          <section>
            <div className="rating">
              {!isWatched ? (
                <>
                  <StarRate
                    maxRating={10}
                    size={24}
                    onSetRating={setUserRating}
                  />
                  {userRating > 0 && (
                    <button className="btn-add" onClick={() => handleAdd()}>
                      + Add To List
                    </button>
                  )}
                </>
              ) : (
                <p>
                  You Rated this movie with {watchedUserRating}
                  <span>⭐</span>
                </p>
              )}
            </div>
            <p>
              <em>{plot}</em>
            </p>
            <p>Starring {actors}</p>
            <p>Directed By {director}</p>
          </section>
        </>
      )}
    </div>
  );
}
function WatchedSummary({ watched }) {
  const avgImdbRating = average(watched.map((movie) => movie.imdbRating));
  const avgUserRating = average(watched.map((movie) => movie.userRating));
  const avgRuntime = average(watched.map((movie) => movie.runtime));
  return (
    <div className="summary">
      <h2>Movies you watched</h2>
      <div>
        <p>
          <span>#️⃣</span>
          <span>{watched.length} movies</span>
        </p>
        <p>
          <span>⭐️</span>
          <span>{avgImdbRating.toFixed(2)}</span>
        </p>
        <p>
          <span>🌟</span>
          <span>{avgUserRating.toFixed(2)}</span>
        </p>
        <p>
          <span>⏳</span>
          <span>{avgRuntime} min</span>
        </p>
      </div>
    </div>
  );
}

function WatchedList({ watched, onWatchedMovie, onDeleteWatchedMovie }) {
  return (
    <ul className="list">
      {watched.map((movie) => (
        <WatchedMoviesList
          movie={movie}
          onDeleteWatchedMovie={onDeleteWatchedMovie}
        />
      ))}
    </ul>
  );
}

function WatchedMoviesList({ movie, onDeleteWatchedMovie }) {
  return (
    <li key={movie.imdbID}>
      <img src={movie.poster} alt={`${movie.title} poster`} />
      <h3>{movie.Title}</h3>
      <div>
        <p>
          <span>⭐️</span>
          <span>{movie.imdbRating}</span>
        </p>
        <p>
          <span>🌟</span>
          <span>{movie.userRating}</span>
        </p>
        <p>
          <span>⏳</span>
          <span>{movie.runtime} min</span>
        </p>
        <button
          className="btn-delete"
          onClick={() => onDeleteWatchedMovie(movie.imdbID)}
        >
          X
        </button>
      </div>
    </li>
  );
}
