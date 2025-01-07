const API_KEY = 'b75e218ac89bb4857d579a5bb3339778';
const BASE_URL = 'https://api.themoviedb.org/3';
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';

// Hämta top 10 högst rankade filmer
async function getTopRatedMovies() {
    try {
        const response = await fetch(`${BASE_URL}/movie/top_rated?api_key=${API_KEY}&language=sv-SE&page=1`);
        const data = await response.json();
        displayMovies(data.results.slice(0, 10), 'Top Rated');
    } catch (error) {
        handleError(error);
    }
}

// Hämta top 10 populära filmer
async function getPopularMovies() {
    try {
        const response = await fetch(`${BASE_URL}/movie/popular?api_key=${API_KEY}&language=sv-SE&page=1`);
        const data = await response.json();
        displayMovies(data.results.slice(0, 10), 'Popular');
    } catch (error) {
        handleError(error);
    }
}

// Sök filmer eller personer
async function search(query) {
    try {
        const response = await fetch(`${BASE_URL}/search/multi?api_key=${API_KEY}&language=sv-SE&query=${query}&page=1`);
        const data = await response.json();
        displaySearchResults(data.results);
    } catch (error) {
        handleError(error);
    }
}

// Visa filmer
function displayMovies(movies, category) {
    const container = document.getElementById('movies-container');
    container.innerHTML = `<h2>${category} Movies</h2>`;

    movies.forEach(movie => {
        const movieElement = document.createElement('div');
        movieElement.className = 'movie';
        movieElement.innerHTML = `
            <img src="${IMAGE_BASE_URL}${movie.poster_path}" alt="${movie.title}" />
            <h3>${movie.title}</h3>
            <p>Release Date: ${movie.release_date}</p>
        `;
        container.appendChild(movieElement);
    });
}

// Visa sökresultat
function displaySearchResults(results) {
    const container = document.getElementById('search-results');
    container.innerHTML = '';

    if (results.length === 0) {
        container.innerHTML = '<p>Inga resultat hittades. Vänligen försök med en annan sökterm.</p>';
        return;
    }

    results.forEach(item => {
        const resultElement = document.createElement('div');
        resultElement.className = 'result';

        if (item.media_type === 'movie') {
            resultElement.innerHTML = `
                <img src="${IMAGE_BASE_URL}${item.poster_path}" alt="${item.title}" />
                <h3>${item.title}</h3>
                <p>Release Date: ${item.release_date}</p>
                <p>${item.overview}</p>
            `;
        } else if (item.media_type === 'person') {
            resultElement.innerHTML = `
                <img src="${IMAGE_BASE_URL}${item.profile_path}" alt="${item.name}" />
                <h3>${item.name}</h3>
                <p>Känd för: ${item.known_for_department}</p>
                <ul>
                    ${item.known_for.map(work => `
                        <li>${work.media_type === 'movie' ? 'Film: ' : 'TV: '}${work.title || work.name}</li>
                    `).join('')}
                </ul>
            `;
        }

        container.appendChild(resultElement);
    });
}


// Hantera fel
function handleError(error) {
    const errorContainer = document.getElementById('error-message');
    errorContainer.textContent = `Ett fel inträffade: ${error.message}`;
    errorContainer.style.display = 'block';
}

// Event listeners
document.getElementById('search-form').addEventListener('submit', event => {
    event.preventDefault();
    const query = document.getElementById('search-input').value;
    if (query) search(query);
});

document.getElementById('top-rated-btn').addEventListener('click', getTopRatedMovies);
document.getElementById('popular-btn').addEventListener('click', getPopularMovies);
