import { useState, useEffect } from "react";

export function useMovies(query, callBack) {
  // no props just arguments in custom hooks just like normal functions

  const KEY = "ce78686c";

  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  useEffect(() => {
    //optional chaining for functions
    // callBack?.();

    const controller = new AbortController(); //browser API

    async function fetchMovies() {
      try {
        setIsLoading(true);
        setError(""); //resetting error - before fetching the data
        const res = await fetch(
          ` https://www.omdbapi.com/?apikey=${KEY}&s=${query}`,
          { signal: controller.signal }
        );

        if (!res.ok)
          throw new Error("Something went wrong while fetching the movie data");

        const data = await res.json();

        if (data.Response === "False") throw new Error("Movie not found");

        setMovies(data.Search);
        setError("");

        //setting state happens asynchronously not immediately after we set
        // console.log(data);
        // setIsLoading(false);
      } catch (err) {
        if (err.name !== "AbortError") {
          console.log(err.message);
          setError(err.message);
        }
      } finally {
        setIsLoading(false);
      }
    }

    //removing error when there is no search query or empty string in the state or less than 3 no request made
    if (!query.length || query.length < 3) {
      setMovies([]);
      setError("");
      return;
    }

    // handleCloseMovie();
    fetchMovies();

    //clean up function - to stop previous request when new fetch request is made
    return function () {
      controller.abort();
    };
  }, [query]);
  return { movies, isLoading, error };
}
