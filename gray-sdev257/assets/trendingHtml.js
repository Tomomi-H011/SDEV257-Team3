// assets/trendingHtml.js
export const trendingHtml = `

<!DOCTYPE html>
<html data-bs-theme="light" lang="en">

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, shrink-to-fit=no">
    <title>SDEV 257 Group Project</title>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css">
    <link rel="stylesheet" href="https://raw.githubusercontent.com/Tomomi-H011/SDEV257-Team3/UI-Development/assets/css/bss-overrides.css">
    <style>
      body {
        margin: 0;
        padding: 0;
        min-height: 150vh; /* ensure scrollable height */
      }
      .card-group {
        margin-top: 1em;
        gap: 1em;
        flex-wrap: wrap; /* cards wrap nicely on small screens */
      }
      .card {
        flex: 1 1 250px;
      }
    </style>
</head> 

<body>
    <h1 style="margin-top: 1em;margin-left: .5em;">Trending Shows</h1>
    <div class="card-group" id="trending-shows"></div>

    <h1 style="margin-top: 1em;margin-left: .5em;">Trending Movies</h1>
    <div class="card-group" id="trending-movies"></div>

    <h1 style="margin-top: 1em;margin-left: .5em;">Popular Upcoming</h1>
    <div class="card-group" id="upcoming-movies"></div>

    <!-- TMDB integration script for TRENDING page -->
    <script>
      document.addEventListener('DOMContentLoaded', () => {
        const READ_ACCESS_TOKEN = "eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIwYTE5NThmZmY4ZmU5ZTlmMTliODU3Yjc1N2I1OTcxOCIsIm5iZiI6MTc2MzA4OTEwMC4wNzMsInN1YiI6IjY5MTY5YWNjOWRlNDk4OGJiNDQwZTY1MiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.A5pF2sernxWTwLfyQUV-WNQ10MeFNEeVt8OxE4bADkU";

        // Helper to build a card from a TMDB result
        function createCard(item, type) {
          const card = document.createElement('div');
          card.className = 'card';

          const img = document.createElement('img');
          img.className = 'img-fluid card-img-top w-100 d-block';
          img.alt = (item.name || item.title || 'Poster') + ' poster';

          if (item.poster_path) {
            img.src = 'https://image.tmdb.org/t/p/w500' + item.poster_path;
          } else {
            img.src = '';
          }

          const body = document.createElement('div');
          body.className = 'card-body';

          const titleEl = document.createElement('h4');
          titleEl.className = 'card-title';
          titleEl.textContent = item.name || item.title || 'Title unavailable';

          const textEl = document.createElement('p');
          textEl.className = 'card-text';
          textEl.textContent = item.overview || 'Overview is not available for this title.';

          const buttonEl = document.createElement('button');
          buttonEl.className = 'btn btn-primary';
          buttonEl.type = 'button';
          buttonEl.textContent = 'View on IMDB';

          const basePath = type === 'movie'
            ? 'https://www.themoviedb.org/movie/'
            : 'https://www.themoviedb.org/tv/';
          const detailUrl = basePath + item.id;

          buttonEl.addEventListener('click', () => {
            if (window.ReactNativeWebView && window.ReactNativeWebView.postMessage) {
              window.ReactNativeWebView.postMessage(JSON.stringify({
                type: 'openExternal',
                url: detailUrl,
              }));
            } else {
              window.open(detailUrl, '_blank', 'noopener');
            }
          });

          body.appendChild(titleEl);
          body.appendChild(textEl);
          body.appendChild(buttonEl);

          card.appendChild(img);
          card.appendChild(body);
          return card;
        }

        // Generic function to fetch from TMDB and render cards
        function populateSection(containerId, endpoint, type) {
          const container = document.getElementById(containerId);
          if (!container) return;

          fetch(endpoint, {
            method: 'GET',
            headers: {
              accept: 'application/json',
              Authorization: 'Bearer ' + READ_ACCESS_TOKEN
            }
          })
          .then(response => {
            if (!response.ok) {
              throw new Error('Network response was not ok');
            }
            return response.json();
          })
          .then(data => {
            container.innerHTML = ''; // clear any existing content
            const results = (data.results || []).slice(0, 5); // top 5

            results.forEach(item => {
              const card = createCard(item, type);
              container.appendChild(card);
            });

            if (results.length === 0) {
              container.innerHTML = '<p>No results available.</p>';
            }
          })
          .catch(error => {
            console.error('Error fetching TMDB data for', containerId, error);
            container.innerHTML = '<p>Details are temporarily unavailable.</p>';
          });
        }

        // Trending TV shows (week)
        populateSection(
          'trending-shows',
          'https://api.themoviedb.org/3/trending/tv/week?language=en-US',
          'tv'
        );

        // Trending movies (week)
        populateSection(
          'trending-movies',
          'https://api.themoviedb.org/3/trending/movie/week?language=en-US',
          'movie'
        );

        // Upcoming popular movies
        populateSection(
          'upcoming-movies',
          'https://api.themoviedb.org/3/movie/upcoming?language=en-US',
          'movie'
        );
      });
    </script>

    <script src="assets/bootstrap/js/bootstrap.min.js"></script>
</body>

</html>

`;