// config/apiConfig.js

export const TMDB_API_KEY = "0a1958fff8fe9e9f19b857b757b59718";

export const TMDB_BASE_URL = "https://api.themoviedb.org/3";


// Usage example in another file
/*
import { TMDB_API_KEY, TMDB_BASE_URL } from "./apiConfig";


// Example: Fetch popular/trending movies

const response = await fetch(
  `${TMDB_BASE_URL}/movie/popular?api_key=${TMDB_API_KEY}`
);

// Example: Search for a movie by title
const response = await fetch(
  `${TMDB_BASE_URL}/search/movie?query=${query}&api_key=${TMDB_API_KEY}`
);

*/
