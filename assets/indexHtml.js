// assets/indexHtml.js

export const indexHtml = `
<!DOCTYPE html>
<html data-bs-theme="light" lang="en">

<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, shrink-to-fit=no">
  <title>SDEV 257 Group Project</title>

  <!-- Bootstrap + overrides -->
  <link rel="stylesheet"
        href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css">
  <link rel="stylesheet"
        href="https://raw.githubusercontent.com/Tomomi-H011/SDEV257-Team3/UI-Development/assets/css/bss-overrides.css">

  <style>
    body {
      margin: 0;
      padding: 0;
      min-height: 150vh; /* ensure page is scrollable */
    }
  </style>
</head>

<body>

  <!-- Hero section -->
  <section class="text-white py-4 py-xl-5">
    <div class="container">
      <div
        class="border rounded border-0 d-flex flex-column justify-content-center align-items-center p-4 py-5"
        style="background: linear-gradient(rgba(0,123,255,0.2), rgba(5,255,0,0.2));height: 280px;">
        <div class="row">
          <div
            class="col-md-10 col-xl-8 text-center d-flex d-sm-flex d-md-flex justify-content-center align-items-center justify-content-md-start align-items-md-center justify-content-xl-center mx-auto">
            <div>
              <h1 class="text-uppercase fw-bold mb-3">the ivy tech media guide</h1>
              <p class="mb-4">
                Welcome to the home for the greatest hits in movies and TV,
                curated for Ivy Tech students and staff!
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- Staff Picks section -->
  <section style="padding-top: 1em;margin-bottom: 5em;">
    <h1 style="text-align: center;font-weight: bold;padding-bottom: .75em;">Staff Picks</h1>
    <div class="container">
      <div class="card-group">

        <!-- Staff Pick 1: The Simpsons (TV) -->
        <div class="card" data-tmdb-id="456" data-tmdb-type="tv">
          <img class="img-fluid card-img-top w-100 d-block"
               width="600" height="900"
               src=""
               style="padding-right: 1em; padding-left: 1em;">
          <div class="card-body">
            <h4 class="card-title">The Simpsons</h4>
            <p class="card-text">Loading description…</p>
            <button class="btn btn-primary" type="button">Loading…</button>
          </div>
        </div>

        <!-- Staff Pick 2: Stranger Things (TV) -->
        <div class="card" data-tmdb-id="66732" data-tmdb-type="tv">
          <img class="img-fluid card-img-top w-100 d-block"
               width="600" height="900"
               src=""
               style="padding-right: 1em; padding-left: 1em;">
          <div class="card-body">
            <h4 class="card-title">Stranger Things</h4>
            <p class="card-text">Loading description…</p>
            <button class="btn btn-primary" type="button">Loading…</button>
          </div>
        </div>

        <!-- Staff Pick 3: Inception (Movie) -->
        <div class="card" data-tmdb-id="27205" data-tmdb-type="movie">
          <img class="img-fluid card-img-top w-100 d-block"
               width="600" height="900"
               src=""
               style="padding-right: 1em; padding-left: 1em;">
          <div class="card-body">
            <h4 class="card-title">Inception</h4>
            <p class="card-text">Loading description…</p>
            <button class="btn btn-primary" type="button">Loading…</button>
          </div>
        </div>

      </div>
    </div>
  </section>

  <!-- TMDB integration for HOME page:
       Populates each Staff Pick card (title, description, poster, button link)
  -->
  <script>
    document.addEventListener('DOMContentLoaded', () => {
      // TMDB Read Access Token (v4 auth)
      const READ_ACCESS_TOKEN =
        "eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIwYTE5NThmZmY4ZmU5ZTlmMTliODU3Yjc1N2I1OTcxOCIsIm5iZiI6MTc2MzA4OTEwMC4wNzMsInN1YiI6IjY5MTY5YWNjOWRlNDk4OGJiNDQwZTY1MiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.A5pF2sernxWTwLfyQUV-WNQ10MeFNEeVt8OxE4bADkU";

      const cards = document.querySelectorAll('.card[data-tmdb-id][data-tmdb-type]');

      cards.forEach(card => {
        const id = card.getAttribute('data-tmdb-id');
        const type = card.getAttribute('data-tmdb-type'); // "movie" or "tv"

        const url =
          'https://api.themoviedb.org/3/' + type + '/' + id + '?language=en-US';

        fetch(url, {
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
            const titleEl  = card.querySelector('.card-title');
            const textEl   = card.querySelector('.card-text');
            const buttonEl = card.querySelector('.btn');
            const imgEl    = card.querySelector('img');

            const title = data.name || data.title || 'Title unavailable';
            const overview =
              data.overview || 'Overview is not available for this title.';

            // Title from TMDB (optional but nice)
            if (titleEl)  titleEl.textContent  = title;

            // DESCRIPTION from TMDB API
            if (textEl)   textEl.textContent   = overview;

            // POSTER IMAGE from TMDB API
            if (imgEl && data.poster_path) {
              imgEl.src = 'https://image.tmdb.org/t/p/w500' + data.poster_path;
              imgEl.alt = title + ' poster';
            }

            // BUTTON links to TMDB detail page
            const basePath = type === 'movie'
              ? 'https://www.themoviedb.org/movie/'
              : 'https://www.themoviedb.org/tv/';
            const detailUrl = basePath + id;

            if (buttonEl) {
              buttonEl.textContent = 'View on IMDB';

              buttonEl.addEventListener('click', () => {
                // If running inside React Native WebView, send a message out
                if (window.ReactNativeWebView && window.ReactNativeWebView.postMessage) {
                  window.ReactNativeWebView.postMessage(JSON.stringify({
                    type: 'openExternal',
                    url: detailUrl,
                  }));
                } else {
                  // Fallback: normal browser behavior (web / Snack web iframe)
                  window.open(detailUrl, '_blank', 'noopener');
                }
              });
            
            }
          })
          .catch(error => {
            console.error('Error fetching TMDB data for Home page:', error);
            const textEl = card.querySelector('.card-text');
            if (textEl) {
              textEl.textContent = 'Details are temporarily unavailable.';
            }
          });
      });
    });
  </script>

  <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>
</body>

</html>
`;